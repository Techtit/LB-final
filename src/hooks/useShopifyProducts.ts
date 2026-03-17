import { useState, useEffect } from 'react';
import { fetchProducts, fetchProductByHandle, type ShopifyProduct } from '@/lib/shopify';

export function useShopifyProducts(query?: string) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchProducts(20, query)
      .then(data => { if (!cancelled) setProducts(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [query]);

  return { products, isLoading, error };
}

export function useShopifyProduct(handle: string | undefined) {
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) return;
    let cancelled = false;
    setIsLoading(true);
    fetchProductByHandle(handle)
      .then(data => { if (!cancelled) setProduct(data); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [handle]);

  return { product, isLoading, error };
}
