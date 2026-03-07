import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, MessageSquare, CheckCircle2, Sparkles, Quote } from 'lucide-react';

import { cookies } from 'next/headers';

const oauthUrl = '/api/auth/login';

export default async function LandingPage() {
  const cookieStore = cookies();
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

        <section id="how-it-works" className="w-full py-12 md:py-20 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">How MemberFlow Works</h2>
              <p className="text-slate-500 mt-3 text-lg">A simple 3-step setup that gets your first automation live in minutes.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <div className="text-xs font-black tracking-widest text-indigo-600 uppercase">Step 1</div>
                <h3 className="text-xl font-black mt-2">Connect Your Whop</h3>
                <p className="text-slate-600 mt-3">Secure OAuth connection links your company and unlocks member + campaign data.</p>
              </div>
              <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <div className="text-xs font-black tracking-widest text-indigo-600 uppercase">Step 2</div>
                <h3 className="text-xl font-black mt-2">Launch a Template</h3>
                <p className="text-slate-600 mt-3">Choose a prebuilt automation from Discover and publish it instantly to your campaigns.</p>
              </div>
              <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
                <div className="text-xs font-black tracking-widest text-indigo-600 uppercase">Step 3</div>
                <h3 className="text-xl font-black mt-2">Optimize With AI</h3>
                <p className="text-slate-600 mt-3">Use AI DM Writer and streaming sequence generation to improve onboarding and retention.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="ai" className="w-full py-12 md:py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-8 md:p-10 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-black tracking-wider uppercase">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Features Live
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-3">Generate High-Converting DMs in Seconds</h3>
                  <p className="text-slate-600 mt-3">MemberFlow includes an AI DM writer, AI churn risk insights, and a streaming drip-sequence generator directly inside the app.</p>
                </div>
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
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Pricing Built for Community Growth</h2>
              <p className="text-slate-500 mt-3 text-lg">Start free, then scale into Growth and Pro as your automations and member volume expand.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { name: 'Free', price: '$0', features: ['1 Community', '100 Automated Messages / mo', 'Standard Welcome DM'] },
                { name: 'Growth', price: '$19', features: ['Unlimited Communities', '2,500 Automated Messages / mo', 'Custom Drip Sequences'], highlight: true },
                { name: 'Pro', price: '$49', features: ['Unlimited Automated Messages', 'Advanced Custom Webhooks', 'Dedicated Success Manager'] },
              ].map((plan) => (
                <div key={plan.name} className={`rounded-3xl border p-6 shadow-sm ${plan.highlight ? 'border-indigo-300 ring-2 ring-indigo-200 bg-white' : 'border-slate-200 bg-white'}`}>
                  <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                  <div className="mt-3 text-4xl font-black text-slate-900">{plan.price}<span className="text-base font-semibold text-slate-500">/month</span></div>
                  <ul className="mt-5 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm font-semibold text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-indigo-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/pricing" className="inline-flex items-center text-indigo-700 hover:text-indigo-800 font-bold">
                View full pricing and checkout options
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section id="social-proof" className="w-full py-12 md:py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10">
              <div className="flex items-start gap-3">
                <Quote className="h-6 w-6 text-indigo-500 mt-1" />
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Creator Testimonial Placeholder</h3>
                  <p className="text-slate-600 mt-3 text-lg">"MemberFlow helped us go from manual onboarding chaos to automated welcome flows that keep members engaged from day one."</p>
                  <p className="text-sm font-bold text-slate-500 mt-4">- Founder, Community Brand (case study coming soon)</p>
                </div>
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
