import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — MemberFlow",
  description:
    "Learn how MemberFlow collects, uses, and protects your data when you use our Whop community onboarding automation platform.",
};

const LAST_UPDATED = "March 1, 2025";

export default function PrivacyPage() {
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
            className="text-sm text-white font-semibold transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-white/50 hover:text-white transition-colors"
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
          Privacy{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            Policy
          </span>
        </h1>
        <p className="text-white/40 text-sm">Last updated: {LAST_UPDATED}</p>
      </section>

      {/* ── Content ── */}
      <article className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
        {/* Intro */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">
          <p className="text-white/60 leading-relaxed text-sm">
            MemberFlow (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you use our platform, which integrates with the Whop marketplace to
            automate community onboarding. Please read this policy carefully. If
            you disagree with its terms, please discontinue use of the platform.
          </p>
        </div>

        <Section
          number="1"
          title="Information We Collect"
        >
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            We collect the following categories of data to power MemberFlow&apos;s
            onboarding automations:
          </p>
          <ul className="space-y-3">
            <Item title="Whop OAuth Tokens">
              When you connect your Whop account, we receive and securely store
              OAuth access tokens. These tokens allow MemberFlow to listen to
              membership events and send direct messages on your behalf.
            </Item>
            <Item title="Member IDs & Profile Data">
              When a new member joins your Whop community, we receive their
              Whop member ID and basic profile metadata (e.g. username). We do
              not collect payment details or sensitive personal information
              beyond what Whop provides through its official API.
            </Item>
            <Item title="Message Content">
              We store the message templates you create inside MemberFlow. These
              templates may contain personalization tokens (e.g.{" "}
              <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded text-xs">
                {"{first_name}"}
              </code>
              ). We do not store the content of replies sent by members.
            </Item>
            <Item title="Usage & Analytics Data">
              We collect anonymised platform usage data (page views, feature
              interactions, automation trigger counts) to improve the service.
              This data is never linked to individual end-member identities.
            </Item>
            <Item title="Account Information">
              If you create a MemberFlow account, we collect your email address
              and any profile information you choose to provide.
            </Item>
          </ul>
        </Section>

        <Section number="2" title="How We Use Your Data">
          <ul className="space-y-3">
            <Item title="Powering Onboarding Automations">
              Your data (OAuth tokens, member IDs, message templates) is used
              exclusively to execute the automation sequences you configure — for
              example, sending a welcome DM when a member joins.
            </Item>
            <Item title="Platform Improvement">
              Aggregated, anonymised usage data helps us identify bugs, improve
              performance, and prioritise new features.
            </Item>
            <Item title="Support & Communications">
              We may use your email address to send important service notices,
              security alerts, and (with your consent) product updates. You may
              opt out of marketing emails at any time.
            </Item>
          </ul>
          <p className="text-white/60 text-sm leading-relaxed mt-4">
            We do <strong className="text-white">not</strong> sell, rent, or
            share your personal data or your members&apos; data with third
            parties for advertising or marketing purposes.
          </p>
        </Section>

        <Section number="3" title="Data Storage & Security">
          <ul className="space-y-3">
            <Item title="Encryption at Rest">
              All data stored by MemberFlow — including OAuth tokens and message
              templates — is encrypted at rest using industry-standard AES-256
              encryption.
            </Item>
            <Item title="Encryption in Transit">
              All communications between your browser, our servers, and
              third-party APIs are encrypted using TLS 1.2 or higher.
            </Item>
            <Item title="Access Controls">
              Access to production databases is restricted to authorised
              personnel only. We apply the principle of least privilege and
              conduct regular access reviews.
            </Item>
            <Item title="Data Retention">
              We retain your data for as long as your account is active. If you
              delete your account, we delete your data within 30 days, except
              where retention is required by law.
            </Item>
          </ul>
        </Section>

        <Section number="4" title="Third-Party Services">
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            MemberFlow integrates with or uses the following third-party
            services:
          </p>
          <ul className="space-y-3">
            <Item title="Whop">
              Our core integration partner. Data shared with Whop is governed by{" "}
              <a
                href="https://whop.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                Whop&apos;s Privacy Policy
              </a>
              .
            </Item>
            <Item title="Vercel">
              Our hosting infrastructure provider. No personally identifiable
              data is exposed to Vercel beyond standard server request logs.
            </Item>
          </ul>
        </Section>

        <Section number="5" title="Your Rights & Data Deletion">
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            You have the right to access, correct, or delete the personal data
            we hold about you at any time.
          </p>
          <ul className="space-y-3">
            <Item title="Access & Correction">
              You can review and update your account information at any time
              from your dashboard settings.
            </Item>
            <Item title="Data Deletion">
              To request permanent deletion of your account and all associated
              data, please contact us at{" "}
              <a
                href="mailto:privacy@memberflow.app"
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                privacy@memberflow.app
              </a>
              . We will process your request within 30 days.
            </Item>
            <Item title="Revoking Access">
              You can revoke MemberFlow&apos;s access to your Whop account at
              any time through your Whop account settings. This will immediately
              disable all active automations.
            </Item>
          </ul>
        </Section>

        <Section number="6" title="Children's Privacy">
          <p className="text-white/60 text-sm leading-relaxed">
            MemberFlow is not directed to individuals under the age of 16. We do
            not knowingly collect personal information from children. If you
            believe a child has provided us with personal information, please
            contact us and we will promptly delete it.
          </p>
        </Section>

        <Section number="7" title="Changes to This Policy">
          <p className="text-white/60 text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. When we do, we
            will update the &quot;Last updated&quot; date at the top of the page
            and, for material changes, notify you via email or an in-app notice.
            Your continued use of MemberFlow after any changes constitutes your
            acceptance of the new policy.
          </p>
        </Section>

        <Section number="8" title="Contact Us">
          <p className="text-white/60 text-sm leading-relaxed">
            If you have questions, concerns, or requests regarding this Privacy
            Policy, please contact us at:
          </p>
          <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-6 py-5 text-sm text-indigo-200">
            <div className="font-semibold mb-1">MemberFlow – Privacy Team</div>
            <a
              href="mailto:privacy@memberflow.app"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              privacy@memberflow.app
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
            className="text-indigo-400 text-sm font-semibold"
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
