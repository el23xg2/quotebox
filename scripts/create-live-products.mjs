const API_KEY = "creem_3OYvAwyARrSqhE7TJFcmTL";
const API_BASE = "https://api.creem.io/v1";

async function createProduct(data) {
  const resp = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await resp.json();
  return { status: resp.status, data: json };
}

async function main() {
  // Create Pro Monthly
  console.log("=== Creating Pro Monthly ===");
  const monthly = await createProduct({
    name: "Pro Monthly",
    description: "Unlimited clients and documents, priority support",
    price: 900,
    currency: "USD",
    billing_type: "recurring",
    billing_period: "every-month",
  });
  console.log(JSON.stringify(monthly, null, 2));

  // Create Pro Yearly
  console.log("\n=== Creating Pro Yearly ===");
  const yearly = await createProduct({
    name: "Pro Yearly",
    description: "Unlimited clients and documents, priority support (annual)",
    price: 9000,
    currency: "USD",
    billing_type: "recurring",
    billing_period: "every-year",
  });
  console.log(JSON.stringify(yearly, null, 2));
}

main().catch((e) => console.error("Fatal:", e.message));
