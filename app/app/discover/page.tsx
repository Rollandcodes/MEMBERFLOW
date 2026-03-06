'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, ShieldCheck, Heart, Sparkles, Send, Users, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Public Discover/Landing Page
 * This is the landing page for MemberFlow.
 */
export default function DiscoverPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-indigo-100 text-sm font-bold mb-8 animate-bounce">
            <Sparkles className="h-4 w-4" />
            <span>Introducing MemberFlow for Whop</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
            Automate onboarding & <br />
            <span className="text-indigo-400">retention for paid communities</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Automated DM + onboarding sequences that increase member activation and reduce churn. 
            Connect your Whop community and start growing today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-16 px-10 text-xl font-bold bg-white text-indigo-900 hover:bg-indigo-50 rounded-2xl shadow-xl transition-all active:scale-95"
              onClick={() => router.push('/app/dashboard')}
            >
              Get Started for Free
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto h-16 px-10 text-xl font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-2xl transition-all"
            >
              Watch Demo
            </Button>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Powerful Features for Creators</h2>
            <p className="text-lg text-gray-600">Everything you need to automate your community growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
              <CardHeader>
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <Send className="h-7 w-7 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Smart DMs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Send personalized welcome messages to every new member automatically. 
                  Increase initial engagement and make them feel at home.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Drip Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Build multi-step sequences that deliver value over time. 
                  Perfect for onboarding, tutorials, or retention flows.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 duration-300">
              <CardHeader>
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Member Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Track engagement and churn risks with detailed analytics. 
                  Identify inactive members and bring them back with targeted outreach.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Ready to grow your community?</h2>
          <Button 
            size="lg" 
            className="h-16 px-12 text-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl transition-all active:scale-95 group"
            onClick={() => router.push('/app/dashboard')}
          >
            Get Started with MemberFlow
            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xl font-bold text-indigo-600">MemberFlow</span>
            <p className="text-sm text-gray-500">Automate your community onboarding</p>
          </div>
          <div className="flex items-center gap-8">
            <a href="/privacy" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="mailto:support@memberflow.app" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Support</a>
          </div>
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MemberFlow
          </div>
        </div>
      </footer>
    </div>
  );
}
