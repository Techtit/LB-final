import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const EntryPrompt = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenPrompt = sessionStorage.getItem("hasSeenEntryPrompt");
    if (!hasSeenPrompt) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelection = (category: string) => {
    sessionStorage.setItem("selectedCategory", category);
    sessionStorage.setItem("hasSeenEntryPrompt", "true");
    
    // Notify HeroSection to update its background immediately
    window.dispatchEvent(new CustomEvent("lb-category-selected", { detail: category }));
    
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("hasSeenEntryPrompt", "true");
  };

  const categories = ["Women", "Men", "Kids", "Pets"];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-[420px] bg-background border-none p-0 overflow-hidden rounded-xl shadow-2xl">
        <div className="relative bg-white p-8 md:p-12 flex flex-col items-center min-h-[500px]">
          <div className="text-center mt-4 mb-2">
            <h2 className="font-serif text-[42px] text-[#b88645] leading-tight mb-2">Welcome</h2>
            <p className="font-sans text-muted-foreground text-sm tracking-wide">
              Select a collection to begin your journey
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 mt-12 mb-10 w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleSelection(cat)}
                className="font-serif text-[32px] text-[#222] hover:text-[#b88645] transition-colors duration-300 focus:outline-none"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full h-[1px] bg-border/50 mb-8"></div>

          <button
            onClick={() => handleSelection("Women")} // Default to Women if general click
            className="uppercase tracking-[0.2em] text-[#b88645] font-sans text-sm font-medium hover:opacity-80 transition-opacity focus:outline-none"
          >
            Checkout the whole store
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntryPrompt;
