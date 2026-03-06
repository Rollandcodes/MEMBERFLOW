import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Terms of Service — MemberFlow",
  description:
    "MemberFlow Terms of Service — the rules governing your use of our Whop community onboarding automation platform.",
};

const LAST_UPDATED = "March 1, 2025";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#060810] text-white">
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06] sticky top-0 bg-[#060810]/90 backdrop-blur-md z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40 group-hover:scale-105 transition-transform">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span
            className="text-lg font-black tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            MemberFlow
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Home
          </Link>
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
          <Link
            href="/terms"
            className="text-sm text-white font-semibold transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/app/dashboard"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Dashboard →
          </Link>
        </div>
      </nav>

      {/* ── Header ── */}
      <section className="text-center px-6 pt-20 pb-12 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
          Legal
        </div>
        <h1
          className="text-5xl font-black leading-tight text-white mb-5"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Terms of{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            Service
          </span>
        </h1>
        <p className="text-white/40 text-sm">Last updated: {LAST_UPDATED}</p>
      </section>

      {/* ── Content ── */}
      <article className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
        {/* Intro */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">
          <p className="text-white/60 leading-relaxed text-sm">
            Welcome to MemberFlow. These Terms of Service (&quot;Terms&quot;)
            govern your access to and use of the MemberFlow platform, website,
            and related services (&quot;Service&quot;) operated by MemberFlow
            (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing
            or using MemberFlow, you agree to be bound by these Terms. If you do
            not agree, please do not use the Service.
          </p>
        </div>

        <Section number="1" title="Acceptance of Terms">
          <p className="text-white/60 text-sm leading-relaxed">
            By creating an account, clicking &quot;Get Started&quot;, or
            otherwise accessing or using MemberFlow, you confirm that you are at
            least 16 years of age, have read and understood these Terms, and
            agree to be legally bound by them. If you are using MemberFlow on
            behalf of an organisation, you represent that you have authority to
            bind that organisation to these Terms.
          </p>
        </Section>

        <Section number="2" title="Description of Service">
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            MemberFlow is an automation platform that integrates with the Whop
            marketplace to help community creators:
          </p>
          <ul className="space-y-3">
            <Item title="Onboarding Automations">
              Automatically send welcome direct messages and multi-step drip
              sequences to new community members via Whop&apos;s messaging
              infrastructure.
            </Item>
            <Item title="Role Tagging">
              Automatically tag and segment members based on the product or plan
              they purchased.
            </Item>
            <Item title="Analytics">
              View dashboards tracking member engagement, automation performance,
              and churn signals.
            </Item>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4">
            We reserve the right to modify, suspend, or discontinue any part of
            the Service at any time with reasonable notice.
          </p>
        </Section>

        <Section number="3" title="User Responsibilities">
          <ul className="space-y-3">
            <Item title="Accurate Information">
              You agree to provide accurate, current, and complete information
              when creating your account and to keep your account information
              up-to-date.
            </Item>
            <Item title="Responsibility for Message Content">
              Community creators are solely responsible for the content of all
              messages configured and sent through MemberFlow. You must ensure
              your messages comply with all applicable laws and Whop&apos;s
              platform policies. MemberFlow is a conduit only and is not
              responsible for message content authored by users.
            </Item>
            <Item title="Account Security">
              You are responsible for maintaining the security of your account
              credentials. Notify us immediately at{" "}
              <a
                href="mailto:support@memberflow.app"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                support@memberflow.app
              </a>{" "}
              if you suspect unauthorised access to your account.
            </Item>
            <Item title="Compliance">
              You agree to use the Service in compliance with all applicable
              local, state, national, and international laws, regulations, and
              Whop&apos;s Terms of Service.
            </Item>
          </ul>
        </Section>

        <Section number="4" title="No Spam Policy">
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            MemberFlow has a strict no-spam policy. You may{" "}
            <strong className="text-white">not</strong> use the Service to:
          </p>
          <ul className="space-y-3">
            <Item title="Send Unsolicited Messages">
              Messages sent via MemberFlow must only be delivered to members who
              have genuinely joined your Whop community through a legitimate
              purchase or signup. Mass unsolicited messaging is strictly
              prohibited.
            </Item>
            <Item title="Mislead Recipients">
              Your messages must not contain false or misleading information,
              impersonate any person or entity, or deceive recipients about the
              source or nature of the communication.
            </Item>
            <Item title="Circumvent Platform Limits">
              You may not use MemberFlow to circumvent rate limits, messaging
              restrictions, or other policies set by the Whop platform.
            </Item>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4">
            Violations of this no-spam policy may result in immediate account
            suspension without refund.
          </p>
        </Section>

        <Section number="5" title="Termination">
          <ul className="space-y-3">
            <Item title="Termination by You">
              You may terminate your account at any time by contacting us at{" "}
              <a
                href="mailto:support@memberflow.app"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                support@memberflow.app
              </a>
              . Upon termination, your access to the Service will cease and your
              data will be deleted per our Privacy Policy.
            </Item>
            <Item title="Termination by Us">
              We may suspend or terminate your account immediately, without
              prior notice or liability, if you breach these Terms, engage in
              fraudulent activity, or otherwise misuse the Service. We may also
              terminate accounts after a prolonged period of inactivity.
            </Item>
            <Item title="Effect of Termination">
              All active automations will be disabled immediately upon account
              termination. Provisions of these Terms that by their nature should
              survive termination will survive, including ownership provisions,
              warranty disclaimers, and limitations of liability.
            </Item>
          </ul>
        </Section>

        <Section number="6" title="Limitation of Liability">
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            To the fullest extent permitted by applicable law:
          </p>
          <ul className="space-y-3">
            <Item title="No Indirect Damages">
              MemberFlow shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages — including loss of
              profits, data, or goodwill — arising from your use of or inability
              to use the Service.
            </Item>
            <Item title="Liability Cap">
              Our total aggregate liability to you for any claims arising from
              or related to these Terms or the Service shall not exceed the
              greater of (a) USD $100 or (b) the total fees paid by you to
              MemberFlow in the 12 months preceding the claim.
            </Item>
            <Item title="No Warranty">
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, whether express or
              implied, including but not limited to warranties of
              merchantability, fitness for a particular purpose, or
              non-infringement.
            </Item>
          </ul>
        </Section>

        <Section number="7" title="Governing Law">
          <p className="text-white/60 text-sm leading-relaxed">
            These Terms shall be governed by and construed in accordance with
            the laws of the State of{" "}
            <strong className="text-white/80">Delaware, USA</strong>, without
            regard to its conflict of law provisions. Any dispute arising under
            these Terms shall be subject to the exclusive jurisdiction of the
            courts located in Delaware. If any provision of these Terms is found
            to be unenforceable, the remaining provisions will remain in full
            force and effect.
          </p>
        </Section>

        <Section number="8" title="Changes to These Terms">
          <p className="text-white/60 text-sm leading-relaxed">
            We reserve the right to modify these Terms at any time. When we
            make material changes, we will update the &quot;Last updated&quot;
            date and notify you by email or via an in-app notice at least 14
            days before the changes take effect. Your continued use of the
            Service after the effective date of the updated Terms constitutes
            your acceptance of the changes.
          </p>
        </Section>

        <Section number="9" title="Contact Information">
          <p className="text-white/60 text-sm leading-relaxed">
            If you have any questions about these Terms, please reach out to us:
          </p>
          <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-6 py-5 text-sm text-indigo-200">
            <div className="font-semibold mb-1">MemberFlow – Legal Team</div>
            <a
              href="mailto:legal@memberflow.app"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              legal@memberflow.app
            </a>
          </div>
        </Section>
      </article>

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
            className="text-indigo-400 text-sm font-semibold"
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

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
      `}</style>
    </main>
  );
}

/* ── Helpers ── */

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-7 w-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <h2
          className="text-xl font-black text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h2>
      </div>
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
        {children}
      </div>
    </section>
  );
}

function Item({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3 text-sm text-white/60 leading-relaxed">
      <span className="mt-0.5 h-4 w-4 rounded-full bg-indigo-500/20 flex-shrink-0 flex items-center justify-center">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
      </span>
      <span>
        <strong className="text-white/80 font-semibold">{title}: </strong>
        {children}
      </span>
    </li>
  );
}
