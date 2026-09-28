"use node";
/**
 * LB Concierge — Product Sync Cron Job
 *
 * Runs every 6 hours. Fetches all products from Shopify Storefront API,
 * generates sentence embeddings via HuggingFace Inference API
 * (sentence-transformers/all-MiniLM-L6-v2, 384 dimensions),
 * and upserts them into the Convex product_embeddings table.
 *
 * No webhooks needed — this pull pattern keeps the vector index fresh
 * with at most 6 hours of lag, which is acceptable for a jewellery store.
 */
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const SHOPIFY_API_VERSION = "2025-07";
const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const BATCH_SIZE = 10; // Process products in batches to avoid HF rate limits

/** Generate a 384-dimensional embedding via HuggingFace Inference API */
async function generateEmbedding(text: string): Promise<number[]> {
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) throw new Error("HF_TOKEN not set in Convex environment variables");

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    // Handle model cold start — HF returns 503 when warming up
    if (response.status === 503) {
      console.warn("HuggingFace model is warming up, retrying in 15s...");
      await new Promise((r) => setTimeout(r, 15000));
      return generateEmbedding(text); // single retry
    }
    throw new Error(`HuggingFace API error ${response.status}: ${err}`);
  }

  const result = await response.json();
  // HF returns [[...384 numbers...]] for a single string input
  const embedding: number[] = Array.isArray(result[0]) ? result[0] : result;
  if (embedding.length !== 384) {
    throw new Error(`Unexpected embedding dimension: ${embedding.length}`);
  }
  return embedding;
}

/** Fetch all products from Shopify Storefront API (paginated) */
async function fetchAllShopifyProducts(): Promise<
  Array<{
    handle: string;
    title: string;
    description: string;
    tags: string[];
    productType: string;
    priceMin: number;
  }>
> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token) throw new Error("Missing Shopify credentials");

  const url = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const allProducts: ReturnType<typeof fetchAllShopifyProducts> extends Promise<infer T> ? T : never = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const query = `
      query SyncProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo { hasNextPage endCursor }
          edges {
            node {
              handle
              title
              description
              tags
              productType
              priceRange {
                minVariantPrice { amount }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables: { first: 50, after: cursor },
      }),
    });

    if (!response.ok) throw new Error(`Shopify error: ${response.status}`);
    const data = await response.json();
    const productsData = data?.data?.products;
    if (!productsData) break;

    for (const edge of productsData.edges) {
      const p = edge.node;
      allProducts.push({
        handle: p.handle,
        title: p.title,
        description: p.description || "",
        tags: p.tags || [],
        productType: p.productType || "",
        priceMin: parseFloat(p.priceRange.minVariantPrice.amount) || 0,
      });
    }

    hasNextPage = productsData.pageInfo.hasNextPage;
    cursor = productsData.pageInfo.endCursor;
  }

  return allProducts;
}

/** Build the text to embed for a product */
function buildEmbedText(p: {
  title: string;
  description: string;
  tags: string[];
  productType: string;
}): string {
  const parts = [p.title, p.productType, p.description, p.tags.join(" ")].filter(Boolean);
  // Truncate to ~512 chars to stay within model context limits
  return parts.join(". ").slice(0, 512);
}

/** Main sync action — called by the cron job */
export const syncProducts = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("[productSync] Starting Shopify → Convex product sync...");

    let products: Awaited<ReturnType<typeof fetchAllShopifyProducts>>;
    try {
      products = await fetchAllShopifyProducts();
    } catch (err) {
      console.error("[productSync] Failed to fetch Shopify products:", err);
      return;
    }

    console.log(`[productSync] Fetched ${products.length} products from Shopify`);

    const activeHandles: string[] = [];
    let synced = 0;
    let failed = 0;

    // Process in batches to respect HF rate limits
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (p) => {
          try {
            const embedText = buildEmbedText(p);
            const embedding = await generateEmbedding(embedText);

            await ctx.runMutation(internal.products.upsertProduct, {
              shopifyHandle: p.handle,
              title: p.title,
              description: p.description,
              tags: p.tags,
              productType: p.productType,
              priceMin: p.priceMin,
              embedding,
            });

            activeHandles.push(p.handle);
            synced++;
          } catch (err) {
            console.error(`[productSync] Failed to sync product ${p.handle}:`, err);
            failed++;
          }
        })
      );

      // Small delay between batches to be polite to HF
      if (i + BATCH_SIZE < products.length) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    // Remove stale products that no longer exist in Shopify
    try {
      await ctx.runMutation(internal.products.deleteStaleProducts, { activeHandles });
    } catch (err) {
      console.error("[productSync] Failed to delete stale products:", err);
    }

    console.log(`[productSync] Done. Synced: ${synced}, Failed: ${failed}`);
  },
});

/**
 * Manual trigger — useful for the initial seed after deployment.
 * Call via Convex dashboard: Actions → productSync.manualSync
 */
export const manualSync = internalAction({
  args: {},
  handler: async (ctx) => {
    await ctx.runAction(internal.productSync.syncProducts, {});
  },
});
