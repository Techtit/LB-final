import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import ProductCard from "@/components/ProductCard";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const { products, isLoading } = useShopifyProducts();

  return (
    <section className="py-16 md:py-20 bg-secondary/50">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs font-sans font-bold text-primary tracking-widest uppercase">Just Dropped</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-medium mb-1">New Arrivals</h2>
            <p className="text-muted-foreground font-sans text-sm">Fresh <span className="text-primary font-semibold">Lalisa Belle</span> styles</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1 text-sm font-sans text-primary font-medium hover:underline">
            Shop All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No products found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
