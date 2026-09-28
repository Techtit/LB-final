import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, Sparkles } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useShopifySearch } from "@/hooks/useShopifySearch";
import { motion, AnimatePresence } from "framer-motion";
import ConciergeChat from "@/components/concierge/ConciergeChat";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isAssistantMode, setIsAssistantMode] = useState(false);
  const [pendingChatMessage, setPendingChatMessage] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, 400);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Standard Shopify search (only active in search mode)
  const { data: results, isLoading, isFetching } = useShopifySearch(
    isAssistantMode ? "" : debouncedSearchTerm
  );

  // Auto-focus and lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
      setInputValue("");
      setIsAssistantMode(false);
      setPendingChatMessage("");
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
      if (isAssistantMode) {
        // Send to AI concierge
        setPendingChatMessage(inputValue.trim());
        setInputValue("");
      } else {
        handleSearchSubmit();
      }
    }
  };

  const handleSearchSubmit = () => {
    onClose();
    navigate(`/shop?q=${encodeURIComponent(inputValue.trim())}`);
  };

  const handleResultClick = (handle: string) => {
    onClose();
    navigate(`/product/${handle}`);
  };

  const toggleAssistantMode = () => {
    setIsAssistantMode((prev) => !prev);
    setInputValue("");
    setPendingChatMessage("");
    setTimeout(() => inputRef.current?.focus(), 50);
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
          <div className="container py-6 relative flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute right-4 top-8 p-2 text-white/50 hover:text-white transition-colors"
              aria-label="Close search"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex items-center gap-4 border-b border-white/20 pb-4 mt-16 md:mt-10 mx-auto max-w-3xl">
              {isAssistantMode ? (
                <Sparkles className="w-8 h-8 text-amber-400 flex-shrink-0" />
              ) : (
                <Search className="w-8 h-8 text-amber-500 flex-shrink-0" />
              )}

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isAssistantMode
                    ? "Ask LB Concierge anything..."
                    : "Search for earrings, necklaces, rings..."
                }
                className="w-full bg-transparent text-2xl md:text-4xl font-serif text-white placeholder:text-white/30 focus:outline-none"
              />

              {/* ✨ AI Toggle Button */}
              <button
                onClick={toggleAssistantMode}
                title={isAssistantMode ? "Switch to search" : "Switch to AI assistant"}
                aria-label={isAssistantMode ? "Switch to search mode" : "Switch to AI assistant mode"}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-all duration-300 border ${
                  isAssistantMode
                    ? "bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10"
                    : "bg-white/5 border-white/15 text-white/50 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAssistantMode ? "AI" : "AI"}</span>
              </button>
            </div>

            {/* Mode indicator label */}
            <div className="max-w-3xl mx-auto mt-2 px-1">
              <p className="text-xs font-sans text-white/30 tracking-wide">
                {isAssistantMode
                  ? "✨ LB Concierge — AI shopping & support assistant"
                  : "Press Enter to search all products"}
              </p>
            </div>
          </div>

          {/* Results / Chat Area */}
          <div className="container flex-1 overflow-y-auto pb-10 min-h-0">
            <div className="max-w-3xl mx-auto mt-4 h-full flex flex-col">
              <AnimatePresence mode="wait">
                {isAssistantMode ? (
                  /* ── AI Concierge Chat ── */
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col min-h-0"
                  >
                    <ConciergeChat
                      pendingMessage={pendingChatMessage}
                      onMessageConsumed={() => setPendingChatMessage("")}
                      onNavigate={onClose}
                    />
                  </motion.div>
                ) : (
                  /* ── Standard Search Results ── */
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Loading State */}
                    {(isLoading || isFetching) && inputValue.length > 0 && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                      </div>
                    )}

                    {/* No Results State */}
                    {!isLoading && !isFetching && debouncedSearchTerm && results?.length === 0 && (
                      <div className="text-center py-12 text-white/50 font-sans text-lg">
                        No products found for &ldquo;{debouncedSearchTerm}&rdquo;
                        <p className="text-sm mt-2 text-white/30">
                          Try the{" "}
                          <button
                            onClick={toggleAssistantMode}
                            className="text-amber-400 hover:text-amber-300 underline"
                          >
                            ✨ AI assistant
                          </button>{" "}
                          for smarter search
                        </p>
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

                        {/* View All Results */}
                        {results.length > 0 && (
                          <button
                            onClick={handleSearchSubmit}
                            className="mt-6 text-center text-amber-500 hover:text-amber-400 font-sans font-medium hover:underline text-lg"
                          >
                            View all results for &ldquo;{debouncedSearchTerm}&rdquo;
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
