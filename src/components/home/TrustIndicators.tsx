import { IndianRupee, Sparkles, Feather, Truck } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const indicators = [
  { icon: IndianRupee, title: "Affordable Pricing", desc: "Premium looks without the premium price" },
  { icon: Sparkles, title: "Quality Finish", desc: "Durable oxidized finish that lasts" },
  { icon: Feather, title: "Lightweight & Comfy", desc: "Designed for all-day comfortable wear" },
  { icon: Truck, title: "Fast Shipping", desc: "Quick delivery across India" },
];

const TrustIndicators = () => (
  <section className="py-16 md:py-20 border-y border-border">
    <div className="container">
      <div className="text-center mb-10">
        <img src={logo} alt="Lalisa Belle" className="h-10 mx-auto mb-3 opacity-20" />
        <h2 className="font-serif text-xl md:text-2xl font-medium">Why Choose <span className="text-primary font-semibold">Lalisa Belle</span>?</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {indicators.map((item, i) => (
          <motion.div
            key={item.title}
            className="text-center group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif text-sm font-medium mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustIndicators;
