import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Astro Solution",
  description: "Privacy policy and data handling guidelines for Astro Solution.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-black mb-8 text-slate-900">Privacy Policy</h1>
        
        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p className="font-medium text-slate-500">Last Updated: July 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p>Welcome to Astro Solution. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our application and tell you about your privacy rights and how the law protects you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. The Data We Collect About You</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, marital status, title, date of birth, time of birth, place of birth, and gender.</li>
              <li><strong>Contact Data:</strong> includes phone numbers and email addresses.</li>
              <li><strong>Financial Data:</strong> includes wallet balances and transaction history. Payment card details are handled securely by third-party processors.</li>
              <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you, your astrological charts, interests, preferences, feedback and survey responses.</li>
              <li><strong>User Generated Content (UGC):</strong> includes chat transcripts between you and astrologers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Personal Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., generating an astrological chart or providing chat services).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Retention & Deletion</h2>
            <p>We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.</p>
            <p className="mt-2 font-bold text-slate-900">Account Deletion:</p>
            <p>You have the right to request the deletion of your personal data. You can delete your account and all associated data at any time by navigating to your <strong>Profile Settings</strong> and clicking <strong>Delete Account</strong>. This action is irreversible and will immediately purge your Identity, Profile, and UGC data from our active databases.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at support@astrosolution.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
