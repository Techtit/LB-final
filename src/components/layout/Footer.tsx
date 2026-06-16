import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { siteConfig, getWhatsAppUrl, getPhoneUrl, getEmailUrl, getFullAddress } from "@/config/site";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-foreground text-background/80">
    <div className="container py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <img src={logo} alt="Lalisa Belle" className="h-10 mb-4 brightness-200" />
          <p className="text-sm leading-relaxed opacity-70">
            Affordable elegance for everyday style. Premium imitation jewellery that won't break the bank.
          </p>
          <div className="flex gap-4 mt-4">
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            {siteConfig.social.facebook && (
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            )}
            {siteConfig.social.twitter && (
              <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-sm font-semibold mb-4 text-background">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {["Shop All", "Earrings", "Necklaces", "Bangle", "Rings", "Pets"].map((l) => (
              <li key={l}><Link to={l === "Pets" ? "/shop?segment=Pets" : "/shop"} className="hover:text-primary transition-colors">{l}</Link></li>
            ))}
          </ul>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#20bd5a] transition-colors shadow-sm"
          >
            Chat on WhatsApp
          </a>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-serif text-sm font-semibold mb-4 text-background">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
            <li><Link to="/return-policy" className="hover:text-primary transition-colors">Return Policy</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div>
          <h4 className="font-serif text-sm font-semibold mb-4 text-background">Get In Touch</h4>

          {/* Contact details */}
          <ul className="space-y-3 text-sm mb-6">
            <li>
              <a href={getPhoneUrl()} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 shrink-0 opacity-60" />
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a href={getEmailUrl()} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 shrink-0 opacity-60" />
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 opacity-60"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 13.97c-.25.71-1.23 1.3-1.73 1.38-.47.07-1.07.1-1.73-.1-.39-.13-.9-.31-1.55-.6-2.72-1.24-4.49-3.98-4.63-4.17-.14-.18-1.13-1.5-1.13-2.87 0-1.36.72-2.04 .97-2.32.25-.27.55-.34.73-.34.18 0 .36 0 .52.01.17.01.39-.06.61.47.23.54.77 1.87.84 2 .07.14.11.3.02.48-.09.18-.14.28-.27.44-.14.16-.29.35-.41.47-.14.14-.28.28-.12.56.16.27.72 1.19 1.55 1.93 1.07.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.2.7-.81.88-1.09.18-.27.37-.23.62-.14.25.09 1.58.75 1.86.88.27.14.45.2.52.31.07.11.07.65-.18 1.36z" /></svg>
                WhatsApp
              </a>
            </li>
            <li className="flex items-start gap-2 opacity-70">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">{getFullAddress()}</span>
            </li>
          </ul>

          {/* Newsletter */}
          <p className="text-sm opacity-70 mb-3">Get exclusive offers & new arrival alerts.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 text-sm bg-background/10 border border-background/20 rounded-l-md placeholder:text-background/40 focus:outline-none focus:border-primary"
            />
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-r-md hover:bg-primary/90 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10 mt-10 pt-6 text-center text-xs opacity-50">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
