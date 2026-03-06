import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Users, BarChart3, MessageSquare, ArrowRight } from 'lucide-react';
import DashboardLayout from '../dashboard/layout';

export default function DiscoverPage() {
  return (
    <DashboardLayout>
      <div className="space-y-12 pb-12">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-900 p-12 text-white shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/30 px-4 py-1 text-sm font-bold backdrop-blur-md border border-indigo-400/30">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>Introducing MemberFlow for Whop</span>
            </div>
            <h1 className="text-5xl font-black tracking-tight leading-tight">
              Automated DM + onboarding sequences that increase member activation and reduce churn.
            </h1>
            <p className="text-indigo-100 text-xl leading-relaxed">
              Connect your Whop community and start growing today. Everything you need to automate your community growth.
            </p>
            <div className="pt-4">
              <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-10 py-7 rounded-2xl text-lg shadow-xl shadow-indigo-950/20">
                Connect Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <MessageSquare className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Auto-Welcome DMs</h3>
            <p className="text-gray-500 leading-relaxed">Send personalized welcome messages to every new member automatically. Increase initial engagement and make them feel at home.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
              <Zap className="h-7 w-7 text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Sequences</h3>
            <p className="text-gray-500 leading-relaxed">Build multi-step sequences that deliver value over time. Perfect for onboarding, tutorials, or retention flows.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 transition-colors">
              <BarChart3 className="h-7 w-7 text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Deep Analytics</h3>
            <p className="text-gray-500 leading-relaxed">Track engagement and churn risks with detailed analytics. Identify inactive members and bring them back with targeted outreach.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
