'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { PLANS } from '@/lib/billing';

export default function BillingPlans() {
  const handleUpgrade = (planId: string) => {
    // In a real application, you'd redirect to Whop Checkout
    console.log('Upgrading to plan:', planId);
    alert('Redirecting to Whop checkout...');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="mt-2 text-gray-500">Scale your community automation with MemberFlow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={plan.id === 'growth' ? 'border-indigo-500 ring-2 ring-indigo-200' : ''}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">{plan.name}</CardTitle>
              <div className="mt-4 text-center">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price.split('/')[0]}</span>
                <span className="text-gray-500">/{plan.price.split('/')[1]}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full ${plan.id === 'growth' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800 hover:bg-gray-900'}`}
              >
                {plan.id === 'starter' ? 'Get Started' : 'Upgrade Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
