import { useParams, Link } from "react-router-dom";
import { useShopifyProduct, useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag, Truck, Shield, RotateCcw, Loader2, Heart, Flame } from "lucide-react";

const ProductDetail = () => {
  const { handle } = useParams();
  const { product, isLoading } = useShopifyProduct(handle);
  const { products: allProducts } = useShopifyProducts();
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);
  const setIsCartOpen = useCartStore(state => state.setIsCartOpen);

  const toggleWishlist = useWishlistStore(state => state.toggleItem);
  const isWishlisted = useWishlistStore(state => state.isWishlisted(handle || ''));

  if (isLoading) {
    return <div className="container py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-serif text-2xl mb-4">Product not found</h1>
        <Button asChild variant="outline"><Link to="/shop">Back to Shop</Link></Button>
      </div>
    );
  }

  const variant = product.variants.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAt = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null;
  const discount = compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : null;
  const imageUrl = product.images.edges[0]?.node?.url;
  const currency = product.priceRange.minVariantPrice.currencyCode === 'INR' ? '\u20B9' : product.priceRange.minVariantPrice.currencyCode;

  const related = allProducts
    .filter(p => p.node.productType === product.productType && p.node.handle !== product.handle)
    .slice(0, 4);

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    const checkoutUrl = useCartStore.getState().getCheckoutUrl();
    if (checkoutUrl) window.open(checkoutUrl, '_blank');
  };

  return (
    <>
      <div className="container py-6 md:py-12">
        <nav className="text-xs text-muted-foreground mb-6 font-sans">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="relative aspect-square rounded-md overflow-hidden bg-muted">
            {imageUrl && <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />}
            {discount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold tracking-wider rounded">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="font-serif text-2xl md:text-3xl font-medium">{product.title}</h1>
              <button
                onClick={() => toggleWishlist(handle || '')}
                className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-destructive transition-colors"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground hover:text-destructive'}`} />
              </button>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-serif font-semibold">{currency}{price}</span>
              {compareAt && compareAt > price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{currency}{compareAt}</span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{discount}% off</span>
                </>
              )}
            </div>

            {/* Urgency indicator */}
            <div className="flex items-center gap-2 mb-6 text-xs font-sans">
              <span className="flex items-center gap-1 text-destructive font-semibold">
                <Flame className="w-3.5 h-3.5" /> Selling fast
              </span>
              <span className="text-muted-foreground">• Only a few left in stock</span>
            </div>

            <p className="text-sm text-foreground/80 leading-relaxed mb-6 font-sans">{product.description}</p>

            <ul className="space-y-2 mb-8 text-sm font-sans">
              <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Premium oxidized finish</li>
              <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Free shipping above ₹499</li>
              <li className="flex items-center gap-2"><RotateCcw className="w-4 h-4 text-primary" /> 7-day easy returns</li>
            </ul>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full font-sans tracking-wide" onClick={handleAddToCart} disabled={cartLoading || !variant?.availableForSale}>
                {cartLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingBag className="w-4 h-4 mr-2" />}
                Add to Cart — {currency}{price}
              </Button>
              <Button size="lg" variant="outline" className="w-full font-sans tracking-wide" onClick={handleBuyNow} disabled={cartLoading || !variant?.availableForSale}>
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container py-12 md:py-16">
          <h2 className="font-serif text-2xl font-medium mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 flex gap-3 md:hidden z-40">
        <button
          onClick={() => toggleWishlist(handle || '')}
          className="w-10 h-10 rounded-md border border-border flex items-center justify-center flex-shrink-0"
          aria-label="Wishlist"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-sans truncate">{product.title}</p>
          <p className="font-serif font-semibold">{currency}{price}</p>
        </div>
        <Button onClick={handleAddToCart} disabled={cartLoading} className="font-sans">
          {cartLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <ShoppingBag className="w-4 h-4 mr-1" />} Add
        </Button>
      </div>
    </>
  );
};

export default ProductDetail;
