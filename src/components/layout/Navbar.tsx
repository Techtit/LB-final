import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, Heart, User, LogOut } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import SearchOverlay from "./SearchOverlay";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "All", to: "/shop" },
  { label: "Earrings", to: "/shop?category=Earrings" },
  { label: "Necklaces", to: "/shop?category=Necklaces" },
  { label: "Bangles", to: "/shop?category=Bangles" },
  { label: "Rings", to: "/shop?category=Rings" },
  { label: "Hair Accessories", to: "/shop?category=Hair Accessories" },
  { label: "Premium", to: "/shop?category=Premium" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const { items: wishlistItems } = useWishlist();
  const { user } = useUser();
  const { signOut } = useClerk();
  const count = totalItems();

  return (
    <>
      <div className="bg-foreground text-background text-center text-xs py-2 font-sans tracking-wider">
        FREE SHIPPING ON ORDERS ABOVE ₹499 ✨
      </div>

      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container grid grid-cols-3 items-center h-16 md:h-24">
          {/* Left Column */}
          <div className="flex items-center justify-start">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -ml-4 md:-ml-8 text-amber-300 hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors" aria-label="Menu">
              {isMenuOpen ? <X className="w-6 h-6 md:w-7 md:h-7" /> : <Menu className="w-6 h-6 md:w-7 md:h-7" />}
            </button>
          </div>

          {/* Center Column */}
          <Link to="/" className="flex flex-shrink-0 justify-center group" onClick={() => setIsMenuOpen(false)}>
            <img alt="Lalisa Belle" className="h-10 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" src={logo} />
          </Link>

          {/* Right Column */}
          <div className="flex items-center justify-end gap-1 md:gap-3">
            {/* Search — always visible */}
            <button className="p-2 text-white/80 hover:text-amber-300 transition-colors" aria-label="Search" onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }}>
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            {/* User / SignOut — desktop only */}
            {user ? (
              <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="hidden md:flex p-2 text-white/80 hover:text-amber-300 transition-colors" aria-label="Sign Out" title="Sign Out">
                <LogOut className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            ) : (
              <Link to="/auth" className="hidden md:flex p-2 text-white/80 hover:text-amber-300 transition-colors" aria-label="Sign In" onClick={() => setIsMenuOpen(false)}>
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            )}
            {/* Wishlist — desktop only (mobile: in sidebar) */}
            <Link to="/wishlist" className="hidden md:flex p-2 text-white/80 hover:text-amber-300 transition-colors relative" aria-label="Wishlist" onClick={() => setIsMenuOpen(false)}>
              <Heart className="w-5 h-5 md:w-6 md:h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            {/* Cart — always visible */}
            <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} className="p-2 text-white/80 hover:text-amber-300 transition-colors relative" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <nav className="absolute top-full left-0 w-full md:w-72 bg-black/95 backdrop-blur-md border-b md:border-r border-white/10 shadow-2xl z-40 transition-all duration-300">
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setIsMenuOpen(false)} className="block px-8 py-3 text-sm md:text-base font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-amber-300">
                  {link.label}
                </Link>
              ))}
              {/* Wishlist in sidebar (only for mobile, or hidden on desktop if already in header) */}
              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="md:hidden flex items-center gap-3 px-8 py-3 text-sm font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors border-t border-white/10 mt-2"
              >
                <Heart className="w-4 h-4" />
                Wishlist
                {wishlistItems.length > 0 && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              {/* User auth in sidebar (mobile only) */}
              <div className="md:hidden border-t border-white/10 mt-2">
                {user ? (
                  <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 px-8 py-3 text-sm font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-8 py-3 text-sm font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors">
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

