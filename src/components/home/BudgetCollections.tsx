import { Link } from "react-router-dom";
import { Tag, ArrowRight } from "lucide-react";

const collections = [
  { label: "Under ₹199", desc: "Starting at just ₹99", to: "/shop?maxPrice=199" },
  { label: "Under ₹299", desc: "Premium picks under budget", to: "/shop?maxPrice=299" },
  { label: "Under ₹499", desc: "Luxe look, smart price", to: "/shop?maxPrice=499" },
];

const BudgetCollections = () => (
  <section className="py-16 md:py-20">
    <div className="container">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Tag className="w-5 h-5 text-primary" />
          <span className="text-xs font-sans font-bold text-primary tracking-widest uppercase">Smart Shopping</span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-medium mb-2">Budget-Friendly Collections</h2>
        <p className="text-muted-foreground font-sans text-sm">Stunning <span className="text-primary font-semibold">Lalisa Belle</span> jewellery at every price point</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map((col) => (
          <Link
            key={col.label}
            to={col.to}
            className="relative overflow-hidden rounded-lg border border-border bg-card p-8 md:p-10 text-center group hover:border-primary hover:shadow-xl transition-all duration-300"
          >
            <p className="font-serif text-2xl md:text-3xl font-medium mb-1 group-hover:text-primary transition-colors">{col.label}</p>
            <p className="text-xs text-muted-foreground font-sans mb-3">{col.desc}</p>
            <span className="inline-flex items-center gap-1 text-sm text-primary font-sans font-medium">
              Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default BudgetCollections;
