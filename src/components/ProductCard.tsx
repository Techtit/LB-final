import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Loader2, Flame, Eye, Heart } from "lucide-react";
import { type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const price = parseFloat(p.priceRange.minVariantPrice.amount);
  const compareAt = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null;
  const discount = compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : null;
  const imageUrl = p.images.edges[0]?.node?.url;
  const currency = p.priceRange.minVariantPrice.currencyCode;

  const { toggle: toggleWishlist, isWishlisted: checkWishlisted } = useWishlist();
  const isWishlisted = checkWishlisted(p.handle);

  const [isInView, setIsInView] = useState(false);
  const [forceShowMobile, setForceShowMobile] = useState(false);
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
    e.stopPropagation();
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
    e.stopPropagation();
    toggleWishlist(p.handle);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // On mobile, if button is not visible, show it first
    const isMobile = window.innerWidth < 768;
    const isButtonVisible = isInView || forceShowMobile || added;

    if (isMobile && !isButtonVisible) {
      e.preventDefault();
      setForceShowMobile(true);
    } else {
      // Allow normal Link navigation or programmatic navigate
      // Link handles this automatically if e.preventDefault() isn't called,
      // but if we are intercepting we might need to handle it.
      // Since it's inside a Link, if we don't prevent default, it will navigate.
    }
  };

  return (
    <motion.div 
      className="group"
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => {
        setIsInView(false);
        setForceShowMobile(false); // Hide forced button when scrolled away
      }}
      viewport={{ margin: "-25% 0px -55% 0px" }} // Triggers for the "slightly higher than center" row
    >
      <Link 
        to={`/product/${p.handle}`} 
        className="block relative overflow-hidden rounded-md bg-muted aspect-square mb-3"
        onClick={handleCardClick}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={p.images.edges[0]?.node?.altText || p.title}
            className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount && (
            <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold tracking-wider rounded shadow-sm">
              {discount}% OFF
            </span>
          )}
          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider rounded flex items-center gap-1 shadow-sm">
            <Flame className="w-3 h-3" /> SELLING FAST
          </span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-background transition-colors z-20"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground/60 hover:text-destructive'}`} />
        </button>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !variant?.availableForSale}
          className={cn(
            "absolute bottom-2 right-2 h-9 px-4 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 shadow-xl text-xs font-semibold font-sans z-30",
            // Base state: Hidden
            "opacity-0 pointer-events-none scale-90",
            // Desktop: Visible on hover
            "md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-hover:scale-100",
            // Mobile: Visible when in focused scroll row OR when thumbnail is touched
            (isInView || forceShowMobile) && "max-md:opacity-100 max-md:pointer-events-auto max-md:scale-100",
            // State: Item added
            added && "bg-green-600 text-white opacity-100 pointer-events-auto scale-100",
            // Theme: Normal vs Hover
            !added && "bg-background/95 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground border border-border/50"
          )}
          aria-label="Add to cart"
        >
          {added ? '✓ Added!' : isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingBag className="w-4 h-4" /> Add</>}
        </button>
      </Link>

      <Link to={`/product/${p.handle}`} className="block">
        <h3 className="text-sm font-medium leading-tight mb-1 md:group-hover:text-primary transition-colors font-sans truncate px-0.5">{p.title}</h3>
      </Link>
      <div className="flex items-center gap-2 mb-1 px-0.5">
        <span className="text-sm font-bold text-foreground">{currency === 'INR' ? '₹' : currency}{price}</span>
        {compareAt && compareAt > price && (
          <span className="text-xs text-muted-foreground line-through opacity-60">{currency === 'INR' ? '₹' : currency}{compareAt}</span>
        )}
        {discount && (
          <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded ml-auto">{discount}% off</span>
        )}
      </div>
      {/* Social proof */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-sans px-0.5">
        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3 text-primary/70" /> {viewers} viewing</span>
        <span>•</span>
        <span>{sold} sold</span>
      </div>
    </motion.div>
  );
};

export default ProductCard;
