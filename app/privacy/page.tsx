import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
      <div className="prose prose-indigo">
        <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you use MemberFlow, including your Whop account details and community data required for automation.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. How We Use Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, including the automated messaging features of MemberFlow.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
        </section>
      </div>
    </div>
  );
}
