import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import catEarrings from "@/assets/cat-earrings.jpg";
import catNecklaces from "@/assets/Necklaces.png";
import catBangles from "@/assets/Bangles.png";
import catRings from "@/assets/Rings.png";
import catHair from "@/assets/Hair Accessories.png";
import catPremium from "@/assets/PREMIUM.png";

const categoryFallbacks: Record<string, string> = {
  Earrings: catEarrings,
  Necklaces: catNecklaces,
  Bangles: catBangles,
  Rings: catRings,
  "Hair Accessories": catHair,
  Premium: catPremium,
};

const cats = [
  { name: "Earrings", image: catEarrings, slug: "Earrings", count: "50+" },
  { name: "Necklaces", image: catNecklaces, slug: "Necklaces", count: "30+" },
  { name: "Bangles", image: catBangles, slug: "Bangles", count: "25+" },
  { name: "Rings", image: catRings, slug: "Rings", count: "20+" },
  { name: "Hair Accessories", image: catHair, slug: "Hair Accessories", count: "15+" },
  { name: "Premium", image: catPremium, slug: "Premium", count: "Exquisite" },
];

const CategorySection = () => {
  const { products, isLoading } = useShopifyProducts();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const scrollRef = useRef<HTMLDivElement>(null);

  const getCategoryImage = (catName: string, defaultImage: string) => {
    if (!products || products.length === 0) return defaultImage;
    const searchStr = catName.toLowerCase();
    const product = products.find(p => 
      p.node.productType?.toLowerCase().includes(searchStr) || 
      p.node.tags?.some(t => t.toLowerCase().includes(searchStr)) ||
      p.node.title?.toLowerCase().includes(searchStr) ||
      p.node.handle?.toLowerCase().includes(searchStr)
    );
    if (product && product.node.images?.edges?.length > 0) {
      return product.node.images.edges[0].node.url;
    }
    return defaultImage;
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  // Filter products by selected active category
  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => {
        const catLower = activeCategory.toLowerCase();
        const node = p.node;
        const pType = node.productType?.toLowerCase() || '';
        const title = node.title?.toLowerCase() || '';
        const tags = node.tags || [];
        return pType.includes(catLower) || 
               title.includes(catLower) || 
               tags.some(t => t.toLowerCase().includes(catLower));
      });

  // Get categories that have no products available
  const activeFallbackCategory = activeCategory !== "All" && filteredProducts.length === 0 ? activeCategory : null;

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl md:text-3xl font-medium mb-2">Shop by Category</h2>
          <p className="text-muted-foreground font-sans text-sm">Find your perfect <span className="text-primary font-semibold">Lalisa Belle</span> piece</p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
          {cats.map((cat) => (
            <Link 
              key={cat.slug} 
              to={`/shop?category=${cat.slug}`} 
              onClick={() => setActiveCategory(cat.name)}
              className="group relative overflow-hidden rounded-lg aspect-[3/4] shadow-md hover:shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              <img 
                src={getCategoryImage(cat.name, cat.image)} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                loading="lazy" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-serif text-lg text-white font-medium drop-shadow-sm">{cat.name}</h3>
                <span className="text-xs text-amber-500/90 font-sans tracking-wider uppercase font-semibold">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Carousel Section Below Category Grid */}
        <div className="bg-secondary/40 rounded-2xl p-6 md:p-8 border border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-serif text-xl md:text-2xl font-medium flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Featured Category Products
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground font-sans">
                Browse through our category showcases
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <Button
                variant={activeCategory === "All" ? "default" : "ghost"}
                size="sm"
                className="text-xs rounded-full h-8"
                onClick={() => setActiveCategory("All")}
              >
                All
              </Button>
              {cats.map((c) => (
                <Button
                  key={c.name}
                  variant={activeCategory === c.name ? "default" : "ghost"}
                  size="sm"
                  className="text-xs rounded-full h-8 whitespace-nowrap"
                  onClick={() => setActiveCategory(c.name)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div className="relative group/carousel">
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/90 border border-border shadow-md backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-background"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.node.id} className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[260px]">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                /* Fallback cards when no products available for specific category */
                (activeFallbackCategory ? [activeFallbackCategory] : cats.map(c => c.name)).map((catName) => (
                  <div 
                    key={catName}
                    className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[280px] bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group/card flex flex-col justify-between"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                      <img
                        src={categoryFallbacks[catName] || catEarrings}
                        alt={catName}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2.5 py-1 bg-amber-500 text-black text-[10px] font-bold tracking-wider rounded-md uppercase shadow-sm">
                          Fallback Showcase
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="font-serif text-lg font-medium drop-shadow-sm">{catName}</p>
                        <p className="text-[11px] text-amber-300 font-sans">Signature Lalisa Collection</p>
                      </div>
                    </div>
                    <div className="p-4 bg-card">
                      <p className="text-xs text-muted-foreground font-sans mb-3 line-clamp-2">
                        No active stock for {catName} right now. Explore upcoming designs and custom orders.
                      </p>
                      <Button asChild size="sm" variant="outline" className="w-full text-xs font-sans border-amber-500/50 hover:bg-amber-500 hover:text-black">
                        <Link to={`/shop?category=${catName}`}>
                          View {catName} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/90 border border-border shadow-md backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-background"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

