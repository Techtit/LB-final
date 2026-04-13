import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useWishlist() {
  const { user } = useUser();

  // Auth is now handled server-side — no clerkUserId argument needed
  const items = useQuery(api.wishlist.getByUser, user ? {} : "skip");

  const toggleMutation = useMutation(api.wishlist.toggle);
  const clearAllMutation = useMutation(api.wishlist.clearAll);

  const toggle = (productHandle: string) => {
    if (!user) return;
    toggleMutation({ productHandle });
  };

  const clearAll = () => {
    if (!user) return;
    clearAllMutation({});
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
