import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import { Truck, ShieldCheck, Box, CreditCard } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>Shipping Policy — Lalisa Belle</title>
        <meta name="description" content="Read our shipping policy, processing times, and security measures for domestic and international orders." />
      </Helmet>

      <div className="container max-w-4xl px-4 mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl text-[#b88645] mb-4">Shipping Policy</h1>
            <p className="text-muted-foreground italic">
              We ensure your jewelry reaches you safely and discreetly.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-white border rounded-2xl p-8 md:p-12 shadow-sm space-y-12">
            <p className="text-foreground/80 leading-relaxed font-sans">
              We partner with <strong>Shiprocket</strong> to provide reliable delivery across India and globally via premium courier partners like <strong>Blue Dart, Delhivery, and FedEx.</strong>
            </p>

            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <Truck size={24} />
                <h2 className="font-serif text-2xl">1. Processing & Delivery Timelines</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li><strong>Order Processing:</strong> All orders are processed within 1–3 business days. Orders are not shipped on Sundays or public holidays.</li>
                <li><strong>Standard Shipping:</strong> Typically delivered within 5–7 business days after dispatch.</li>
                <li><strong>Express Shipping:</strong> Delivered within 2–4 business days for metro cities.</li>
                <li><strong>International Shipping:</strong> Delivered within 7–15 business days depending on the destination and customs clearance.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <CreditCard size={24} />
                <h2 className="font-serif text-2xl">2. Shipping Charges</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li><strong>Domestic (India):</strong> We offer Free Shipping on all orders above ₹999. For orders below this, a flat fee of ₹99 applies.</li>
                <li><strong>International:</strong> Shipping costs are calculated at checkout based on the package weight and destination country.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <Box size={24} />
                <h2 className="font-serif text-2xl">3. Secure Packaging & Discretion</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li><strong>Discreet Outer Boxes:</strong> To prevent theft, our outer packaging is unbranded and does not mention "Jewelry," "Gold," or "Diamonds".</li>
                <li><strong>Tamper-Evident Seals:</strong> We use tamper-proof bags and security tapes. Please do not accept the package if the seal is broken or the box is visibly damaged.</li>
                <li><strong>Cushioning:</strong> Each piece is placed in a premium jewelry box, then secured with bubble wrap or foam within a sturdy corrugated box.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <ShieldCheck size={24} />
                <h2 className="font-serif text-2xl">4. Order Tracking & Security</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li><strong>Real-Time Tracking:</strong> Once dispatched, you will receive a tracking link via email/SMS.</li>
                <li><strong>Insurance Coverage:</strong> All high-value shipments are protected under Shiprocket Secure. This covers your order against loss or damage during transit for values up to ₹25 Lakhs.</li>
                <li><strong>Signature on Delivery:</strong> For your safety, most jewelry shipments require a signature upon delivery.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="bg-stone-50 p-6 rounded-xl border border-stone-200">
              <h2 className="font-serif text-xl mb-3">5. Important Notes</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70 text-sm">
                <li><strong>Address Verification:</strong> Please ensure your shipping address and contact number are accurate.</li>
                <li><strong>Customs & Duties:</strong> For international orders, any import duties or taxes are the responsibility of the customer.</li>
              </ul>
            </section>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ShippingPolicy;
