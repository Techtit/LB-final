import { Link } from "react-router-dom";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ProductResult } from "../../../convex/concierge";
import { useState } from "react";

interface ConciergeProductCardProps {
  product: ProductResult;
  onNavigate?: () => void;
}

const ConciergeProductCard = ({ product, onNavigate }: ConciergeProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const [added, setAdded] = useState(false);

  const firstVariant = product.variants[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;

    // Build a ShopifyProduct-shaped object that cartStore expects
    const shopifyProduct = {
      node: {
        id: `gid://shopify/Product/${product.handle}`,
        title: product.title,
        description: product.description,
        descriptionHtml: "",
        handle: product.handle,
        productType: "",
        tags: [],
        priceRange: {
          minVariantPrice: {
            amount: String(product.price),
            currencyCode: product.currency,
          },
        },
        compareAtPriceRange: {
          minVariantPrice: {
            amount: String(product.compareAtPrice ?? product.price),
            currencyCode: product.currency,
          },
        },
        images: {
          edges: product.imageUrl
            ? [{ node: { url: product.imageUrl, altText: product.title } }]
            : [],
        },
        variants: {
          edges: product.variants.map((v) => ({ node: v })),
        },
        options: [],
      },
    };

    await addItem({
      product: shopifyProduct as Parameters<typeof addItem>[0]["product"],
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions ?? [],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all duration-200 group">
      {/* Image */}
      <Link
        to={`/product/${product.handle}`}
        onClick={onNavigate}
        className="flex-shrink-0"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-16 h-16 object-cover rounded-md group-hover:opacity-90 transition-opacity"
            loading="lazy"
          />
        ) : (
          <div className="w-16 h-16 bg-white/10 rounded-md" />
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link
            to={`/product/${product.handle}`}
            onClick={onNavigate}
            className="text-sm font-serif text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight"
          >
            {product.title}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-amber-400 font-bold text-sm">
              {product.currency === "INR" ? "₹" : product.currency}
              {product.price}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-white/40 text-xs line-through">
                ₹{product.compareAtPrice}
              </span>
            )}
            {discount && (
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                {discount}% off
              </span>
            )}
          </div>
          {!product.availableForSale && (
            <span className="text-xs text-red-400 mt-0.5 block">Out of stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2">
          <Link
            to={`/product/${product.handle}`}
            onClick={onNavigate}
            className="flex items-center gap-1 text-[11px] text-white/60 hover:text-amber-400 transition-colors font-sans"
          >
            <ExternalLink className="w-3 h-3" />
            View
          </Link>
          {product.availableForSale && firstVariant && (
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-sans font-semibold transition-all duration-200 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/30"
              }`}
            >
              <ShoppingBag className="w-3 h-3" />
              {added ? "Added!" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConciergeProductCard;
