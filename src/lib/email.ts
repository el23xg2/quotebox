// Email notification service for QuoteBox
// Uses Resend (free tier: 100 emails/day)

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload) {
  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.log("--- EMAIL NOTIFICATION ---");
    console.log(`To: ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`HTML: ${payload.html.substring(0, 200)}...`);
    console.log("--- END EMAIL ---");
    return { success: true };
  }

  // In production, use Resend (free tier: 100 emails/day)
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "QuoteBox <noreply@quotebox.pro>",
          to: [payload.to],
          reply_to: ["noreply@quotebox.pro"],
          subject: payload.subject,
          html: payload.html,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        console.error("Resend API error:", result);
        return { success: false, error: result };
      }
      return result;
    } catch (err) {
      console.error("Failed to send email via Resend:", err);
      return { success: false };
    }
  }

  console.warn("No email provider configured. Set RESEND_API_KEY for production.");
  return { success: false };
}

// Email templates

export function getQuoteSentEmail(clientName: string, quoteNumber: string, quoteUrl: string) {
  return {
    subject: `Quote #${quoteNumber} from your service provider`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">QuoteBox</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0;">You've received a quote</h2>
          <p>Hi ${clientName},</p>
          <p>A new quote (#${quoteNumber}) has been created for you. Click the button below to review and accept it.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${quoteUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Quote
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
            Powered by QuoteBox — quotes, contracts & invoices for freelancers.
          </p>
        </div>
      </div>
    `,
  };
}

export function getQuoteAcceptedEmail(businessOwnerEmail: string, clientName: string, quoteNumber: string, dashboardUrl: string) {
  return {
    subject: `✅ Quote #${quoteNumber} accepted by ${clientName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #16a34a; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">QuoteBox</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0; color: #16a34a;">Quote Accepted! 🎉</h2>
          <p><strong>${clientName}</strong> has accepted Quote #${quoteNumber}.</p>
          <p>You can now create a contract based on this quote. Click the button below to go to your dashboard.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View in Dashboard
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
            Powered by QuoteBox — quotes, contracts & invoices for freelancers.
          </p>
        </div>
      </div>
    `,
  };
}

export function getContractSignedEmail(businessOwnerEmail: string, clientName: string, contractTitle: string, dashboardUrl: string) {
  return {
    subject: `✍️ ${contractTitle} signed by ${clientName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #16a34a; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">QuoteBox</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0; color: #16a34a;">Contract Signed! ✍️</h2>
          <p><strong>${clientName}</strong> has signed <strong>${contractTitle}</strong>.</p>
          <p>You can now create an invoice for this contract. Click the button below to go to your dashboard.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View in Dashboard
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
            Powered by QuoteBox — quotes, contracts & invoices for freelancers.
          </p>
        </div>
      </div>
    `,
  };
}

export function getContractReadyEmail(clientName: string, contractTitle: string, contractUrl: string) {
  return {
    subject: `${contractTitle} — Ready for your signature`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">QuoteBox</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0;">Contract ready for signature</h2>
          <p>Hi ${clientName},</p>
          <p>Your contract <strong>${contractTitle}</strong> is ready to sign. Click the button below to review and sign it online.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${contractUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Sign Contract
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
            Powered by QuoteBox — quotes, contracts & invoices for freelancers.
          </p>
        </div>
      </div>
    `,
  };
}

export function getInvoiceSentEmail(clientName: string, invoiceNumber: string, amount: string, invoiceUrl: string) {
  return {
    subject: `Invoice #${invoiceNumber} — $${amount} due`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">QuoteBox</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0;">Invoice ready for payment</h2>
          <p>Hi ${clientName},</p>
          <p>Invoice #${invoiceNumber} for <strong>$${amount}</strong> is now available. Click the button below to view and pay.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${invoiceUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Pay Invoice
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
            Powered by QuoteBox — quotes, contracts & invoices for freelancers.
          </p>
        </div>
      </div>
    `,
  };
}

export function getInvoicePaidEmail(clientName: string, invoiceNumber: string, amount: string, dashboardUrl: string) {
  return {
    subject: `💰 Invoice #${invoiceNumber} paid — $${amount}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #16a34a; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">QuoteBox</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="margin-top: 0; color: #16a34a;">Payment Received! 💰</h2>
          <p><strong>${clientName}</strong> has paid Invoice #${invoiceNumber} for <strong>$${amount}</strong>.</p>
          <p>The funds will be available for payout according to Creem's payout schedule.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View in Dashboard
            </a>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
            Powered by QuoteBox — quotes, contracts & invoices for freelancers.
          </p>
        </div>
      </div>
    `,
  };
}
