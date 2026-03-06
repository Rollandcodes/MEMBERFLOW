import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
      <div className="prose prose-indigo text-gray-700 leading-relaxed">
        <p className="text-gray-500 mb-8 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
          <p>By accessing or using MemberFlow, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Use License</h2>
          <p>We grant you a limited, non-exclusive, non-transferable license to use MemberFlow for your community automation needs on Whop.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Disclaimer</h2>
          <p>The services provided by MemberFlow are provided "as is". We make no warranties, expressed or implied, regarding the accuracy or reliability of our services.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Limitation of Liability</h2>
          <p>In no event shall MemberFlow be liable for any damages arising out of the use or inability to use our services.</p>
        </section>
      </div>
    </div>
  );
}
