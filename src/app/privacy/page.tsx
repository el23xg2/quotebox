import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - QuoteBox",
  description: "QuoteBox privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            QuoteBox
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Back to Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 prose prose-gray">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: July 16, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>
          When you sign up for QuoteBox, we collect your email address for
          authentication purposes. When you create documents (quotes,
          contracts, invoices), we store the information you enter, including
          client names, email addresses, company names, and document content.
        </p>
        <p>
          If you subscribe to a paid plan, our payment processor (Creem)
          collects your payment information. We do not store your full credit
          card number or payment details on our servers.
        </p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our service</li>
          <li>To authenticate your account and keep it secure</li>
          <li>To send documents (quotes, contracts, invoices) to your clients on your behalf</li>
          <li>To process payments for paid subscriptions</li>
          <li>To send you important account updates and notifications</li>
          <li>To improve our service based on usage patterns</li>
        </ul>

        <h2>3. Data Storage & Security</h2>
        <p>
          Your data is stored on Supabase, which provides enterprise-grade
          security including encryption at rest and in transit. We use
          industry-standard security practices to protect your information.
          Access to your account is protected by email-based magic link
          authentication.
        </p>

        <h2>4. Data Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third
          parties. We share information only as necessary:
        </p>
        <ul>
          <li>
            <strong>Payment Processing:</strong> Payment data is processed by
            Creem, our payment provider and Merchant of Record.
          </li>
          <li>
            <strong>Email Delivery:</strong> Emails are sent through Resend.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose information if
            required by law or to protect our rights.
          </li>
        </ul>

        <h2>5. Client Data</h2>
        <p>
          When you add client information and send documents through QuoteBox,
          you are the data controller for that information. We process it
          solely to provide our service to you. You are responsible for
          ensuring you have the appropriate consent from your clients.
        </p>

        <h2>6. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management.
          We do not use tracking cookies or third-party analytics cookies at
          this time.
        </p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and associated data</li>
          <li>Export your data</li>
          <li>Withdraw consent where applicable</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <strong>gaoxueyi200117@gmail.com</strong>.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify
          you of significant changes via email or through the service.
        </p>

        <h2>9. Contact</h2>
        <p>
          If you have any questions about this privacy policy, please contact
          us at{" "}
          <strong>gaoxueyi200117@gmail.com</strong>.
        </p>
      </main>
      <footer className="border-t border-gray-200 mt-16">
        <div className="mx-auto max-w-3xl px-4 py-8 flex justify-between text-sm text-gray-500">
          <span>&copy; 2026 QuoteBox. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
