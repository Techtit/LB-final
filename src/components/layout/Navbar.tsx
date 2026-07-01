import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, Heart, User, LogOut } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import SearchOverlay from "./SearchOverlay";
import logo from "@/assets/logo.png";

type Segment = "Women" | "Men" | "Kids" | "Pets";

const categoryMap: Record<Segment, string[]> = {
  Women: [
    "Earrings",
    "Necklaces",
    "Bangles",
    "Rings",
    "Hair Accessories",
    "Bracelets",
    "Premium",
  ],
  Men: [
    "Chains",
    "Bracelets",
    "Rings",
    "Pendants",
    "Premium",
  ],
  Kids: [
    "Earrings",
    "Bracelets",
    "Necklaces",
    "Rings",
    "Hair Accessories",
    "Premium",
  ],
  Pets: [
    "Collars",
    "Tags",
    "Charms",
    "Premium",
  ],
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment>(() => {
    return (sessionStorage.getItem("selectedCategory") as Segment) || "Women";
  });

  const totalItems = useCartStore((state) => state.totalItems);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const { items: wishlistItems } = useWishlist();
  const { user } = useUser();
  const { signOut } = useClerk();
  const count = totalItems();

  // Sync segment from EntryPrompt custom event
  useEffect(() => {
    const handleCategoryChange = (e: any) => {
      if (e.detail && categoryMap[e.detail as Segment]) {
        setSelectedSegment(e.detail);
      }
    };

    window.addEventListener("lb-category-selected", handleCategoryChange);
    return () => window.removeEventListener("lb-category-selected", handleCategoryChange);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const currentCategories = categoryMap[selectedSegment] || categoryMap.Women;

  return (
    <>
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

        {/* Dropdown/Side Menu */}
        {isMenuOpen && (
          <>
            {/* Overlay to intercept clicks and prevent background touch */}
            <div 
              className="fixed inset-0 top-16 md:top-24 bg-black/50 z-30 touch-none"
              onClick={() => setIsMenuOpen(false)}
            />
            <nav 
              className="absolute top-full left-0 w-full md:w-72 bg-black/95 backdrop-blur-md border-b md:border-r border-white/10 shadow-2xl z-40 transition-all duration-300 h-[calc(100vh-64px)] md:h-[calc(100vh-96px)] overflow-y-auto overscroll-contain touch-pan-y"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="flex flex-col py-4">
            {/* Profile Link - PRIORITY #1 */}
              <Link 
                to="/profile" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-8 py-3 text-sm md:text-base font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-amber-300"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>

              {/* Segment Switcher */}
              <div className="px-6 py-3 border-b border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b88645]/60 mb-2 px-2">
                  Shopping For
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {(["Women", "Men", "Kids", "Pets"] as Segment[]).map((seg) => (
                    <button
                      key={seg}
                      onClick={() => {
                        setSelectedSegment(seg);
                        sessionStorage.setItem("selectedCategory", seg);
                        sessionStorage.setItem("hasSeenEntryPrompt", "true");
                        window.dispatchEvent(new CustomEvent("lb-category-selected", { detail: seg }));
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold tracking-wide transition-all duration-200 ${
                        selectedSegment === seg
                          ? "bg-[#b88645] text-black shadow-md shadow-amber-900/30"
                          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-amber-300 border border-white/10"
                      }`}
                    >
                      {seg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Links */}
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-8 py-3 text-sm md:text-base font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-amber-300">
                Home
              </Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block px-8 py-3 text-sm md:text-base font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-amber-300">
                All Collections
              </Link>

              {/* Dynamic Segment Categories */}
              <div className="mt-2 mb-1 px-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#b88645]/60 mb-2">
                  {selectedSegment} Collection
                </p>
              </div>

              {currentCategories.map((category) => (
                <Link 
                  key={category} 
                  to={`/shop?segment=${selectedSegment}&category=${category}`} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block px-8 py-3 text-sm md:text-base font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-amber-300"
                >
                  {category}
                </Link>
              ))}

              {/* Wishlist in sidebar (only for mobile) */}
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
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-8 py-3 text-sm font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Account Settings
                  </Link>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-8 py-3 text-sm font-sans font-medium text-white/80 hover:text-amber-300 hover:bg-white/5 transition-colors">
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
            </nav>
          </>
        )}
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;

