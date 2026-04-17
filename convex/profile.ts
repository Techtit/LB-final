import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all addresses for the authenticated user
 */
export const getAddresses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.tokenIdentifier))
      .collect();
  },
});

/**
 * Get all orders for the authenticated user
 */
export const getOrders = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.tokenIdentifier))
      .collect();
  },
});

/**
 * Add a new address
 */
export const addAddress = mutation({
  args: {
    name: v.string(),
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // If this is set as default, unset other defaults
    if (args.isDefault) {
      const defaults = await ctx.db
        .query("addresses")
        .withIndex("by_user", (q) => q.eq("clerkUserId", identity.tokenIdentifier))
        .filter((q) => q.eq(q.field("isDefault"), true))
        .collect();
      
      for (const addr of defaults) {
        await ctx.db.patch(addr._id, { isDefault: false });
      }
    }

    return await ctx.db.insert("addresses", {
      ...args,
      clerkUserId: identity.tokenIdentifier,
    });
  },
});

/**
 * Delete an address
 */
export const deleteAddress = mutation({
  args: { id: v.id("addresses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const address = await ctx.db.get(args.id);
    if (!address || address.clerkUserId !== identity.tokenIdentifier) {
      throw new Error("Address not found or unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

/**
 * Update an existing address
 */
export const updateAddress = mutation({
  args: {
    id: v.id("addresses"),
    name: v.optional(v.string()),
    street: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    zip: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const address = await ctx.db.get(id);
    if (!address || address.clerkUserId !== identity.tokenIdentifier) {
      throw new Error("Address not found or unauthorized");
    }

    // If setting as default, unset others first
    if (updates.isDefault) {
      const defaults = await ctx.db
        .query("addresses")
        .withIndex("by_user", (q) => q.eq("clerkUserId", identity.tokenIdentifier))
        .filter((q) => q.eq(q.field("isDefault"), true))
        .collect();
      
      for (const addr of defaults) {
        if (addr._id !== id) {
          await ctx.db.patch(addr._id, { isDefault: false });
        }
      }
    }

    await ctx.db.patch(id, updates);
  },
});
