export type SubscriptionStatus = {
  isActive: boolean;
  plan: 'free' | 'pro';
  expiresAt: Date | null;
  daysRemaining: number | null;
  isCancelling: boolean;
  isPastDue: boolean;
};

type WhopMembership = {
  id?: string;
  status?: string;
  cancel_at_period_end?: boolean;
  is_past_due?: boolean;
  payment_status?: string;
  current_period_end?: string | number | null;
  expires_at?: string | number | null;
  renewal_date?: string | number | null;
  plan_id?: string | null;
  product_id?: string | null;
  plan?: { id?: string | null } | null;
  product?: { id?: string | null } | null;
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
    .map((membership) => {
      const expiresAt =
        parseDate(membership.current_period_end) ||
        parseDate(membership.expires_at) ||
        parseDate(membership.renewal_date);
      return { membership, expiresAt };
    })
    .sort((a, b) => (b.expiresAt?.getTime() || 0) - (a.expiresAt?.getTime() || 0));

  return withExpiry[0]?.membership || memberships[0];
}

export async function getSubscriptionStatus(
  accessToken: string | null | undefined,
  previousPlan: 'free' | 'pro' = 'free'
): Promise<SubscriptionStatus> {
  const fallback: SubscriptionStatus = {
    isActive: true,
    plan: previousPlan,
    expiresAt: null,
    daysRemaining: null,
    isCancelling: false,
    isPastDue: false,
  };

  if (!accessToken) return fallback;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://api.whop.com/v5/memberships?status=active', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return fallback;
    }

    const raw = await res.json();
    const memberships = Array.isArray(raw)
      ? (raw as WhopMembership[])
      : Array.isArray(raw?.data)
        ? (raw.data as WhopMembership[])
        : [];

    const activeMemberships = memberships.filter(
      (membership) => !membership.status || membership.status.toLowerCase() === 'active'
    );

    const primary = pickPrimaryMembership(activeMemberships);
    const proPlanId = process.env.NEXT_PUBLIC_WHOP_PRO_PLAN_ID || process.env.WHOP_PRO_PLAN_ID || '';

    const hasProMembership = activeMemberships.some((membership) => {
      const membershipPlanIds = [
        membership.plan_id,
        membership.product_id,
        membership.plan?.id,
        membership.product?.id,
      ].filter(Boolean) as string[];

      if (!proPlanId) {
        return membershipPlanIds.length > 0;
      }

      return membershipPlanIds.includes(proPlanId);
    });

    const plan: 'free' | 'pro' = hasProMembership ? 'pro' : 'free';
    const expiresAt = primary
      ? parseDate(primary.current_period_end) || parseDate(primary.expires_at) || parseDate(primary.renewal_date)
      : null;

    const isCancelling = Boolean(primary?.cancel_at_period_end);
    const isPastDue = Boolean(
      primary?.is_past_due ||
        (primary?.payment_status || '').toLowerCase() === 'past_due' ||
        (primary?.status || '').toLowerCase() === 'past_due'
    );

    // Free users can remain active without a paid membership.
    const isActive = activeMemberships.length > 0 ? true : previousPlan !== 'pro';

    return {
      isActive,
      plan,
      expiresAt,
      daysRemaining: getDaysRemaining(expiresAt),
      isCancelling,
      isPastDue,
    };
  } catch {
    return fallback;
  }
}
