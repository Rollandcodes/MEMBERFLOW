import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import WhopCheckout from '@/components/WhopCheckout';

const growthPlanId = process.env.NEXT_PUBLIC_WHOP_GROWTH_PLAN_ID || 'plan_moC2bR46VnYNr';
const proPlanId = process.env.NEXT_PUBLIC_WHOP_PRO_PLAN_ID || 'plan_FhYLwoLfNxTCS';
const hasValidCheckoutConfig =
    !growthPlanId.startsWith('your_') &&
    !proPlanId.startsWith('your_');

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#060810] text-white flex flex-col font-sans">
            {/* Glow Effect */}
            <div className="absolute top-0 inset-x-0 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none" />

            <header className="relative z-10 px-6 h-20 flex items-center border-b border-white/10 max-w-7xl mx-auto w-full">
                <Link className="flex items-center" href="/">
                    <span className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                        MemberFlow
                    </span>
                </Link>
                <nav className="ml-auto flex gap-6 items-center">
                    <Link className="text-sm font-bold text-white/70 hover:text-white transition-colors" href="/">
                        Home
                    </Link>
                    <Button className="bg-white text-[#060810] hover:bg-white/90 font-bold rounded-xl" asChild>
                        <Link href="/app/dashboard">Enter App</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1 relative z-10 py-24">
                <div className="container max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center space-y-4 mb-20">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                            Simple, transparent pricing.
                        </h1>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto font-medium">
                            Start automating your community for free. Upgrade as you grow.
                        </p>
                    </div>

                    {!hasValidCheckoutConfig && (
                        <div className="max-w-5xl mx-auto mb-8 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3">
                            <p className="text-sm font-semibold text-amber-100 text-center">
                                Checkout is not fully configured. Set valid values for
                                <code className="mx-1">NEXT_PUBLIC_WHOP_GROWTH_PLAN_ID</code>
                                and
                                <code className="mx-1">NEXT_PUBLIC_WHOP_PRO_PLAN_ID</code>
                                in production env vars.
                            </p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Free</h3>
                                <p className="text-sm text-white/50 mb-6">Perfect for new creators just starting out.</p>
                                <div className="mb-8">
                                    <span className="text-4xl font-black">$0</span>
                                    <span className="text-white/50 font-medium">/month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>1 Community</span>
                                    </li>
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>100 Automated Messages / mo</span>
                                    </li>
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>Standard Welcome DM</span>
                                    </li>
                                </ul>
                            </div>
                            <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl" asChild>
                                <Link href="/app/dashboard">Get Started Free</Link>
                            </Button>
                        </div>

                        {/* Growth Tier (Most Popular) */}
                        <div className="rounded-3xl border-2 border-indigo-500 bg-indigo-600/10 p-8 flex flex-col justify-between relative transform md:-translate-y-4 shadow-2xl shadow-indigo-500/20">
                            <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                                <span className="bg-indigo-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                                    Most Popular
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Growth</h3>
                                <p className="text-sm text-indigo-200 mb-6">For aggressive community builders.</p>
                                <div className="mb-8">
                                    <span className="text-4xl font-black">$19</span>
                                    <span className="text-indigo-200 font-medium">/month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>Unlimited Communities</span>
                                    </li>
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>2,500 Automated Messages / mo</span>
                                    </li>
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>Custom Drip Sequences</span>
                                    </li>
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>Priority Support</span>
                                    </li>
                                </ul>
                            </div>
                            <WhopCheckout
                                planId={growthPlanId}
                                buttonText="Upgrade to Growth"
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25"
                            />
                        </div>

                        {/* Pro Tier */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Pro</h3>
                                <p className="text-sm text-white/50 mb-6">For massive communities and agencies.</p>
                                <div className="mb-8">
                                    <span className="text-4xl font-black">$49</span>
                                    <span className="text-white/50 font-medium">/month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>Unlimited Communities</span>
                                    </li>
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>Unlimited Automated Messages</span>
                                    </li>
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>Advanced Custom Webhooks</span>
                                    </li>
                                    <li className="flex items-center text-sm font-medium">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
                                        <span>Dedicated Success Manager</span>
                                    </li>
                                </ul>
                            </div>
                            <WhopCheckout
                                planId={proPlanId}
                                buttonText="Upgrade to Pro"
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
