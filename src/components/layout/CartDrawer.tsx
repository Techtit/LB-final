import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ExternalLink, Loader2, Shield } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useEffect } from "react";
import logo from "@/assets/logo.png";
import { SectionErrorBoundary } from "@/components/error/SectionErrorBoundary";
import { SafeImage } from "@/components/ui/SafeImage";

const CartDrawer = () => {
  const { items, isLoading, isSyncing, isCartOpen, setIsCartOpen, removeItem, updateQuantity, getCheckoutUrl, syncCart, totalItems, totalPrice } = useCartStore();
  const count = totalItems();
  const total = totalPrice();

  useEffect(() => { if (isCartOpen) syncCart(); }, [isCartOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsCartOpen(false);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Lalisa Belle" className="h-8 w-auto" />
            <SheetTitle className="font-serif text-2xl tracking-wide text-[#b88645]">Your Cart ({count})</SheetTitle>
          </div>
          <SheetDescription className="font-sans text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {count === 0 ? "Your selections" : `${count} item${count !== 1 ? 's' : ''} reserved`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 px-4">
            <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mb-2">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/60" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-foreground">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                Discover our latest collections and find your next favorite piece.
              </p>
            </div>
            <Button 
              onClick={() => setIsCartOpen(false)} 
              className="mt-4 px-8 bg-foreground text-background hover:bg-foreground/90 font-sans tracking-widest uppercase text-xs h-12"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <SectionErrorBoundary sectionName="Cart Items">
            <div className="bg-[#b88645]/5 border border-[#b88645]/20 rounded-md px-4 py-3 mt-4 text-xs font-sans text-center text-[#b88645] font-medium tracking-wide">
              High demand: Complete your order to secure your items.
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => {
                const imgUrl = item.product.node.images?.edges?.[0]?.node?.url;
                const currency = item.price.currencyCode === 'INR' ? '₹' : item.price.currencyCode;
                return (
                  <div key={item.variantId} className="flex gap-3 p-3 rounded-md bg-muted/50">
                    {imgUrl && <SafeImage src={imgUrl} alt={item.product.node.title} className="w-20 h-20 object-cover rounded" />}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product.node.title}</h4>
                      <p className="text-sm font-semibold text-primary mt-1">{currency} {parseFloat(item.price.amount)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-muted" aria-label="Decrease quantity">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-muted" aria-label="Increase quantity">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeItem(item.variantId)} className="ml-auto text-muted-foreground hover:text-destructive" aria-label="Remove item">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border/60 pt-5 space-y-4 pb-4">
              <div className="flex justify-between font-medium items-end">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">Subtotal</span>
                <span className="font-serif text-2xl text-[#b88645]">₹{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center italic font-serif">Free shipping on orders above ₹499</p>
              <Button 
                className="w-full h-14 bg-gradient-to-r from-[#b88645] to-[#7a5525] hover:opacity-90 text-white font-sans text-sm tracking-widest uppercase shadow-lg shadow-[#b88645]/20 border-0 transition-transform hover:scale-[1.02]" 
                onClick={handleCheckout} 
                disabled={isLoading || isSyncing}
              >
                {isLoading || isSyncing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Checkout
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60 font-sans tracking-widest uppercase pt-2">
                <Shield className="w-3.5 h-3.5" /> Secure checkout powered by Shopify
              </div>
            </div>
            </SectionErrorBoundary>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
