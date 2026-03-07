export type SubscriptionStatus = {
  isActive: boolean;
  plan: 'free' | 'pro';
  expiresAt: Date | null;
  daysRemaining: number | null;
  isCancelling: boolean;
  isPastDue: boolean;
  manageUrl?: string | null;
};

type WhopMembership = {
  status?: string;
  cancel_at_period_end?: boolean;
  renewal_period_end?: string | number | null;
  manage_url?: string | null;
  product?: {
    title?: string | null;
  } | null;
};

const dayMs = 24 * 60 * 60 * 1000;

function parseDate(value: string | number | null | undefined): Date | null {
  if (!value) return null;
  if (typeof value === 'number') {
    // Whop fields are sometimes unix seconds.
    const asMs = value < 10_000_000_000 ? value * 1000 : value;
    const date = new Date(asMs);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const asNumber = Number(value);
  if (!Number.isNaN(asNumber) && value.trim() !== '') {
    const asMs = asNumber < 10_000_000_000 ? asNumber * 1000 : asNumber;
    const date = new Date(asMs);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getDaysRemaining(expiresAt: Date | null): number | null {
  if (!expiresAt) return null;
  return Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / dayMs));
}

function pickPrimaryMembership(memberships: WhopMembership[]): WhopMembership | null {
  if (!memberships.length) return null;

  const withExpiry = memberships
    .map((membership) => ({
      membership,
      expiresAt: parseDate(membership.renewal_period_end),
    }))
    .sort((a, b) => (b.expiresAt?.getTime() || 0) - (a.expiresAt?.getTime() || 0));

  return withExpiry[0]?.membership || memberships[0];
}

export async function getUserSubscription(accessToken: string): Promise<SubscriptionStatus> {
  const fallback: SubscriptionStatus = {
    isActive: false,
    plan: 'free',
    expiresAt: null,
    daysRemaining: null,
    isCancelling: false,
    isPastDue: false,
    manageUrl: null,
  };

  if (!accessToken) {
    return fallback;
  }

  try {
    const res = await fetch('https://api.whop.com/v5/memberships', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return fallback;
    }

    const raw = await res.json();
    const memberships = Array.isArray(raw)
      ? (raw as WhopMembership[])
      : Array.isArray(raw?.data)
        ? (raw.data as WhopMembership[])
        : [];

    const primary = pickPrimaryMembership(memberships);
    const activeMembership = memberships.find((membership) => (membership.status || '').toLowerCase() === 'active');
    const pastDueMembership = memberships.find((membership) => (membership.status || '').toLowerCase() === 'past_due');

    const targetMembership = activeMembership || pastDueMembership || primary;
    const productTitle = targetMembership?.product?.title || '';
    const plan: 'free' | 'pro' = /pro/i.test(productTitle) ? 'pro' : 'free';
    const isActive = Boolean(activeMembership);
    const expiresAt = parseDate(targetMembership?.renewal_period_end);
    const isCancelling = Boolean(targetMembership?.cancel_at_period_end);
    const isPastDue = Boolean(pastDueMembership);

    return {
      isActive,
      plan,
      expiresAt,
      daysRemaining: getDaysRemaining(expiresAt),
      isCancelling,
      isPastDue,
      manageUrl: targetMembership?.manage_url || null,
    };
  } catch {
    return fallback;
  }
}

// Backward-compatible export used elsewhere in the app.
export async function getSubscriptionStatus(
  accessToken: string | null | undefined,
  previousPlan: 'free' | 'pro' = 'free'
): Promise<SubscriptionStatus> {
  if (!accessToken) {
    return {
      isActive: previousPlan === 'free',
      plan: previousPlan,
      expiresAt: null,
      daysRemaining: null,
      isCancelling: false,
      isPastDue: false,
      manageUrl: null,
    };
  }

  const result = await getUserSubscription(accessToken);
  if (!result.isActive && previousPlan === 'free') {
    return { ...result, isActive: true, plan: 'free' };
  }

  return result;
}
