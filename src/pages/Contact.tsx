import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import StructuredData from "@/components/StructuredData";
import { Link } from "react-router-dom";
import {
  siteConfig,
  getWhatsAppUrl,
  getPhoneUrl,
  getEmailUrl,
  getFullAddress,
} from "@/config/site";
import { MapPin, Phone, Mail, Instagram, ExternalLink } from "lucide-react";

const Contact = () => {
  const { address } = siteConfig.store;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: siteConfig.name,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.line1}, ${address.line2}`,
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: address.zip,
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 11:00-21:30",
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.store.coordinates.lat,
      longitude: siteConfig.store.coordinates.lng,
    },
    url: siteConfig.url,
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>Contact Lalisa Belle | Jewellery Store in Gurugram</title>
        <meta
          name="description"
          content="Visit our jewellery shop at M3M 65th Avenue, Gurugram or chat on WhatsApp. Open 7 days a week. Experience premium imitation jewellery in person."
        />
      </Helmet>

      <StructuredData data={localBusinessSchema} />

      <div className="container max-w-5xl">
        {/* ─── Header ─── */}
        <AnimatedSection>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl text-[#b88645] mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground font-sans tracking-wide leading-relaxed">
              We would love to hear from you! Whether you have a question about an order, need help choosing the right piece, or just want to say hello — we are here. 💕
            </p>
          </div>
        </AnimatedSection>

        {/* ─── WhatsApp Hero Card ─── */}
        <AnimatedSection delay={0.1}>
          <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl p-8 text-white mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-2">
                Chat with us on WhatsApp
              </h2>
              <p className="text-white/90 font-sans mb-1">
                Fastest response, within 1-2 hours.
              </p>
              <p className="text-white/80 font-sans text-sm">
                Share your Order ID on WhatsApp for the fastest support.
              </p>
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#25D366] font-sans font-medium rounded-full px-8 py-3 hover:shadow-lg transition-shadow shrink-0"
            >
              Chat on WhatsApp →
            </a>
          </div>
        </AnimatedSection>

        {/* ─── Contact Cards Grid ─── */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Phone */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#b88645]/10 flex items-center justify-center text-[#b88645] mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-serif text-xl mb-2">Call Us</h3>
              <a
                href={getPhoneUrl()}
                className="text-2xl font-sans text-foreground hover:text-[#b88645] transition-colors"
              >
                {siteConfig.contact.phone}
              </a>
            </div>

            {/* Email */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#b88645]/10 flex items-center justify-center text-[#b88645] mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-serif text-xl mb-2">Email Us</h3>
              <a
                href={getEmailUrl()}
                className="font-sans text-foreground hover:text-[#b88645] transition-colors block mb-2"
              >
                {siteConfig.contact.email}
              </a>
              <span className="text-sm text-foreground/60 block">
                We reply within 24 hours.
              </span>
            </div>

            {/* Instagram */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#b88645]/10 flex items-center justify-center text-[#b88645] mb-4">
                <Instagram size={24} />
              </div>
              <h3 className="font-serif text-xl mb-2">Follow Us</h3>
              <a
                href={siteConfig.contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-sans text-foreground hover:text-[#b88645] transition-colors"
              >
                {siteConfig.contact.instagram.handle}
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Store Address */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#b88645]/10 flex items-center justify-center text-[#b88645] mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="font-serif text-xl mb-2">Store Address</h3>
              <p className="text-foreground/80 leading-relaxed font-sans">
                {address.line1}
                <br />
                {address.line2}
                <br />
                {address.state}, {address.zip}
              </p>
              <span className="text-sm italic text-foreground/60 mt-2 block">
                ({address.landmark})
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* ─── How We Can Help ─── */}
        <AnimatedSection delay={0.25}>
          <div className="bg-[#b88645]/5 rounded-3xl p-8 md:p-12 border border-[#b88645]/20 mb-12">
            <h2 className="font-serif text-2xl text-foreground mb-6">We can help you with:</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground/80 font-sans list-disc pl-5 mb-8">
              <li>Order tracking & delivery updates</li>
              <li>Exchange & return requests</li>
              <li>Product questions (size, material, occasion)</li>
              <li>Bulk & gifting orders</li>
              <li>Wedding & event jewellery packages</li>
            </ul>

            <div className="pt-6 border-t border-[#b88645]/20">
              <h3 className="font-serif text-xl mb-2 text-foreground">Planning a wedding or event?</h3>
              <p className="text-foreground/80 font-sans mb-4">
                We offer special pricing on bulk orders. WhatsApp us with your requirements and we will create a custom package just for you.
              </p>
              <p className="font-medium text-[#b88645]">
                — Team Lalisa Belle 💕
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* ─── Google Maps + Store Info ─── */}
        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Google Maps */}
            <div className="rounded-2xl overflow-hidden border">
              <iframe
                src={siteConfig.store.googleMapsEmbedUrl}
                title="Lalisa Belle store location"
                width="100%"
                className="min-h-[400px] w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Dark Store Card */}
            <div className="bg-[#222] rounded-3xl p-8 text-white flex flex-col justify-center">
              <h2 className="font-serif text-3xl mb-4">Visit Our Store</h2>
              <p className="text-white/70 font-sans leading-relaxed mb-6">
                Experience the full Lalisa Belle collection in person. Our
                Gurugram showroom showcases every piece of our premium imitation
                jewellery — try it on, feel the finish, and find your perfect
                match with personal styling advice.
              </p>
              <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 px-4 py-2 text-sm inline-flex items-center gap-2 mb-6 w-fit">
                {siteConfig.store.hours}
              </div>
              <a
                href={siteConfig.store.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#b88645] hover:underline font-sans font-medium"
              >
                Get Directions →
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Contact;
