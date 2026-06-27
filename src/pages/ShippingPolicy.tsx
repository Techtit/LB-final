import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import { ShieldCheck, Box, Clock, MessageCircle } from "lucide-react";
import { siteConfig, getWhatsAppUrl, getEmailUrl } from "@/config/site";

const ShippingPolicy = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>Shipping Policy | Lalisa Belle</title>
        <meta name="description" content="Fast, secure shipping across India. Free delivery above ₹999. Discreet packaging with insurance up to ₹25 Lakhs. Read our full shipping policy." />
      </Helmet>

      <div className="container max-w-4xl px-4 mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl text-[#b88645] mb-4">Shipping Policy</h1>
            <p className="text-muted-foreground italic">
              We ensure your jewellery reaches you safely and discreetly.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-white border rounded-2xl p-8 md:p-12 shadow-sm space-y-12">
            <p className="text-foreground/80 leading-relaxed font-sans mb-8">
              We deliver across India — bringing Lalisa Belle jewellery straight to your door.
            </p>

            <div className="overflow-x-auto mb-12">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-[#b88645]">
                    <th className="py-3 px-4 font-serif text-lg font-medium text-[#b88645]">Item</th>
                    <th className="py-3 px-4 font-serif text-lg font-medium text-[#b88645]">Details</th>
                  </tr>
                </thead>
                <tbody className="text-foreground/80 text-sm font-sans">
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 font-medium text-foreground">Standard Delivery</td>
                    <td className="py-4 px-4">5-7 business days | Free on orders above Rs.499</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 font-medium text-foreground">Express Delivery</td>
                    <td className="py-4 px-4">2-3 business days | Rs.99 extra</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 font-medium text-foreground">Same-Day (Gurugram)</td>
                    <td className="py-4 px-4">Orders placed before 12 PM | Rs.49</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 font-medium text-foreground">Free Shipping</td>
                    <td className="py-4 px-4">All orders above Rs.499 across India</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 font-medium text-foreground">COD (Cash on Delivery)</td>
                    <td className="py-4 px-4">Available up to Rs.2,000 | Rs.50 COD charge</td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/30">
                    <td className="py-4 px-4 font-medium text-foreground">Prepaid Orders</td>
                    <td className="py-4 px-4">Processed and dispatched within 24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 1 — Order Processing */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <Clock size={24} />
                <h2 className="font-serif text-2xl">1. Order Processing</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li>Orders processed Monday to Saturday (excluding public holidays)</li>
                <li>Orders placed before 2 PM dispatched the same day</li>
                <li>Orders after 2 PM or on Sundays dispatched next business day</li>
                <li>You will receive a WhatsApp/SMS with your tracking link once dispatched</li>
              </ul>
            </section>

            {/* Section 2 — Packaging */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <Box size={24} />
                <h2 className="font-serif text-2xl">2. Packaging</h2>
              </div>
              <p className="text-foreground/70">
                Every Lalisa Belle order is packed in our branded jewellery pouch — gift-ready and beautiful. 💕
              </p>
            </section>

            {/* Section 3 — Damaged in Transit? */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <ShieldCheck size={24} />
                <h2 className="font-serif text-2xl">3. Damaged in Transit?</h2>
              </div>
              <p className="text-foreground/70 mb-4">
                WhatsApp us at{" "}
                <a href={getWhatsAppUrl("Hi, my order was damaged in transit")} target="_blank" rel="noopener noreferrer" className="text-[#b88645] underline underline-offset-2">
                  {siteConfig.contact.phone}
                </a>{" "}
                within 24 hours of delivery with photos.
                <br />
                We will replace it immediately at no extra cost.
              </p>
            </section>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ShippingPolicy;
