export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$19/month',
    campaigns: 1,
    features: ['1 Campaign', 'Basic Analytics', 'Standard Support'],
    whop_plan_id: 'plan_starter_id'
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$49/month',
    campaigns: 5,
    features: ['5 Campaigns', 'Advanced Analytics', 'Priority Support'],
    whop_plan_id: 'plan_growth_id'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$99/month',
    campaigns: 'Unlimited',
    features: ['Unlimited Campaigns', 'Full Analytics Suite', '24/7 Premium Support'],
    whop_plan_id: 'plan_pro_id'
  }
];

export function canCreateCampaign(currentCampaignCount: number, planId: string) {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return false;
  if (plan.campaigns === 'Unlimited') return true;
  return currentCampaignCount < (plan.campaigns as number);
}
