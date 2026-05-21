import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, type ShopifyProduct } from '@/lib/shopify';

export function useShopifyProducts(query?: string) {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['shopify-products', query || 'all'],
    queryFn: () => fetchProducts(250, query),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3, // Retry transient failures (e.g. 401s) up to 3 times
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  return { products, isLoading, error: error?.message || null };
}

export function useShopifyProduct(handle: string | undefined) {
  const { data: product = null, isLoading, error } = useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: () => handle ? fetchProductByHandle(handle) : Promise.resolve(null),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  return { product, isLoading, error: error?.message || null };
}

