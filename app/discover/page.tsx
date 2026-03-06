import Link from "next/link";
import { Zap, MessageSquare, GitBranch, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "MemberFlow — Automate Your Community Onboarding | Whop",
  description:
    "MemberFlow automates your Whop community onboarding with welcome DMs, drip sequences, role tagging, and analytics. Add it to your Whop hub in seconds.",
};

const features = [
  {
    icon: MessageSquare,
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-500/10",
    title: "Instant Welcome DMs",
    description:
      "Every new member automatically gets a personalised welcome message the moment they join — no manual effort required.",
  },
  {
    icon: GitBranch,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
    title: "Drip Sequences",
    description:
      "Schedule day-1, day-3, and day-7 messages to guide members through your content. Set once, run forever.",
  },
  {
    icon: BarChart3,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    title: "Retention Analytics",
    description:
      "Track engagement, identify members at risk of churning, and act before you lose them — all from one dashboard.",
  },
];

const socialProof = [
  "Up to 3× member retention",
  "2-minute setup",
  "Zero code required",
  "Whop-native integration",
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-[#060810] text-white">
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06] sticky top-0 bg-[#060810]/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span
            className="text-lg font-black tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            MemberFlow
          </span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/pricing"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Privacy
          </Link>
          <a
            href="https://whop.com/apps/memberflow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
          >
            Add to Whop
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative text-center px-6 pt-24 pb-20 max-w-4xl mx-auto overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 h-64 w-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/3 h-40 w-40 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-7 tracking-widest uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Now on the Whop App Store
          </div>

          <h1
            className="text-5xl md:text-6xl font-black leading-[1.05] text-white mb-6"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Automate Your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Community Onboarding
            </span>
          </h1>

          <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto mb-10">
            MemberFlow plugs into your Whop hub and instantly starts welcoming members,
            delivering drip sequences, and surfacing retention insights — all on autopilot.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="https://whop.com/apps/memberflow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-indigo-900/40 hover:shadow-indigo-900/60 hover:-translate-y-0.5 transition-all"
            >
              <Zap className="h-4 w-4" />
              Add MemberFlow to Whop
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/pricing"
              className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4"
            >
              View pricing →
            </Link>
          </div>

          {/* Social proof pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialProof.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-xs text-white/50 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full"
              >
                <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            What you get
          </div>
          <h2
            className="text-3xl font-black text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Everything your community needs to thrive
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] transition-all duration-200"
              >
                {/* Icon */}
                <div
                  className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}
                >
                  <div
                    className={`bg-gradient-to-br ${feature.color} rounded-lg h-8 w-8 flex items-center justify-center`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>

                <h3
                  className="text-lg font-black text-white mb-3"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute -top-10 -right-10 h-48 w-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <h2
              className="text-3xl font-black text-white mb-4"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Ready to grow your community?
            </h2>
            <p className="text-white/70 mb-8 text-base max-w-md mx-auto">
              Join hundreds of Whop creators using MemberFlow to automate onboarding and
              keep members active.
            </p>
            <a
              href="https://whop.com/apps/memberflow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl text-base shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Zap className="h-4 w-4" />
              Add to Whop — It&apos;s Free
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-8 py-8 flex flex-wrap items-center justify-between gap-4 max-w-5xl mx-auto">
        <div
          className="font-black text-base flex items-center gap-2"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span>⚡</span> MemberFlow
        </div>
        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="text-white/35 text-sm hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-white/35 text-sm hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <a
            href="mailto:support@memberflow.app"
            className="text-white/35 text-sm hover:text-white transition-colors"
          >
            Support
          </a>
        </div>
        <div className="text-xs text-white/20">
          © 2025 MemberFlow. All rights reserved.
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
      `}</style>
    </main>
  );
}
