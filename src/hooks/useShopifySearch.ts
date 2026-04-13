import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";

export function useShopifySearch(searchTerm: string) {
  return useQuery({
    queryKey: ["shopify-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      // Pass the search term to the query parameter.
      // Shopify's storefront API handles title/description/tags searching automatically.
      const queryStr = `*${searchTerm}*`; 
      // Limit to 8 items to keep the search dropdown concise
      return await fetchProducts(8, queryStr);
    },
    enabled: searchTerm.length > 0,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });
}
