import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Link } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const ProductCarouselStrip = () => {
  const { products, isLoading } = useShopifyProducts();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="bg-primary py-6 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary-foreground" />
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <section className="bg-primary py-4 relative group">
      <div className="container relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-foreground/40"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-primary-foreground" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-6"
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
                className="flex-shrink-0 flex items-center gap-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg px-3 py-2 transition-colors min-w-[220px]"
              >
                {img && (
                  <img
                    src={img}
                    alt={p.title}
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-primary-foreground truncate font-sans">
                    {p.title}
                  </p>
                  <p className="text-sm font-bold text-primary-foreground/90 font-sans">
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-foreground/40"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>
    </section>
  );
};

export default ProductCarouselStrip;
