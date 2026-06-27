import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import { Link } from "react-router-dom";
import {
  siteConfig,
  getWhatsAppUrl,
  getFullAddress,
  getPhoneUrl,
  getEmailUrl,
} from "@/config/site";
import {
  RotateCcw,
  XCircle,
  ArrowRightLeft,
  Clock,
  Package,
  MessageCircle,
} from "lucide-react";

const ReturnPolicy = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>Returns &amp; Exchanges Policy | Lalisa Belle</title>
        <meta
          name="description"
          content="Easy 7-day returns and exchanges on Lalisa Belle jewellery. Learn about our hassle-free return process, eligibility, and refund timelines."
        />
      </Helmet>

      <div className="container max-w-4xl px-4 mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl text-[#b88645] mb-4">
              Returns &amp; Exchange Policy
            </h1>
            <p className="text-muted-foreground italic">
              At Lalisa Belle, your satisfaction is our priority.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-white border rounded-2xl p-8 md:p-12 shadow-sm space-y-12">
            {/* Section 1 — Exchange Policy */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <RotateCcw size={24} />
                <h2 className="font-serif text-2xl">1. Exchange Policy</h2>
              </div>
              <p className="mb-4 text-foreground/80 font-medium">Hassle-free exchanges within 7 days of delivery.</p>
              
              <h3 className="font-medium text-foreground mb-2">You can exchange if:</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70 mb-6">
                <li>You received a damaged or defective product</li>
                <li>You received the wrong item</li>
                <li>The product is significantly different from what was shown</li>
              </ul>

              <h3 className="font-medium text-foreground mb-2">To be eligible:</h3>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li>Item must be unused, unworn, in original packaging with tags intact</li>
                <li>Request raised within 7 days of delivery</li>
              </ul>
            </section>

            {/* Section 2 — How to Request an Exchange */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <ArrowRightLeft size={24} />
                <h2 className="font-serif text-2xl">2. How to Request an Exchange</h2>
              </div>
              <ol className="list-decimal pl-6 space-y-2 text-foreground/70">
                <li>
                  WhatsApp us at{" "}
                  <a href={getWhatsAppUrl("Hi, I need help with an exchange")} target="_blank" rel="noopener noreferrer" className="text-[#b88645] underline underline-offset-2">
                    {siteConfig.contact.phone}
                  </a>{" "}
                  within 7 days of receiving your order
                </li>
                <li>Share your Order ID and photos of the item</li>
                <li>Our team responds within 24 hours</li>
                <li>Once approved, ship the item back to us</li>
                <li>We dispatch your replacement within 3-5 business days</li>
              </ol>
            </section>

            {/* Section 3 — Refunds */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <Clock size={24} />
                <h2 className="font-serif text-2xl">3. Refunds</h2>
              </div>
              <div className="space-y-4 text-foreground/70">
                <p>We offer store credit or exchanges for change-of-mind returns.</p>
                <p>For genuinely defective products, a full refund is processed within 5-7 business days.</p>
              </div>
            </section>

            {/* Section 4 — Non-Returnable Items */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <XCircle size={24} />
                <h2 className="font-serif text-2xl">4. Non-Returnable Items</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li>Items purchased during a sale or at discounted prices</li>
                <li>Items that have been worn, used, or altered</li>
                <li>Items without original packaging</li>
              </ul>
            </section>

            {/* Section 5 — Need Help */}
            <section className="bg-stone-50 p-6 rounded-xl border border-stone-200">
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <MessageCircle size={24} />
                <h2 className="font-serif text-xl">Questions?</h2>
              </div>
              <p className="text-foreground/70 text-sm mt-4 leading-relaxed">
                WhatsApp us at{" "}
                <a
                  href={getWhatsAppUrl("Hi, I have a question")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#b88645] underline underline-offset-2 font-medium"
                >
                  {siteConfig.contact.phone}
                </a>{" "}
                or email{" "}
                <a
                  href={getEmailUrl()}
                  className="text-[#b88645] underline underline-offset-2 font-medium"
                >
                  {siteConfig.contact.email}
                </a>
                . We are here to help.
              </p>
            </section>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ReturnPolicy;
