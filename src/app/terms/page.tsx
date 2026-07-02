import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service & EULA | Astro Solution",
  description: "Terms of Service and End User License Agreement for Astro Solution.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-black mb-8 text-slate-900">Terms of Service & EULA</h1>
        
        <div className="space-y-6 text-slate-700 leading-relaxed">
          <p className="font-medium text-slate-500">Last Updated: July 2026</p>
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using the Astro Solution application, you agree to be bound by these Terms of Service and End User License Agreement (EULA). If you disagree with any part of the terms, you may not access the service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Age Restriction</h2>
            <p>You must be at least 18 years of age to use Astro Solution. By creating an account and using our services (including Live Chat and Consultations), you represent and warrant that you are 18 years of age or older. We reserve the right to terminate accounts of users found to be under 18.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Generated Content (UGC) Policy</h2>
            <p>Our platform includes live chat functionality allowing you to communicate with astrologers. You are solely responsible for the content you transmit.</p>
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl mt-4">
              <h3 className="font-bold text-red-800 mb-2">Zero Tolerance Policy for Objectionable Content</h3>
              <p className="text-sm text-red-700">We maintain a strict zero-tolerance policy against objectionable content and abusive behavior. You agree NOT to use the platform to transmit any content that is:</p>
              <ul className="list-disc pl-6 mt-2 text-sm text-red-700 space-y-1">
                <li>Defamatory, obscene, offensive, or hateful.</li>
                <li>Promotes discrimination based on race, sex, religion, nationality, disability, sexual orientation or age.</li>
                <li>Harasses, upsets, embarrasses, alarms or annoys any other person.</li>
                <li>Promotes illegal activity.</li>
              </ul>
              <p className="text-sm text-red-700 mt-2 font-bold">Violation of this policy will result in immediate and permanent account termination.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Reporting and Moderation</h2>
            <p>We provide tools within the application to block users and report objectionable content. Our moderation team reviews reports within 24 hours and takes appropriate action, including the removal of content and ejection of users who violate these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Nature of Services</h2>
            <p>The astrological services, readings, and advice provided on Astro Solution are for entertainment and spiritual guidance purposes only. They do not constitute and should not be construed as medical, legal, financial, or professional advice. We do not guarantee the accuracy or outcomes of any astrological readings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Purchases and Payments</h2>
            <p>Digital services (like chat sessions) are purchased using the in-app Wallet system. Physical goods (like gemstones) are processed securely via our payment partners. All digital wallet top-ups are subject to platform billing policies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@astrosolution.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
