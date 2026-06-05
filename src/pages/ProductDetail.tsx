import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { useShopifyProduct, useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag, Truck, Shield, RotateCcw, Loader2, Heart, Flame } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import { ProductGallery } from "@/components/ProductGallery";

const ProductDetail = () => {
  const { handle } = useParams();
  const { product, isLoading } = useShopifyProduct(handle);
  const { products: allProducts } = useShopifyProducts();
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);
  const setIsCartOpen = useCartStore(state => state.setIsCartOpen);

  const { toggle: toggleWishlist, isWishlisted: checkWishlisted } = useWishlist();
  const isWishlisted = checkWishlisted(handle || '');

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
  const images = product.images.edges.map(edge => edge.node);
  const currencyCode = product.priceRange.minVariantPrice.currencyCode;
  const currency = currencyCode === 'INR' ? '₹' : currencyCode;

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
      <Helmet>
        <title>{product.title} | Lalisa Belle</title>
        <meta name="description" content={product.description?.substring(0, 150) || `Buy ${product.title} at Lalisa Belle.`} />
      </Helmet>
      <div className="container py-6 md:py-12">
        <nav className="text-xs text-muted-foreground mb-6 font-sans">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="flex flex-col gap-4">
            <ProductGallery images={images} title={product.title} discount={discount} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2 tracking-tight">{product.title}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-sm">★</span>)}
                  </div>
                  <span className="text-xs text-muted-foreground font-sans">4.9 (124 reviews)</span>
                </div>
              </div>
              <button
                onClick={() => toggleWishlist(handle || '')}
                className="flex-shrink-0 w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-destructive/5 hover:border-destructive transition-all duration-300 group"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-6 h-6 transition-all duration-300 ${isWishlisted ? 'fill-destructive text-destructive scale-110' : 'text-muted-foreground group-hover:text-destructive'}`} />
              </button>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-serif font-semibold text-foreground">
                <span className="font-sans font-medium mr-[2px]">{currency}</span>{price.toLocaleString()}
              </span>
              {compareAt && compareAt > price && (
                <div className="flex items-center gap-2">
                  <span className="text-xl text-muted-foreground line-through opacity-60">
                    <span className="font-sans mr-[2px]">{currency}</span>{compareAt.toLocaleString()}
                  </span>
                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded font-bold uppercase tracking-wider">Save {discount}%</span>
                </div>
              )}
            </div>

            {/* Urgency indicator */}
            <div className="inline-flex items-center gap-2 mb-8 p-3 bg-primary/5 border border-primary/10 rounded-lg text-sm font-sans w-fit">
              <span className="flex items-center gap-1.5 text-primary font-bold">
                <Flame className="w-4 h-4 fill-primary/20" /> Selling fast
              </span>
              <span className="text-muted-foreground flex items-center gap-1.5">
                8 people have this in their cart
              </span>
            </div>

            <div className="space-y-6 mb-8">
              <div 
                className="prose prose-sm font-sans text-foreground/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col p-3 rounded-lg bg-muted/30 border border-border/40">
                  <Shield className="w-5 h-5 text-primary mb-2" />
                  <span className="text-xs font-bold uppercase tracking-tighter opacity-70">Quality</span>
                  <span className="text-xs font-sans">Oxidized Silver Finish</span>
                </div>
                <div className="flex flex-col p-3 rounded-lg bg-muted/30 border border-border/40">
                  <Truck className="w-5 h-5 text-primary mb-2" />
                  <span className="text-xs font-bold uppercase tracking-tighter opacity-70">Shipping</span>
                  <span className="text-xs font-sans">Free above ₹499</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full h-14 font-sans text-base font-bold tracking-wide rounded-xl shadow-lg shadow-primary/20" onClick={handleAddToCart} disabled={cartLoading || !variant?.availableForSale}>
                {cartLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ShoppingBag className="w-5 h-5 mr-2" />}
                Add to Bag — {currency}{price.toLocaleString()}
              </Button>
              <Button size="lg" variant="outline" className="w-full h-14 font-sans text-base font-medium tracking-wide rounded-xl hover:bg-muted/50 transition-colors" onClick={handleBuyNow} disabled={cartLoading || !variant?.availableForSale}>
                Express Checkout
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="flex items-center gap-6 justify-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">7-Day Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Fast Delivery</span>
                </div>
              </div>
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
