import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return ctx.db
      .query("wishlists")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.tokenIdentifier))
      .collect();
  },
});

export const toggle = mutation({
  args: { productHandle: v.string() },
  handler: async (ctx, { productHandle }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.tokenIdentifier;

    const existing = await ctx.db
      .query("wishlists")
      .withIndex("by_user_and_productHandle", (q) =>
        q.eq("clerkUserId", userId).eq("productHandle", productHandle)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("wishlists", { clerkUserId: userId, productHandle });
    }
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const items = await ctx.db
      .query("wishlists")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.tokenIdentifier))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }
  },
});
