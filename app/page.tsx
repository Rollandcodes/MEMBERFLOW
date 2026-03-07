import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, MessageSquare, CheckCircle2, Quote } from 'lucide-react';

import { cookies } from 'next/headers';

const oauthUrl = '/api/auth/login';

export default async function LandingPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("memberflow_company_id");

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
          {isLoggedIn ? (
            <Link
              href="/app/dashboard"
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <a
              href={oauthUrl}
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Connect with Whop
            </a>
          )}
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isLoggedIn ? (
                  <Link
                    href="/app/dashboard"
                    className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-200 transition-colors"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <a
                    href={oauthUrl}
                    className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-200 transition-colors"
                  >
                    Connect with Whop
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                )}

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

        <section id="how-it-works" className="w-full py-12 md:py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">How It Works</h2>
              <p className="text-slate-500 mt-3 text-lg">Three simple steps to automate member onboarding.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-white border border-indigo-100 p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-indigo-600 text-white text-xl font-black flex items-center justify-center">1</div>
                <h3 className="text-xl font-black mt-4">Connect Your Whop Community</h3>
                <p className="text-slate-600 mt-3">Connect your Whop account with one click. We securely sync your member list automatically.</p>
              </div>
              <div className="rounded-3xl bg-white border border-indigo-100 p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-indigo-600 text-white text-xl font-black flex items-center justify-center">2</div>
                <h3 className="text-xl font-black mt-4">Build Your DM Sequence</h3>
                <p className="text-slate-600 mt-3">Create personalized welcome messages and multi-step drip sequences in minutes.</p>
              </div>
              <div className="rounded-3xl bg-white border border-indigo-100 p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-indigo-600 text-white text-xl font-black flex items-center justify-center">3</div>
                <h3 className="text-xl font-black mt-4">Members Get Welcomed Automatically</h3>
                <p className="text-slate-600 mt-3">Every new member receives your sequence on autopilot. You focus on building, we handle the rest.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="ai-features" className="w-full py-12 md:py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-8 md:p-10 shadow-sm">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">AI Features That Save Hours Every Week</h2>
                <p className="text-slate-600 mt-3 text-lg">
                  Use the AI DM writer to generate welcome messages, stream multi-step onboarding sequences, and get churn insights before members go inactive.
                </p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                  <h3 className="text-base font-black text-slate-900">AI DM Writer</h3>
                  <p className="text-sm text-slate-600 mt-2">Generate high-converting onboarding messages in seconds based on your niche and tone.</p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                  <h3 className="text-base font-black text-slate-900">Sequence Generator</h3>
                  <p className="text-sm text-slate-600 mt-2">Create full 3-step drip campaigns with timing and copy tailored to your community goals.</p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                  <h3 className="text-base font-black text-slate-900">Churn Insights</h3>
                  <p className="text-sm text-slate-600 mt-2">Get actionable retention recommendations from real engagement signals.</p>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/app/campaigns" className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-colors">
                  Try AI Campaign Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-20 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Pricing</h2>
              <p className="text-slate-500 mt-3 text-lg">Simple plans for communities at every stage.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-slate-900">Free</h3>
                <div className="mt-3 text-4xl font-black text-slate-900">$0<span className="text-base font-semibold text-slate-500">/month</span></div>
                <ul className="mt-5 space-y-2">
                  {['1 campaign', 'Up to 100 members/month', 'Basic analytics', 'Whop integration'].map((feature) => (
                    <li key={feature} className="flex items-center text-sm font-semibold text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href={oauthUrl} className="mt-6 inline-flex items-center justify-center rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors">
                  Get Started Free
                </a>
              </div>

              <div className="rounded-3xl border-2 border-indigo-300 bg-white p-6 shadow-sm relative">
                <span className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Most Popular</span>
                <h3 className="text-xl font-black text-slate-900">Pro</h3>
                <div className="mt-3 text-4xl font-black text-slate-900">$29<span className="text-base font-semibold text-slate-500">/month</span></div>
                <ul className="mt-5 space-y-2">
                  {['Unlimited campaigns', 'Unlimited members', 'AI DM writer', 'Deep analytics', 'Priority support'].map((feature) => (
                    <li key={feature} className="flex items-center text-sm font-semibold text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href={oauthUrl} className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
                  Upgrade to Pro
                </a>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/pricing" className="inline-flex items-center text-indigo-700 hover:text-indigo-800 font-bold">
                View full pricing and checkout options
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="social-proof" className="w-full py-12 md:py-20 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="rounded-3xl border border-indigo-100 bg-white p-8 md:p-12 text-center">
              <Quote className="h-8 w-8 text-indigo-500 mx-auto" />
              <p className="text-slate-700 mt-4 text-xl md:text-2xl italic leading-relaxed">
                "MemberFlow doubled our new member activation rate in the first week. The automated welcome sequences are a game changer."
              </p>
              <p className="text-slate-500 mt-4 font-semibold">- Alex K., Crypto Trading Community Founder</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2026 MemberFlow Inc. All rights reserved.</p>
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
