'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, Sparkles, MessageCircle } from 'lucide-react';

/**
 * Member Experience Page
 * This is the UI that community members see when they interact with MemberFlow inside Whop.
 */
export default function ExperiencePage() {
  const params = useParams();
  const experienceId = params.experienceId;

  // In a real app, you'd fetch the specific experience/campaign data based on experienceId
  // For now, we render a high-quality "Welcome & Onboarding" template.

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <CardHeader className="text-center pt-10 pb-6">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Sparkles className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome to the Community!
            </CardTitle>
            <p className="text-gray-500 mt-2 text-lg">
              We're excited to have you here. Let's get you started.
            </p>
          </CardHeader>

          <CardContent className="space-y-8 px-6 pb-12">
            {/* Onboarding Steps */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Step 1: Complete your Profile</h3>
                  <p className="text-sm text-gray-500">Add a bio and avatar so others can recognize you.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Star className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Step 2: Say Hello</h3>
                  <p className="text-sm text-gray-500">Introduce yourself in the #general channel.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Step 3: Explore Channels</h3>
                  <p className="text-sm text-gray-500">Browse the available channels and start contributing.</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
                Go to Community Dashboard
              </Button>
              <p className="text-center text-xs text-gray-400 mt-4">
                Experience ID: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">{experienceId}</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
