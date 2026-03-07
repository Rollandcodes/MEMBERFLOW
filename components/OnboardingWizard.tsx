'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function OnboardingWizard({ companyName }: { companyName: string }) {
  const [step, setStep] = useState(1);
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState("Hey {{first_name}} 👋 Welcome to the community! So glad to have you here.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    // In a real app we submit to an API route to create the campaign here.
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg shadow-2xl border-indigo-100 overflow-hidden">
        {step === 1 && (
          <>
            <div className="bg-indigo-600 p-8 text-center text-white">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-indigo-200" />
              <CardTitle className="text-2xl font-black mb-2">Welcome to MemberFlow!</CardTitle>
              <CardDescription className="text-indigo-100">
                Hi {companyName}, your Whop account is successfully connected.
              </CardDescription>
            </div>
            <CardContent className="p-8 text-center">
              <p className="text-slate-600 mb-6 font-medium">
                Let's set up your very first automated welcome sequence. It takes less than 2 minutes and will instantly boost your member engagement.
              </p>
              <Button onClick={() => setStep(2)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6 rounded-xl shadow-lg shadow-indigo-200">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Step 1 of 3</span>
                <span className="text-xs text-slate-400">Products</span>
              </div>
              <CardTitle>Which product are we automating?</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-slate-500 mb-4 font-medium">Give your automation a name or specify the product it applies to.</p>
              <Input
                placeholder="e.g. VIP Alpha Pass"
                value={productName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                className="text-lg py-6 rounded-xl font-medium"
              />
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="font-bold">Back</Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!productName.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold px-6"
              >
                Next Step
              </Button>
            </CardFooter>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader className="bg-slate-50 border-b">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Step 2 of 3</span>
                <span className="text-xs text-slate-400">Message</span>
              </div>
              <CardTitle>Customize your welcome message</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-slate-500 font-medium">
                This message will be sent to every new member who joins <strong className="text-slate-900">{productName}</strong>. You can use <code className="bg-slate-100 text-indigo-600 px-1 py-0.5 rounded font-bold">{`{{first_name}}`}</code> as a variable.
              </p>
              <Textarea
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                className="min-h-[140px] text-base resize-none rounded-xl font-medium"
              />
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} className="font-bold">Back</Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!message.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold px-6"
              >
                Next Step
              </Button>
            </CardFooter>
          </>
        )}

        {step === 4 && (
          <>
            <CardHeader className="bg-slate-50 border-b text-center py-8">
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Ready to go live!</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-2">
              <p className="text-slate-600 font-medium">
                Your automation for <strong className="text-slate-900">{productName}</strong> is fully configured.
              </p>
              <p className="text-slate-500 text-sm font-medium">
                As soon as you activate it, new members will start receiving your welcome DM.
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                onClick={handleFinish}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 rounded-xl shadow-lg shadow-green-200 font-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Activating..." : "Activate Automation Now"}
              </Button>
            </CardFooter>
          </>
        )}

      </Card>
    </div>
  );
}
