import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PrivacyPage() {
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
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
          </div>

          <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed space-y-6">
            <p className="font-medium text-gray-900">Last updated: {currentDate}</p>

            <p>
              MemberFlow ("we") collects basic account and membership data to provide onboarding and messaging services. 
              We only store data necessary for operation (member id, join date, message logs). 
              We do not sell personal data. 
            </p>

            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 my-8">
              <h2 className="text-indigo-900 font-bold text-lg mb-2">Data Deletion</h2>
              <p className="text-indigo-800 text-sm">
                Creators can disconnect MemberFlow and request account deletion by emailing 
                <a href="mailto:support@memberflow.app" className="font-bold underline ml-1">support@memberflow.app</a>.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Hosting & Payments</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Hosting:</strong> Supabase (Postgres) stores data securely.</li>
                <li><strong>Payments:</strong> Whop handles all billing and payment data processing.</li>
              </ul>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <a href="mailto:support@memberflow.app" className="text-indigo-600 font-bold hover:underline">support@memberflow.app</a>
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
