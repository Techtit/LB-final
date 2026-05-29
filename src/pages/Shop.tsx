import { useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const categories = [
  { name: "Earrings", slug: "Earrings" },
  { name: "Necklaces", slug: "Necklaces" },
  { name: "Bangles", slug: "Bangles" },
  { name: "Rings", slug: "Rings" },
  { name: "Hair Accessories", slug: "Hair Accessories" },
  { name: "Premium", slug: "Premium" },
];

const segments = [
  { name: "Men", slug: "Men" },
  { name: "Women", slug: "Women" },
  { name: "Kids", slug: "Kids" },
  { name: "Pets", slug: "Pets" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const maxPrice = searchParams.get("maxPrice");
  const segment = searchParams.get("segment");

  // Fetch ALL products (up to 250) so we can do smart filtering on the client
  const { products, isLoading } = useShopifyProducts();

  // Client-side semantic filter
  const filtered = useMemo(() => {
    let result = products;

    // 1. Semantic Category Match (e.g. "Earrings")
    if (category) {
      const catLower = category.toLowerCase();
      result = result.filter(p => {
        const node = p.node;
        const pType = node.productType?.toLowerCase() || '';
        const title = node.title?.toLowerCase() || '';
        const tags = node.tags || [];
        const description = node.descriptionHtml?.toLowerCase() || '';
        
        return pType === catLower || 
               title.includes(catLower) || 
               tags.some(t => t.toLowerCase() === catLower) ||
               description.includes(catLower);
      });
    }

    // 2. Semantic Segment Match (e.g. "Women", "Men")
    if (segment) {
      const segLower = segment.toLowerCase();
      result = result.filter(p => {
        const node = p.node;
        const title = node.title?.toLowerCase() || '';
        const tags = node.tags || [];
        const description = node.descriptionHtml?.toLowerCase() || '';
        
        return title.includes(segLower) || 
               tags.some(t => t.toLowerCase() === segLower) ||
               description.includes(segLower);
      });
    }

    // 3. Price Filter (e.g. "Under ₹199")
    if (maxPrice) {
      result = result.filter(p => parseFloat(p.node.priceRange.minVariantPrice.amount) <= Number(maxPrice));
    }

    return result;
  }, [products, category, segment, maxPrice]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (!value) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    return params.toString();
  };

  const title = category ? category : segment ? `${segment}'s Collection` : (maxPrice ? `Under ₹${maxPrice}` : "Shop All");

  return (
    <>
      <Helmet>
        <title>{title} | Lalisa Belle</title>
        <meta name="description" content={`Browse our ${title.toLowerCase()} and discover affordable oxidized jewellery.`} />
      </Helmet>
      <div className="container py-8 md:py-12">
        <nav className="text-xs text-muted-foreground mb-6 font-sans">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{title}</span>
        </nav>

      <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">{title}</h1>
      <p className="text-muted-foreground font-sans text-sm mb-8">{filtered.length} products</p>

      {/* Categories Filter */}
      <div className="mb-4">
        <p className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Categories</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant={!category ? "default" : "outline"} size="sm">
            <Link to={`/shop?${createQueryString('category', '')}`}>All Categories</Link>
          </Button>
          {categories.map((cat) => (
            <Button key={cat.slug} asChild variant={category === cat.slug ? "default" : "outline"} size="sm">
              <Link to={`/shop?${createQueryString('category', cat.slug)}`}>{cat.name}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Segments Filter */}
      <div className="mb-8">
        <p className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">Collections</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant={!segment ? "default" : "outline"} size="sm">
            <Link to={`/shop?${createQueryString('segment', '')}`}>Any</Link>
          </Button>
          {segments.map((seg) => (
            <Button key={seg.slug} asChild variant={segment === seg.slug ? "default" : "outline"} size="sm">
              <Link to={`/shop?${createQueryString('segment', seg.slug)}`}>{seg.name}</Link>
            </Button>
          ))}
        </div>
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
        <div className="text-center py-20 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No products found matching your current filters.</p>
          <Button asChild variant="outline">
            <Link to="/shop">Clear All Filters</Link>
          </Button>
        </div>
      )}
    </div>
    </>
  );
};

export default Shop;
