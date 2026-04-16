import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function useWishlist() {
  const { user } = useUser();

  // Auth is now handled server-side — no clerkUserId argument needed
  const items = useQuery(api.wishlist.getByUser, user ? {} : "skip");

  const toggleMutation = useMutation(api.wishlist.toggle);
  const clearAllMutation = useMutation(api.wishlist.clearAll);

  const toggle = async (productHandle: string) => {
    if (!user) {
      toast.error("Sign in required", {
        description: "Please log in to save items to your wishlist.",
      });
      return;
    }

    try {
      const isCurrentlyWishlisted = items?.some(i => i.productHandle === productHandle);
      
      await toggleMutation({ productHandle });
      
      if (isCurrentlyWishlisted) {
        toast.success("Removed from wishlist");
      } else {
        toast.success("Added to wishlist", {
          description: "This item has been saved to your collection."
        });
      }
    } catch (error) {
      toast.error("Could not update wishlist");
    }
  };

  const clearAll = async () => {
    if (!user) return;
    try {
      await clearAllMutation({});
      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error("Failed to clear wishlist");
    }
  };

  const isWishlisted = (handle: string) =>
    items?.some((i) => i.productHandle === handle) ?? false;

  const handles = items?.map((i) => i.productHandle) ?? [];

  return {
    items: handles,
    toggle,
    isWishlisted,
    clearAll,
    isLoading: items === undefined,
  };
}
