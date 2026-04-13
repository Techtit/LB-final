import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ExternalLink, Loader2, Shield } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useEffect } from "react";
import logo from "@/assets/logo.png";

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
        <SheetHeader>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Lalisa Belle" className="h-6 w-auto opacity-50" />
            <SheetTitle className="font-serif text-xl">Your Cart ({count})</SheetTitle>
          </div>
          <SheetDescription>{count === 0 ? "Your cart is empty" : `${count} item${count !== 1 ? 's' : ''} in your cart`}</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground font-sans">Your cart is empty</p>
            <p className="text-xs text-primary font-sans font-medium">🔥 Don't miss our flash sale!</p>
            <Button onClick={() => setIsCartOpen(false)} variant="outline">Continue Shopping</Button>
          </div>
        ) : (
          <>
            {/* Urgency banner */}
            <div className="bg-primary/10 border border-primary/20 rounded-md px-3 py-2 text-xs font-sans text-center text-primary font-medium">
              🔥 Items in your cart are selling fast! Complete your order now.
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => {
                const imgUrl = item.product.node.images?.edges?.[0]?.node?.url;
                const currency = item.price.currencyCode === 'INR' ? '₹' : item.price.currencyCode;
                return (
                  <div key={item.variantId} className="flex gap-3 p-3 rounded-md bg-muted/50">
                    {imgUrl && <img src={imgUrl} alt={item.product.node.title} className="w-20 h-20 object-cover rounded" />}
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

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span className="font-serif text-lg text-primary">₹{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Free shipping on orders above ₹499 ✨</p>
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading || isSyncing}>
                {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ExternalLink className="w-4 h-4 mr-2" />}
                Checkout — ₹{total.toFixed(2)}
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground font-sans">
                <Shield className="w-3 h-3" /> Secure checkout powered by Shopify
              </div>
              <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
