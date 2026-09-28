/**
 * Internal Convex functions for product_embeddings table.
 * Used by the productSync cron and the concierge agent.
 *
 * NOTE: This file must NOT have "use node"; — it uses ctx.db and ctx.vectorSearch
 * which are only available in the default Convex V8 runtime.
 */
import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Vector search over product_embeddings.
 * Called by concierge.ts via ctx.runQuery(internal.products.vectorSearch, {...}).
 * Returns the top matching product handles sorted by semantic similarity.
 */
export const vectorSearch = internalQuery({
  args: {
    embedding: v.array(v.float64()),
    limit: v.number(),
    maxPrice: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    // Run vector search — optionally filter by max price at the index level
    const rawResults =
      args.maxPrice !== undefined
        ? await ctx.vectorSearch("product_embeddings", "by_embedding", {
            vector: args.embedding,
            limit: Math.min(args.limit * 2, 32), // fetch extra to account for post-filter
            filter: (q) => q.lte("priceMin", args.maxPrice!),
          })
        : await ctx.vectorSearch("product_embeddings", "by_embedding", {
            vector: args.embedding,
            limit: args.limit,
          });

    // Hydrate documents and return lightweight result set
    const docs = await Promise.all(rawResults.map((r) => ctx.db.get(r._id)));

    return docs
      .filter(Boolean)
      .slice(0, args.limit)
      .map((p) => ({
        handle: p!.shopifyHandle,
        title: p!.title,
        tags: p!.tags,
        productType: p!.productType,
        priceMin: p!.priceMin,
      }));
  },
});

/**
 * Upsert a product embedding record.
 * Called by productSync.ts during the periodic Shopify sync.
 */
export const upsertProduct = internalMutation({
  args: {
    shopifyHandle: v.string(),
    title: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
    productType: v.string(),
    priceMin: v.float64(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("product_embeddings")
      .withIndex("by_handle", (q) => q.eq("shopifyHandle", args.shopifyHandle))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, syncedAt: Date.now() });
    } else {
      await ctx.db.insert("product_embeddings", { ...args, syncedAt: Date.now() });
    }
  },
});

/**
 * Delete product embeddings that are no longer in Shopify.
 * Called by productSync.ts after syncing to remove stale records.
 */
export const deleteStaleProducts = internalMutation({
  args: {
    activeHandles: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const allDocs = await ctx.db.query("product_embeddings").take(500);
    const activeSet = new Set(args.activeHandles);

    for (const doc of allDocs) {
      if (!activeSet.has(doc.shopifyHandle)) {
        await ctx.db.delete(doc._id);
      }
    }
  },
});
