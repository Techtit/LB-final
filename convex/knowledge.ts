/**
 * LB Concierge — Store Knowledge Base
 *
 * Plain TypeScript data module (not a Convex function).
 * Contains Lalisa Belle store policies extracted from the existing policy pages.
 * Imported by convex/concierge.ts for FAQ retrieval.
 */

export interface PolicyEntry {
  topic: string;
  keywords: string[];
  content: string;
}

export const STORE_POLICIES: PolicyEntry[] = [
  {
    topic: "shipping",
    keywords: ["shipping", "delivery", "dispatch", "courier", "tracking", "how long", "when will", "arrive"],
    content: `
**Shipping Policy — Lalisa Belle**
- Free shipping on all orders above ₹999. Flat ₹99 fee below ₹999.
- Orders are dispatched within 1–3 business days after confirmation.
- Delivery takes 5–7 business days for metro cities and 7–10 business days for other areas.
- Courier partners: Blue Dart, Delhivery, FedEx.
- All orders are shipped with insurance.
- You will receive a tracking link via email/SMS once dispatched.
    `.trim(),
  },
  {
    topic: "returns",
    keywords: ["return", "refund", "exchange", "replace", "wrong", "damaged", "defective", "policy", "7 days"],
    content: `
**Returns & Exchanges Policy — Lalisa Belle**
- Returns and exchanges accepted within 7 days of delivery.
- Items must be unused, unworn, and in original packaging.
- To initiate a return: WhatsApp us at 9211770999 or email support@lalisabelle.com with your order number and reason.
- Refunds are processed within 5–7 business days after we receive the returned item.
- Exchange requests are fulfilled from available stock.
- Damaged or wrong items: contact us immediately with a photo — we resolve priority cases within 24 hours.
    `.trim(),
  },
  {
    topic: "payment",
    keywords: ["payment", "pay", "upi", "card", "cod", "cash", "razorpay", "online", "modes"],
    content: `
**Payment Options — Lalisa Belle**
- All major UPI apps (GPay, PhonePe, Paytm, etc.)
- Credit and Debit cards (Visa, Mastercard, RuPay)
- Net Banking
- Secure checkout powered by Shopify.
- No Cash on Delivery currently.
    `.trim(),
  },
  {
    topic: "jewellery_care",
    keywords: ["care", "maintain", "clean", "tarnish", "oxidized", "gold", "silver", "store", "keep", "look after"],
    content: `
**Jewellery Care Guide — Lalisa Belle**
- Store jewellery in the pouch/box provided to prevent scratches and tarnishing.
- Avoid contact with water, perfumes, lotions, and chemicals.
- Oxidized jewellery: wipe gently with a soft dry cloth. Do not use polish.
- Gold-plated jewellery: wipe with a soft cloth after each use. Keep away from sweat.
- Anti-tarnish collection: suitable for daily wear but still keep away from water.
- Do not wear jewellery while swimming, bathing, or exercising.
    `.trim(),
  },
  {
    topic: "store",
    keywords: ["store", "shop", "location", "address", "visit", "timing", "hours", "open", "gurugram", "gurgaon", "m3m"],
    content: `
**Lalisa Belle — Physical Store**
- Location: Ground Floor, M3M 65th Avenue, R7 LG 37, Sector 65, Gurugram, Haryana 122018
- Landmark: Opposite SuperDogs and Arte Saloon
- Hours: Monday – Sunday, 11:00 AM – 9:30 PM
- Google Maps: https://maps.google.com/?q=M3M+65th+Avenue+Sector+65+Gurugram
    `.trim(),
  },
  {
    topic: "contact",
    keywords: ["contact", "whatsapp", "email", "call", "phone", "reach", "support", "help", "team"],
    content: `
**Contact Lalisa Belle**
- WhatsApp: 9211770999 (Preferred for fastest response)
- Email: support@lalisabelle.com
- Instagram: @lalisabelle
- Support hours: 11 AM – 9 PM, Monday to Sunday
    `.trim(),
  },
  {
    topic: "products",
    keywords: ["material", "quality", "gold", "silver", "oxidized", "anti-tarnish", "real", "imitation", "artificial", "plated"],
    content: `
**About Lalisa Belle Products**
- Premium imitation jewellery — not real gold or silver.
- Materials: High-quality zinc alloy, copper, brass with gold/silver/oxidized plating.
- Anti-tarnish collection: specially coated to resist tarnishing for daily wear.
- Oxidized collection: traditional dark-finish jewellery, very popular for ethnic wear.
- All products are hypoallergenic and lightweight.
- Prices range from ₹99 to ₹2999.
    `.trim(),
  },
];

/**
 * Find relevant policy entries by matching user question keywords.
 * Returns the top matching entries sorted by relevance.
 */
export function searchKnowledge(question: string): PolicyEntry[] {
  const q = question.toLowerCase();
  const scored = STORE_POLICIES.map((entry) => {
    const matchCount = entry.keywords.filter((kw) => q.includes(kw)).length;
    // Also check if the topic itself is mentioned
    const topicMatch = q.includes(entry.topic) ? 2 : 0;
    return { entry, score: matchCount + topicMatch };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((s) => s.entry);
}
