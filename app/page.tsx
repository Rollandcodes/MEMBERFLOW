'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleWhopLogin = async () => {
    setIsLoading(true);
    // In a real application, you'd redirect to Whop OAuth login
    // For this example, we'll simulate it by redirecting to the dashboard
    setTimeout(() => {
      router.push('/app/dashboard');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-indigo-600">MemberFlow</CardTitle>
          <p className="text-gray-500 mt-2">Automate your creator community onboarding</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-4">
          <Button 
            className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            onClick={handleWhopLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Redirecting to Whop...' : 'Connect with Whop'}
          </Button>
          <p className="mt-4 text-xs text-center text-gray-400">
            Securely authenticate using your Whop creator account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
