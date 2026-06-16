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
              Returns &amp; Exchanges
            </h1>
            <p className="text-muted-foreground italic">
              We want you to love your Lalisa Belle jewellery.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-white border rounded-2xl p-8 md:p-12 shadow-sm space-y-12">
            {/* Section 1 — Return Eligibility */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <RotateCcw size={24} />
                <h2 className="font-serif text-2xl">1. Return Eligibility</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li>Items may be returned within <strong>7 days</strong> of delivery.</li>
                <li>Item must be <strong>unused</strong>, in original packaging, with tags attached.</li>
                <li>Include the original invoice/receipt with your return.</li>
                <li>Item must be in the same condition as received.</li>
              </ul>
            </section>

            {/* Section 2 — Non-Returnable Items */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <XCircle size={24} />
                <h2 className="font-serif text-2xl">2. Non-Returnable Items</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li><strong>Earrings</strong> (for hygiene reasons).</li>
                <li>Customized or personalized pieces.</li>
                <li>Items purchased during sale or with discount codes.</li>
                <li>Items without original tags or packaging.</li>
              </ul>
            </section>

            {/* Section 3 — Exchange Process */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <ArrowRightLeft size={24} />
                <h2 className="font-serif text-2xl">3. Exchange Process</h2>
              </div>
              <ol className="list-decimal pl-6 space-y-2 text-foreground/70">
                <li>
                  <strong>Contact us</strong> via{" "}
                  <a
                    href={getWhatsAppUrl("Hi, I need help with an exchange")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b88645] underline underline-offset-2"
                  >
                    WhatsApp
                  </a>{" "}
                  or{" "}
                  <a
                    href={getEmailUrl()}
                    className="text-[#b88645] underline underline-offset-2"
                  >
                    {siteConfig.contact.email}
                  </a>{" "}
                  within 7 days of delivery.
                </li>
                <li>Share your <strong>order number</strong> and photos of the item.</li>
                <li>Ship the item back to our store address.</li>
                <li>
                  Once inspected, we'll ship your replacement within{" "}
                  <strong>3–5 business days</strong>.
                </li>
              </ol>
            </section>

            {/* Section 4 — Refund Timeline */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <Clock size={24} />
                <h2 className="font-serif text-2xl">4. Refund Timeline</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li>
                  Refunds are processed within <strong>7–10 business days</strong> after we
                  receive and inspect the returned item.
                </li>
                <li>Refunds are credited to the original payment method.</li>
                <li>Shipping charges are <strong>non-refundable</strong>.</li>
              </ul>
            </section>

            {/* Section 5 — Return Shipping */}
            <section>
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <Package size={24} />
                <h2 className="font-serif text-2xl">5. Return Shipping</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                <li>
                  Customer bears the return shipping cost unless the item is defective or
                  wrong.
                </li>
                <li>We recommend using a trackable shipping method.</li>
                <li>
                  <strong>Ship to:</strong> {getFullAddress()}
                </li>
              </ul>
            </section>

            {/* Section 6 — Need Help */}
            <section className="bg-stone-50 p-6 rounded-xl border border-stone-200">
              <div className="flex items-center gap-3 mb-4 text-[#b88645]">
                <MessageCircle size={24} />
                <h2 className="font-serif text-xl">Need Help With a Return?</h2>
              </div>
              <ul className="space-y-2 text-foreground/70 text-sm">
                <li>
                  <strong>WhatsApp:</strong>{" "}
                  <a
                    href={getWhatsAppUrl("Hi, I need help with a return")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b88645] underline underline-offset-2"
                  >
                    Chat with us
                  </a>
                </li>
                <li>
                  <strong>Email:</strong>{" "}
                  <a
                    href={getEmailUrl()}
                    className="text-[#b88645] underline underline-offset-2"
                  >
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li>
                  <strong>Call:</strong>{" "}
                  <a
                    href={getPhoneUrl()}
                    className="text-[#b88645] underline underline-offset-2"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  Or visit our{" "}
                  <Link
                    to="/contact"
                    className="text-[#b88645] underline underline-offset-2"
                  >
                    Contact page
                  </Link>{" "}
                  for more options.
                </li>
              </ul>
            </section>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default ReturnPolicy;
