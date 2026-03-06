'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Rocket, Zap, Users } from 'lucide-react';

const steps = [
  { id: 1, title: 'Connect Whop', description: 'Link your Whop account to import members.', icon: Rocket },
  { id: 2, title: 'Import Members', description: 'Select which community members to sync.', icon: Users },
  { id: 3, title: 'Create Campaign', description: 'Set up your first automated welcome flow.', icon: Zap },
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden">
      <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black mb-2">Getting Started</h2>
            <p className="text-indigo-100 text-sm font-medium">Follow these steps to launch your community automation.</p>
          </div>
          <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </div>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.id} className={`flex items-start gap-6 transition-opacity ${currentStep < step.id ? 'opacity-40' : 'opacity-100'}`}>
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                currentStep > step.id ? 'bg-green-500 text-white' : 
                currentStep === step.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {currentStep > step.id ? <Check className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
              </div>
              <div className="space-y-1">
                <h3 className={`font-black ${currentStep === step.id ? 'text-gray-900' : 'text-gray-500'}`}>{step.title}</h3>
                <p className="text-sm text-gray-400 font-medium">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-8 bg-gray-50/50 border-t border-gray-50">
        <div className="flex w-full justify-between items-center">
          <div className="text-sm font-bold text-gray-400">Step {currentStep} of 3</div>
          <Button 
            onClick={() => setCurrentStep(prev => Math.min(prev + 1, 3))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-6 rounded-2xl shadow-lg shadow-indigo-100"
          >
            {currentStep === 3 ? 'Finish Setup' : 'Next Step'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
