import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import StructuredData from "@/components/StructuredData";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IndianRupee, Sparkles, Feather, ShieldCheck } from "lucide-react";
import { siteConfig, getFullAddress } from "@/config/site";

const features = [
  {
    icon: IndianRupee,
    title: "Premium Quality, Honest Prices",
    description: "Pieces that look luxurious, feel lightweight, and last.",
  },
  {
    icon: Sparkles,
    title: "Curated With Love",
    description: "Every single piece is hand-picked by us.",
  },
  {
    icon: Feather,
    title: "For Every Occasion",
    description: "Monday morning office or Saturday wedding, we have the perfect piece.",
  },
  {
    icon: ShieldCheck,
    title: "Made for Indian Women",
    description: "From oxidised ethnic pieces to contemporary fusion styles.",
  },
] as const;

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: siteConfig.store.name,
  telephone: siteConfig.contact.phone,
  openingHours: siteConfig.store.hours,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${siteConfig.store.address.line1}, ${siteConfig.store.address.line2}`,
    addressRegion: siteConfig.store.address.state,
    postalCode: siteConfig.store.address.zip,
    addressCountry: "IN",
  },
};

const About = () => {
  return (
    <div className="bg-background">
      <Helmet>
        <title>About Lalisa Belle | Imitation Jewellery Gurugram</title>
        <meta
          name="description"
          content="Discover Lalisa Belle. Premium imitation jewellery with stunning finishes. Visit our store at M3M 65th Avenue, Gurugram. Affordable elegance crafted for you."
        />
      </Helmet>

      <StructuredData data={localBusinessSchema} />

      {/* ─── 1. Hero Banner ─── */}
      <section className="pt-32 pb-16 bg-background">
        <div className="container max-w-5xl px-4 mx-auto text-center">
          <AnimatedSection>
            <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-[#b88645] mb-6">
              About Lalisa Belle
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto mb-8">
              Premium Imitation Jewellery — Affordable Elegance, Curated With Love
            </p>
            <div className="w-24 h-1 bg-[#b88645]/30 mx-auto mb-12" />
            
            <div className="w-full rounded-2xl overflow-hidden aspect-[21/9] relative bg-muted border border-border/50">
              <img 
                src="/about-us-hero.webp" 
                alt="Lalisa Belle - Our Story" 
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── 2. Our Story ─── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-4xl px-4 mx-auto">
          <AnimatedSection>
            <h2 className="font-serif text-2xl text-foreground mb-4">Our Story</h2>

            <div className="space-y-6 text-foreground/80 leading-relaxed text-lg font-sans">
              <p>
                Lalisa Belle was born from a simple belief: every woman deserves to feel beautiful — without breaking the bank.
              </p>
              <p>
                What started as a passion for stunning jewellery became a boutique nestled in the heart of M3M 65th Avenue, Gurugram. Every piece on our shelves is hand-picked with love — if it does not meet our standard, it does not make it to the shelf.
              </p>
              <p>
                Now we are bringing that same carefully curated experience to you online.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── 3. Why Choose Lalisa Belle ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-4xl px-4 mx-auto">
          <AnimatedSection delay={0.1}>
            <h2 className="font-serif text-2xl text-foreground mb-4 text-center">
              Why Lalisa Belle?
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-[#b88645] mx-auto mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-base font-medium text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── 4. Visit Our Store ─── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-4xl px-4 mx-auto">
          <AnimatedSection delay={0.1}>
            <div className="bg-[#222] rounded-3xl p-8 md:p-12 text-white">
              <h2 className="font-serif text-2xl text-white mb-6">Visit Us</h2>

              <div className="space-y-4 text-white/80 font-sans leading-relaxed">
                <p className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  Lalisa Belle, M3M 65th Avenue, Sector 65, Gurugram, Haryana
                </p>
                <div className="pt-4">
                  <p>With love,</p>
                  <p>The Lalisa Belle Team 💕</p>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-block mt-8 text-[#b88645] font-medium hover:underline transition-colors"
              >
                Get Directions →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── 5. Shop CTA ─── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-4xl px-4 mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-serif text-2xl text-foreground mb-4">
              Explore Our Collection
            </h2>
            <p className="text-muted-foreground font-sans mb-8 max-w-lg mx-auto">
              From necklaces to earrings, bangles to rings — discover your perfect piece.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#b88645] text-white px-8 py-3 rounded-full font-sans font-medium hover:bg-[#a07535] transition-colors"
            >
              Shop Now
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default About;
