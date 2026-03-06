import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Users, BarChart3, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Zap className="h-6 w-6 text-indigo-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">MemberFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-indigo-600 transition-colors" href="/app/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:text-indigo-600 transition-colors" href="#features">
            Features
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900">
                  Automate Your <span className="text-indigo-600">Whop</span> Community Growth
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Automated DM + onboarding sequences that increase member activation and reduce churn. Connect your community and start growing today.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-200" asChild>
                  <Link href="/app/dashboard">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-3xl bg-gray-50 hover:bg-indigo-50 transition-colors">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <MessageSquare className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">Auto-Welcome DMs</h3>
                <p className="text-gray-500">Send personalized welcome messages to every new member automatically. Increase initial engagement.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-3xl bg-gray-50 hover:bg-indigo-50 transition-colors">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <Zap className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">Smart Sequences</h3>
                <p className="text-gray-500">Build multi-step sequences that deliver value over time. Perfect for onboarding or retention flows.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-3xl bg-gray-50 hover:bg-indigo-50 transition-colors">
                <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold">Deep Analytics</h3>
                <p className="text-gray-500">Track engagement and churn risks with detailed analytics. Identify inactive members early.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 MemberFlow Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
