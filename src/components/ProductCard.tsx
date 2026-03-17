import { Link } from "react-router-dom";
import { ShoppingBag, Loader2, Flame, Eye, Heart } from "lucide-react";
import { type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const price = parseFloat(p.priceRange.minVariantPrice.amount);
  const compareAt = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null;
  const discount = compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : null;
  const imageUrl = p.images.edges[0]?.node?.url;
  const currency = p.priceRange.minVariantPrice.currencyCode;

  const toggleWishlist = useWishlistStore(state => state.toggleItem);
  const isWishlisted = useWishlistStore(state => state.isWishlisted(p.handle));

  // Simulated social proof
  const [viewers] = useState(() => Math.floor(Math.random() * 15) + 3);
  const [sold] = useState(() => Math.floor(Math.random() * 40) + 10);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (added) {
      const t = setTimeout(() => setAdded(false), 1500);
      return () => clearTimeout(t);
    }
  }, [added]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    setAdded(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(p.handle);
  };

  return (
    <div className="group">
      <Link to={`/product/${p.handle}`} className="block relative overflow-hidden rounded-md bg-muted aspect-square mb-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={p.images.edges[0]?.node?.altText || p.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount && (
            <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold tracking-wider rounded">
              {discount}% OFF
            </span>
          )}
          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider rounded flex items-center gap-1">
            <Flame className="w-3 h-3" /> SELLING FAST
          </span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-background transition-colors z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground/60 hover:text-destructive'}`} />
        </button>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !variant?.availableForSale}
          className={`absolute bottom-2 right-2 h-9 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md text-xs font-semibold font-sans
            ${added
              ? 'bg-green-600 text-white opacity-100'
              : 'bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground'
            } disabled:opacity-50`}
          aria-label="Add to cart"
        >
          {added ? '✓ Added!' : isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingBag className="w-4 h-4" /> Add</>}
        </button>
      </Link>

      <Link to={`/product/${p.handle}`}>
        <h3 className="text-sm font-medium leading-tight mb-1 group-hover:text-primary transition-colors font-sans">{p.title}</h3>
      </Link>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold text-foreground">{currency === 'INR' ? '₹' : currency}{price}</span>
        {compareAt && compareAt > price && (
          <span className="text-xs text-muted-foreground line-through">{currency === 'INR' ? '₹' : currency}{compareAt}</span>
        )}
        {discount && (
          <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">{discount}% off</span>
        )}
      </div>
      {/* Social proof */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-sans">
        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {viewers} viewing</span>
        <span>•</span>
        <span>{sold} sold</span>
      </div>
    </div>
  );
};

export default ProductCard;
