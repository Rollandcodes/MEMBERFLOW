'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Rocket, ShieldCheck, Zap, Mail, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setStep(Math.min(step + 1, totalSteps));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-8 flex justify-between items-center px-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
              step >= i ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-200 text-slate-500"
            )}>
              {step > i ? <CheckCircle2 className="h-6 w-6" /> : i}
            </div>
            {i < 4 && (
              <div className={cn(
                "w-20 h-1 mx-2 rounded-full transition-all duration-300",
                step > i ? "bg-indigo-600" : "bg-slate-200"
              )} />
            )}
          </div>
        ))}
      </div>

      <Card className="shadow-2xl border-none">
        {step === 1 && (
          <CardContent className="pt-10 pb-10 space-y-6 text-center">
            <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <Rocket className="h-10 w-10 text-indigo-600" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">Welcome to MemberFlow!</CardTitle>
              <CardDescription className="text-lg">Let's set up your community automation in 60 seconds.</CardDescription>
            </div>
            <div className="space-y-4 pt-4 max-w-sm mx-auto text-left">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">Authenticated with Whop</span>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">AI Campaign Generator Ready</span>
              </div>
            </div>
          </CardContent>
        )}

        {step === 2 && (
          <CardContent className="pt-10 pb-10 space-y-6">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-indigo-900">1. What's your community type?</CardTitle>
              <CardDescription>We'll use this to tailor your automation sequences.</CardDescription>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {['SaaS / Software', 'E-commerce', 'Crypto / Web3', 'Coaching / Courses'].map((type) => (
                <Button key={type} variant="outline" className="h-20 text-lg hover:border-indigo-500 hover:bg-indigo-50 border-slate-200">
                  {type}
                </Button>
              ))}
            </div>
          </CardContent>
        )}

        {step === 3 && (
          <CardContent className="pt-10 pb-10 space-y-6">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-indigo-900">2. Define your first campaign</CardTitle>
              <CardDescription>Most communities start with a Welcome Sequence.</CardDescription>
            </div>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Campaign Name</label>
                <Input placeholder="e.g. Day 0 Welcome" className="h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Goal</label>
                <Input placeholder="e.g. Get members to join Discord" className="h-12" />
              </div>
            </div>
          </CardContent>
        )}

        {step === 4 && (
          <CardContent className="pt-10 pb-10 space-y-6 text-center">
            <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">You're all set!</CardTitle>
              <CardDescription className="text-lg">Your first campaign is ready to be launched with AI.</CardDescription>
            </div>
            <Button className="mt-8 bg-indigo-600 hover:bg-indigo-700 w-full py-6 text-xl font-bold shadow-lg shadow-indigo-200">
              Generate & Launch First Campaign
            </Button>
          </CardContent>
        )}

        <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50">
          <Button variant="ghost" onClick={prevStep} disabled={step === 1} className="text-slate-500 hover:text-slate-900">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {step < totalSteps && (
            <Button onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-700 px-8 font-bold">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
