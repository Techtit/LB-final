import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const Wishlist = () => {
  const { items, clearWishlist } = useWishlistStore();
  const { products } = useShopifyProducts();

  const wishlistedProducts = products.filter((p) => items.includes(p.node.handle));

  return (
    <div className="container py-10 md:py-16 min-h-[60vh]">
      <AnimatedSection>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-medium flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" /> My Wishlist
            </h1>
            <p className="text-muted-foreground text-sm font-sans mt-1">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
          </div>
          {items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearWishlist} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Clear All
            </Button>
          )}
        </div>
      </AnimatedSection>

      {items.length === 0 ? (
        <AnimatedSection>
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="font-serif text-xl mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-sm mb-6 font-sans">Save items you love to find them easily later</p>
            <Button asChild>
              <Link to="/shop"><ArrowLeft className="w-4 h-4 mr-2" /> Browse Products</Link>
            </Button>
          </div>
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {wishlistedProducts.map((product) => (
            <AnimatedSection key={product.node.id}>
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
          {/* Show placeholder for products not yet loaded from Shopify */}
          {items.filter(h => !wishlistedProducts.some(p => p.node.handle === h)).length > 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground">Some wishlisted products are still loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
