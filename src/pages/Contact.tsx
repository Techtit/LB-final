import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import { MapPin, Phone, Instagram, ExternalLink } from "lucide-react";

const Contact = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>Contact Us — Lalisa Belle</title>
        <meta name="description" content="Visit us at our Gurgaon store or reach out via Instagram and phone for any inquiries." />
      </Helmet>

      <div className="container max-w-5xl px-4 mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl text-[#b88645] mb-4">Contact Us</h1>
            <p className="text-muted-foreground font-sans tracking-wide">
              We'd love to hear from you or see you at our store.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <AnimatedSection delay={0.1}>
            <div className="space-y-10 bg-white p-8 md:p-12 rounded-3xl border shadow-sm">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-[#b88645]/10 flex items-center justify-center shrink-0 text-[#b88645]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">Physical Address</h3>
                  <p className="text-foreground/70 leading-relaxed font-sans">
                    Ground Floor, M3M 65th Avenue,<br />
                    R7 LG 37, Sector 65, Gurugram,<br />
                    Haryana, 122018<br />
                    <span className="text-sm italic mt-2 block">(Opposite to SuperDogs and Arte Saloon)</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-[#b88645]/10 flex items-center justify-center shrink-0 text-[#b88645]">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">Call Us</h3>
                  <a href="tel:07947108635" className="text-2xl font-sans text-foreground hover:text-[#b88645] transition-colors">
                    07947108635
                  </a>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-full bg-[#b88645]/10 flex items-center justify-center shrink-0 text-[#b88645]">
                  <Instagram size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl mb-2">Social Media</h3>
                  <a 
                    href="https://instagram.com/lalisabelle" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-lg font-sans text-foreground hover:text-[#b88645] transition-colors"
                  >
                    @lalisabelle <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Store Info / Map Placeholder */}
          <AnimatedSection delay={0.2}>
            <div className="h-full min-h-[400px] bg-[#222] rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden text-white">
              <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
              <div className="relative z-10">
                <h2 className="font-serif text-3xl mb-4">Visit Our Store</h2>
                <p className="text-white/70 font-sans leading-relaxed mb-6">
                  Experience the luxury look of Lalisa Belle in person. Explore our entire collection of imitation and artificial jewellery in our Gurgaon showroom.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Open Monday - Sunday: 11 AM - 9:30 PM
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Contact;
