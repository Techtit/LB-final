import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, type ShopifyProduct } from '@/lib/shopify';

export function useShopifyProducts(query?: string) {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['shopify-products', query || 'all'],
    queryFn: () => fetchProducts(20, query),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return { products, isLoading, error: error?.message || null };
}

export function useShopifyProduct(handle: string | undefined) {
  const { data: product = null, isLoading, error } = useQuery({
    queryKey: ['shopify-product', handle],
    queryFn: () => handle ? fetchProductByHandle(handle) : Promise.resolve(null),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return { product, isLoading, error: error?.message || null };
}
