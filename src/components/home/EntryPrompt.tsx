import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Store, Users, Baby } from "lucide-react";

const EntryPrompt = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenPrompt = sessionStorage.getItem("hasSeenEntryPrompt");
    if (!hasSeenPrompt) {
      // Small delay for better UX
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem("hasSeenEntryPrompt", "true");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent className="sm:max-w-[320px] bg-background border-border pb-8">
        <DialogHeader className="pt-4 pb-2">
          <DialogTitle className="text-center font-serif text-2xl text-primary">Welcome</DialogTitle>
          <DialogDescription className="text-center font-sans tracking-wide text-muted-foreground">
            Select a collection to begin your journey
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-1 mt-4">
          <Link 
            to="/shop?segment=Women" 
            onClick={handleClose} 
            className="w-full text-center py-3 text-foreground hover:text-primary active:text-primary transition-colors text-xl font-serif tracking-wide"
          >
            Women
          </Link>
          <Link 
            to="/shop?segment=Men" 
            onClick={handleClose} 
            className="w-full text-center py-3 text-foreground hover:text-primary active:text-primary transition-colors text-xl font-serif tracking-wide"
          >
            Men
          </Link>
          <Link 
            to="/shop?segment=Kids" 
            onClick={handleClose} 
            className="w-full text-center py-3 text-foreground hover:text-primary active:text-primary transition-colors text-xl font-serif tracking-wide"
          >
            Kids
          </Link>
          <div className="w-2/3 h-px bg-border my-4"></div>
          <Link 
            to="/shop" 
            onClick={handleClose} 
            className="w-full text-center py-3 text-foreground hover:text-primary active:text-primary transition-colors text-base font-sans uppercase tracking-widest"
          >
            Checkout the whole store
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntryPrompt;
