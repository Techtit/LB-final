import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useShopifySearch } from "@/hooks/useShopifySearch";
import { motion, AnimatePresence } from "framer-motion";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, 400);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results, isLoading, isFetching } = useShopifySearch(debouncedSearchTerm);

  // Auto-focus and lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
      setInputValue(""); // clear on close
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSearchSubmit();
    }
  };

  const handleSearchSubmit = () => {
    onClose();
    // Assuming the shop page can handle a q parameter or query parameter
    navigate(`/shop?q=${encodeURIComponent(inputValue.trim())}`);
  };

  const handleResultClick = (handle: string) => {
    onClose();
    navigate(`/product/${handle}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col"
        >
          {/* Header & Input */}
          <div className="container py-6 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-8 p-2 text-white/50 hover:text-white transition-colors"
              aria-label="Close search"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex items-center gap-4 border-b border-white/20 pb-4 mt-16 md:mt-10 mx-auto max-w-3xl">
              <Search className="w-8 h-8 text-amber-500" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for earrings, necklaces, rings..."
                className="w-full bg-transparent text-2xl md:text-4xl font-serif text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="container flex-1 overflow-y-auto pb-10">
            <div className="max-w-3xl mx-auto mt-8">
              {/* Loading State */}
              {(isLoading || isFetching) && inputValue.length > 0 && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
              )}

              {/* No Results State */}
              {!isLoading && !isFetching && debouncedSearchTerm && results?.length === 0 && (
                <div className="text-center py-12 text-white/50 font-sans text-lg">
                  No products found for "{debouncedSearchTerm}"
                </div>
              )}

              {/* Results List */}
              {!isLoading && !isFetching && results && results.length > 0 && (
                <div className="flex flex-col gap-4">
                  {results.slice(0, 8).map((product) => {
                    const p = product.node;
                    const img = p.images.edges[0]?.node?.url;
                    const price = parseFloat(p.priceRange.minVariantPrice.amount);
                    const currency = p.priceRange.minVariantPrice.currencyCode;

                    return (
                      <button
                        key={p.id}
                        onClick={() => handleResultClick(p.handle)}
                        className="flex items-center gap-6 p-4 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 text-left group"
                      >
                        {img ? (
                          <img
                            src={img}
                            alt={p.title}
                            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-white/5 rounded-md flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="font-serif text-lg md:text-xl text-white group-hover:text-amber-400 transition-colors truncate">
                            {p.title}
                          </h4>
                          <span className="text-amber-500 font-sans font-bold mt-1">
                            {currency === "INR" ? "₹" : currency}
                            {price}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  
                  {/* View All Search Results Link */}
                  {results.length > 0 && (
                    <button
                      onClick={handleSearchSubmit}
                      className="mt-6 text-center text-amber-500 hover:text-amber-400 font-sans font-medium hover:underline text-lg"
                    >
                      View all results for "{debouncedSearchTerm}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
