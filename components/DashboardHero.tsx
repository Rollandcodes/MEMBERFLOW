'use client';

import React from 'react';
import { Sparkles, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardHeroProps {
  communityName: string;
  subscriptionPlan?: 'free' | 'pro';
}

export default function DashboardHero({ communityName, subscriptionPlan = 'free' }: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white shadow-2xl transition-all hover:shadow-indigo-500/20">
      {/* Background Orbs */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            <span>Automation Engine Active</span>
          </div>
          <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            Plan: {subscriptionPlan}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Scale your <span className="text-indigo-200 underline decoration-indigo-400 underline-offset-8">{communityName}</span> community with ease.
          </h1>
          
          <p className="text-indigo-100 text-lg max-w-lg">
            Automate onboarding, reduce churn, and engage members with AI-powered messaging.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 py-6 rounded-2xl shadow-lg">
              <Link href="/app/campaigns">
                Launch Campaign
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 font-bold px-8 py-6 rounded-2xl">
              <Link href="/app/analytics">View Analytics</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all cursor-default group">
            <Zap className="h-8 w-8 text-yellow-300 mb-4 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Uptime</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all cursor-default group">
            <ShieldCheck className="h-8 w-8 text-green-300 mb-4 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold">Verified</div>
            <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Security</div>
          </div>
        </div>
      </div>
    </div>
  );
}
