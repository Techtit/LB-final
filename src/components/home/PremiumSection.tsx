import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Link } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight, Gem } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const PremiumSection = () => {
  // Querying for 'product_type:Premium' or 'tag:Premium'
  // using product_type here based on standard Shopify structure for this app
  const { products, isLoading } = useShopifyProducts("product_type:Premium");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="bg-black py-16 flex justify-center border-y border-amber-500/20">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-black via-zinc-950 to-black py-20 relative group border-y border-amber-500/30">
      <div className="container relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <Gem className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 font-sans text-xs tracking-widest uppercase font-semibold">Exclusive</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-white mb-2">Lalisa Premium</h2>
            <p className="text-white/60 font-sans text-sm max-w-md">
              Discover our most exquisite pieces, crafted with extraordinary perfection and premium materials for the ultimate luxury statement.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-6 md:mt-0 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black">
            <Link to="/shop?category=Premium">View Collection</Link>
          </Button>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-amber-500/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500/20 hover:border-amber-500"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-amber-500" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-8 pt-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => {
              const p = product.node;
              const img = p.images.edges[0]?.node?.url;
              const price = parseFloat(p.priceRange.minVariantPrice.amount);
              const currency = p.priceRange.minVariantPrice.currencyCode;

              return (
                <Link
                  key={p.id}
                  to={`/product/${p.handle}`}
                  className="flex-shrink-0 group/card relative w-[260px] md:w-[300px] border border-amber-500/10 hover:border-amber-500/50 rounded-xl overflow-hidden bg-white/5 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-amber-500/20"
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    {img && (
                      <img
                        src={img}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-sm font-serif text-white font-medium mb-1 drop-shadow-md">
                      {p.title}
                    </p>
                    <p className="text-base font-bold text-amber-400 font-sans tracking-wide">
                      {currency === "INR" ? "₹" : currency}
                      {price}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-amber-500/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500/20 hover:border-amber-500"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-amber-500" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
