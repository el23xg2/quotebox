import Link from "next/link";

export const metadata = {
  title: "Terms of Service - QuoteBox",
  description: "QuoteBox terms of service — the rules and guidelines for using our platform.",
};

export default function TermsPage() {
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
        <h1>Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: July 16, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using QuoteBox ("the Service"), you agree to be bound
          by these Terms of Service. If you do not agree, do not use the
          Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          QuoteBox is a platform that helps freelancers create and send
          professional quotes, contracts, and invoices to their clients.
          Features include document creation, e-signatures, client management,
          and payment processing.
        </p>

        <h2>3. Account Registration</h2>
        <p>
          You must provide a valid email address to create an account. You are
          responsible for maintaining the security of your account and for all
          activities that occur under your account.
        </p>

        <h2>4. Free and Paid Plans</h2>
        <p>
          QuoteBox offers a free plan with limited usage (3 clients, 5
          documents). Paid plans (Pro Monthly at $9/month, Pro Yearly at
          $90/year) provide unlimited access. Lifetime access is available for
          a one-time payment of $199.
        </p>
        <p>
          All paid subscriptions are processed through Creem, our Merchant of
          Record. By subscribing, you agree to Creem's terms and conditions.
        </p>

        <h2>5. Payment Terms</h2>
        <p>
          Subscription fees are billed in advance. You may cancel your
          subscription at any time — you will retain Pro access until the end
          of your current billing period. Refunds are handled at our discretion
          on a case-by-case basis.
        </p>

        <h2>6. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any illegal purpose</li>
          <li>Send spam or unsolicited communications</li>
          <li>
            Upload or transmit viruses, malware, or harmful code
          </li>
          <li>
            Attempt to gain unauthorized access to other users' accounts or
            data
          </li>
          <li>
            Use the Service to harass, abuse, or harm others
          </li>
          <li>Resell or redistribute the Service without authorization</li>
        </ul>

        <h2>7. Intellectual Property</h2>
        <p>
          You retain ownership of all content you create and upload to
          QuoteBox. By using the Service, you grant us a limited license to
          host and display your content solely for the purpose of providing the
          Service to you.
        </p>

        <h2>8. Third-Party Services</h2>
        <p>
          QuoteBox integrates with third-party services including Supabase
          (database and authentication), Creem (payment processing), and
          Resend (email delivery). We are not responsible for the availability
          or practices of these third-party services.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          QuoteBox is provided "as is" without warranties of any kind. We are
          not liable for any indirect, incidental, or consequential damages
          arising from your use of the Service. Our total liability shall not
          exceed the amount you paid us in the 12 months preceding the claim.
        </p>

        <h2>10. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account if you
          violate these terms. You may delete your account at any time through
          the Service settings.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We may modify these terms at any time. We will notify you of
          material changes via email. Your continued use of the Service after
          changes take effect constitutes acceptance.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These terms are governed by the laws of the People's Republic of
          China, without regard to conflict of law principles.
        </p>

        <h2>13. Contact</h2>
        <p>
          For questions about these terms, contact us at{" "}
          <strong>support@quotebox.pro</strong>.
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
