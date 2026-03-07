'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';
import Link from 'next/link';
import WhopCheckout from './WhopCheckout';

const growthPlanId = process.env.NEXT_PUBLIC_WHOP_GROWTH_PLAN_ID || 'plan_moC2bR46VnYNr';
const proPlanId = process.env.NEXT_PUBLIC_WHOP_PRO_PLAN_ID || 'plan_FhYLwoLfNxTCS';
const hasValidCheckoutConfig =
  !growthPlanId.startsWith('your_') &&
  !proPlanId.startsWith('your_');

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for new creators just starting out.',
    features: ['1 Community', '100 Automated Messages / mo', 'Standard Welcome DM'],
    cta: 'Current Plan',
    current: true,
  },
  {
    name: 'Growth',
    price: '$19',
    description: 'Best fit for your current automation + AI feature set.',
    features: ['Unlimited Communities', '2,500 Automated Messages / mo', 'Custom Drip Sequences', 'Priority Support'],
    cta: 'Upgrade to Growth',
    current: false,
    highlight: true,
    planId: growthPlanId,
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For larger communities that need max scale.',
    features: ['Unlimited Communities', 'Unlimited Automated Messages', 'Advanced Custom Webhooks', 'Dedicated Success Manager'],
    cta: 'Upgrade to Pro',
    current: false,
    planId: proPlanId,
  },
];

export default function BillingPlans() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and community usage limits.</p>
      </div>

      {!hasValidCheckoutConfig && (
        <Card className="border border-amber-200 bg-amber-50 rounded-2xl">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-amber-800">
              Checkout is not fully configured. Set valid values for
              <code className="mx-1">NEXT_PUBLIC_WHOP_GROWTH_PLAN_ID</code>
              and
              <code className="mx-1">NEXT_PUBLIC_WHOP_PRO_PLAN_ID</code>
              in Vercel environment variables.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative flex flex-col rounded-3xl border-gray-100 ${plan.highlight ? 'shadow-2xl shadow-indigo-100 border-indigo-100 ring-2 ring-indigo-600' : 'shadow-sm'}`}>
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                Recommended
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
              <CardDescription className="text-gray-500">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                    <Check className="h-4 w-4 text-indigo-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.current ? (
                <Button
                  className="w-full py-6 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-100 cursor-default"
                  disabled
                >
                  {plan.cta}
                </Button>
              ) : (
                <WhopCheckout
                  planId={plan.planId}
                  buttonText={plan.cta}
                  className={`w-full py-6 rounded-2xl font-bold transition-all ${plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'}`}
                />
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-indigo-50 border-none rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Zap className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Need a custom enterprise solution?</h3>
              <p className="text-gray-600 font-medium">For communities with over 50,000 members, we offer tailored pricing and infrastructure.</p>
            </div>
          </div>
          <Button asChild variant="outline" className="bg-white border-gray-200 text-gray-900 font-bold px-8 py-6 rounded-2xl hover:bg-gray-50 transition-all">
            <Link href="/pricing">View Full Pricing</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
