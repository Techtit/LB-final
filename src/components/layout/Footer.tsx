import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-foreground text-background/80">
    <div className="container py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <img src={logo} alt="Lalisa Belle" className="h-10 mb-4 brightness-200" />
          <p className="text-sm leading-relaxed opacity-70">
            Affordable elegance for everyday style. Premium oxidized jewellery that won't break the bank.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
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
        </div>

        {/* Help */}
        <div>
          <h4 className="font-serif text-sm font-semibold mb-4 text-background">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
            <li><Link to="/return-policy" className="hover:text-primary transition-colors">Return Policy</Link></li>
            <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-serif text-sm font-semibold mb-4 text-background">Stay Updated</h4>
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
        © 2026 Lalisa Belle. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
