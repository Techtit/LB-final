import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const categories = [
  { name: "Earrings", slug: "Earrings" },
  { name: "Necklaces", slug: "Necklaces" },
  { name: "Bangles", slug: "Bangles" },
  { name: "Rings", slug: "Rings" },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const maxPrice = searchParams.get("maxPrice");

  // Build Shopify search query
  const shopifyQuery = useMemo(() => {
    const parts: string[] = [];
    if (category) parts.push(`product_type:${category}`);
    return parts.join(' AND ') || undefined;
  }, [category]);

  const { products, isLoading } = useShopifyProducts(shopifyQuery);

  // Client-side price filter
  const filtered = useMemo(() => {
    if (!maxPrice) return products;
    return products.filter(p => parseFloat(p.node.priceRange.minVariantPrice.amount) <= Number(maxPrice));
  }, [products, maxPrice]);

  const title = category || (maxPrice ? `Under ₹${maxPrice}` : "Shop All");

  return (
    <div className="container py-8 md:py-12">
      <nav className="text-xs text-muted-foreground mb-6 font-sans">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">{title}</h1>
      <p className="text-muted-foreground font-sans text-sm mb-8">{filtered.length} products</p>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button asChild variant={!category && !maxPrice ? "default" : "outline"} size="sm">
          <Link to="/shop">All</Link>
        </Button>
        {categories.map((cat) => (
          <Button key={cat.slug} asChild variant={category === cat.slug ? "default" : "outline"} size="sm">
            <Link to={`/shop?category=${cat.slug}`}>{cat.name}</Link>
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.node.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No products found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Shop;
