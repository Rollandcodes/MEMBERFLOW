import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/app/discover" className="text-2xl font-bold text-indigo-600">MemberFlow</Link>
          <Link href="/app/discover" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Back to Home</Link>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Terms of Service</h1>
          </div>

          <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-6">
            <p className="font-medium text-gray-900">Last updated: {currentDate}</p>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              <p>
                By using MemberFlow, you agree that MemberFlow provides automation services and is not responsible for message content. 
                You are responsible for the content you create and send using our platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">2. Compliance & Regulations</h2>
              <p>
                Creators must comply with platform rules and local regulations (e.g., spam laws, CAN-SPAM Act). 
                MemberFlow reserves the right to terminate accounts found to be in violation of these rules.
              </p>
            </section>

            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 my-8">
              <h2 className="text-amber-900 font-bold text-lg mb-2">Billing & Refunds</h2>
              <p className="text-amber-800 text-sm leading-relaxed">
                Refunds and billing are handled through <strong>Whop subscriptions</strong>. 
                Please refer to the Whop platform for all payment-related inquiries and refund requests.
              </p>
            </div>

            <section className="pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Support</h2>
              <p className="text-center">If you need assistance, please contact our support team at:</p>
              <div className="flex justify-center mt-4">
                <a href="mailto:support@memberflow.app" className="text-indigo-600 font-extrabold text-lg hover:underline underline-offset-4 decoration-2">
                  support@memberflow.app
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} MemberFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
