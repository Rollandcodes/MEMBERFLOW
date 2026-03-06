'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for small communities starting out.',
    features: ['Up to 100 members', '1 active campaign', 'Basic analytics', 'Community support'],
    cta: 'Current Plan',
    current: true,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Advanced automation for growing creators.',
    features: ['Unlimited members', 'Unlimited campaigns', 'Advanced AI sequences', 'Priority support', 'Custom webhooks'],
    cta: 'Upgrade to Pro',
    current: false,
    highlight: true,
  },
  {
    name: 'Business',
    price: '$99',
    description: 'Scale your community business with ease.',
    features: ['Everything in Pro', 'Multiple Whop accounts', 'Dedicated account manager', 'API access', 'SLA guarantee'],
    cta: 'Contact Sales',
    current: false,
  },
];

export default function BillingPlans() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and community usage limits.</p>
      </div>

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
              <Button 
                className={`w-full py-6 rounded-2xl font-bold transition-all ${plan.current ? 'bg-gray-100 text-gray-500 hover:bg-gray-100 cursor-default' : plan.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'}`}
                disabled={plan.current}
              >
                {plan.cta}
              </Button>
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
          <Button variant="outline" className="bg-white border-gray-200 text-gray-900 font-bold px-8 py-6 rounded-2xl hover:bg-gray-50 transition-all">
            Talk to Enterprise
          </Button>
        </div>
      </Card>
    </div>
  );
}
