import { Link } from "react-router-dom";
import { ArrowRight, Tag, Diamond, Gift } from "lucide-react";

import img199 from "@/assets/budget-199.jpg";
import img299 from "@/assets/budget-299.jpg";
import img499 from "@/assets/budget-499.jpg";

const BudgetCollections = () => (
  <section className="py-12 md:py-16 bg-[#faf7f2]">
    <div className="container max-w-md md:max-w-6xl px-4 md:px-8">

      {/* Section Header */}
      <div className="text-center mb-8">
        <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-[#737373] mb-3 flex items-center justify-center gap-2">
          CURATED FOR EVERY YOU
        </p>
        <div className="flex justify-center mb-2">
          <div className="w-1.5 h-1.5 rotate-45 bg-[#b88645]"></div>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1a1a1a] mb-1">
          Budget-Friendly
        </h2>
        <p className="font-serif text-3xl md:text-4xl italic text-[#b88645] mb-3">
          Collections
        </p>
        <p className="text-[#737373] font-sans text-xs md:text-sm max-w-[250px] mx-auto">
          Stunning <span className="font-semibold text-[#b88645]">Lalisa Belle</span> jewellery at every price point.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="flex justify-between md:justify-center md:gap-16 mb-8 px-2">
        {[
          { icon: <Tag className="w-5 h-5 text-[#b88645]" strokeWidth={1.5} />, label: "Budget-Friendly", sub: "Prices you'll love" },
          { icon: <Diamond className="w-5 h-5 text-[#b88645]" strokeWidth={1.5} />, label: "Premium Quality", sub: "That lasts long" },
          { icon: <Gift className="w-5 h-5 text-[#b88645]" strokeWidth={1.5} />, label: "Perfect for Gifting", sub: "For every occasion" },
        ].map((badge) => (
          <div key={badge.label} className="flex flex-col items-center text-center">
            <div className="mb-2">{badge.icon}</div>
            <span className="text-[10px] md:text-xs font-sans font-bold text-[#1a1a1a] leading-tight">{badge.label}</span>
            <span className="text-[9px] md:text-[10px] font-sans text-[#737373]">{badge.sub}</span>
          </div>
        ))}
      </div>

      {/* Cards Stack/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* Card 1: Under ₹199 */}
        <Link
          to="/shop?maxPrice=199"
          className="group relative overflow-hidden rounded-xl h-[220px] md:h-[320px] shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Background Image */}
          <img src={img199} alt="Under 199" className="absolute inset-0 w-full h-full object-cover object-right md:object-center" />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f0e6] via-[#f7f0e6]/90 to-transparent w-[70%] md:w-[85%]" />
          
          {/* Content */}
          <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center max-w-[65%] md:max-w-[80%]">
            <p className="font-serif italic text-[#b88645] text-xl md:text-lg mb-0 leading-none">Under</p>
            <p className="font-serif text-[42px] md:text-5xl text-[#1a1a1a] mb-2 leading-none flex items-start">
              <span className="font-sans text-2xl md:text-3xl mt-1">₹</span>199
            </p>
            <p className="font-sans text-[11px] md:text-xs text-[#4a4a4a] leading-snug mb-4">
              Everyday sparkle<br />for every you.
            </p>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b88645] text-white text-[10px] md:text-[10px] font-sans font-medium rounded-full w-fit hover:bg-[#a0723a] transition-colors">
              Explore Collection <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </Link>

        {/* Card 2: Under ₹299 */}
        <Link
          to="/shop?maxPrice=299"
          className="group relative overflow-hidden rounded-xl h-[220px] md:h-[320px] shadow-sm hover:shadow-md transition-shadow"
        >
          <img src={img299} alt="Under 299" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f0e6] via-[#f7f0e6]/90 to-transparent w-[65%] md:w-[85%]" />
          
          <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center max-w-[65%] md:max-w-[80%]">
            <p className="font-serif italic text-[#b88645] text-xl md:text-lg mb-0 leading-none">Under</p>
            <p className="font-serif text-[42px] md:text-5xl text-[#1a1a1a] mb-2 leading-none flex items-start">
              <span className="font-sans text-2xl md:text-3xl mt-1">₹</span>299
            </p>
            <p className="font-sans text-[11px] md:text-xs text-[#4a4a4a] leading-snug mb-4">
              Trending right now.<br />Loved by all.
            </p>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b88645] text-white text-[10px] md:text-[10px] font-sans font-medium rounded-full w-fit hover:bg-[#a0723a] transition-colors">
              Shop Bestsellers <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </Link>

        {/* Card 3: Under ₹499 */}
        <Link
          to="/shop?maxPrice=499"
          className="group relative overflow-hidden rounded-xl h-[220px] md:h-[320px] shadow-sm hover:shadow-md transition-shadow"
        >
          <img src={img499} alt="Under 499" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f0e6] via-[#f7f0e6]/90 to-transparent w-[65%] md:w-[85%]" />
          
          <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-center max-w-[65%] md:max-w-[80%]">
            <p className="font-serif italic text-[#b88645] text-xl md:text-lg mb-0 leading-none">Under</p>
            <p className="font-serif text-[42px] md:text-5xl text-[#1a1a1a] mb-2 leading-none flex items-start">
              <span className="font-sans text-2xl md:text-3xl mt-1">₹</span>499
            </p>
            <p className="font-sans text-[11px] md:text-xs text-[#4a4a4a] leading-snug mb-4">
              Luxe look,<br />smart price.
            </p>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b88645] text-white text-[10px] md:text-[10px] font-sans font-medium rounded-full w-fit hover:bg-[#a0723a] transition-colors">
              Discover Luxe <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  </section>
);

export default BudgetCollections;
