import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import ProductCard from "@/components/ProductCard";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const BestSellersSection = () => {
  const { products, isLoading } = useShopifyProducts();

  return (
    <section className="py-16 md:py-20 bg-secondary/50">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-8 w-auto opacity-30 hidden md:block" />
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-medium mb-1">Best Sellers</h2>
              <p className="text-muted-foreground font-sans text-sm">Our most loved <span className="text-primary font-semibold">Lalisa Belle</span> pieces</p>
            </div>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1 text-sm font-sans text-primary font-medium hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No products found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
        <Link to="/shop" className="md:hidden flex items-center justify-center gap-1 mt-6 text-sm font-sans text-primary font-medium">
          View All Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default BestSellersSection;
