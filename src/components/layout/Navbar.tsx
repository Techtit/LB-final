import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, Heart, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "All", to: "/shop" },
  { label: "Earrings", to: "/shop?category=Earrings" },
  { label: "Necklaces", to: "/shop?category=Necklaces" },
  { label: "Bangles", to: "/shop?category=Bangles" },
  { label: "Rings", to: "/shop?category=Rings" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, signOut } = useAuthStore();
  const count = totalItems();

  return (
    <>
      <div className="bg-foreground text-background text-center text-xs py-2 font-sans tracking-wider">
        FREE SHIPPING ON ORDERS ABOVE ₹499 ✨
      </div>

      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container grid grid-cols-3 items-center h-16 md:h-20">
          {/* Left Column */}
          <div className="flex items-center justify-start">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 -ml-2 text-amber-300 hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors" aria-label="Menu">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} className="text-sm font-sans font-medium text-white/80 hover:text-amber-300 transition-colors tracking-wide">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center Column */}
          <Link to="/" className="flex flex-shrink-0 justify-center">
            <img alt="Lalisa Belle" className="h-10 md:h-12 w-auto object-contain" src={logo} />
          </Link>

          {/* Right Column */}
          <div className="flex items-center justify-end gap-1">
            {/* Search — always visible */}
            <button className="p-2 text-white/80 hover:text-amber-300 transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            {/* User / SignOut — desktop only */}
            {user ? (
              <button onClick={signOut} className="hidden md:flex p-2 text-white/80 hover:text-amber-300 transition-colors" aria-label="Sign Out" title="Sign Out">
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link to="/auth" className="hidden md:flex p-2 text-white/80 hover:text-amber-300 transition-colors" aria-label="Sign In">
                <User className="w-5 h-5" />
              </Link>
            )}
            {/* Wishlist — desktop only (mobile: in sidebar) */}
            <Link to="/wishlist" className="hidden md:flex p-2 text-white/80 hover:text-amber-300 transition-colors relative" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            {/* Cart — always visible */}
            <button onClick={() => setIsCartOpen(true)} className="p-2 text-white/80 hover:text-amber-300 transition-colors relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-white/10 bg-black/90 pb-4">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)} className="block px-6 py-3 text-sm font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors">
                {link.label}
              </Link>
            ))}
            {/* Wishlist in mobile sidebar */}
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-6 py-3 text-sm font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors border-t border-white/10 mt-1"
            >
              <Heart className="w-4 h-4" />
              Wishlist
              {wishlistItems.length > 0 && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
