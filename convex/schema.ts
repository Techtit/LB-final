import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  wishlists: defineTable({
    clerkUserId: v.string(),
    productHandle: v.string(),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_user_and_productHandle", ["clerkUserId", "productHandle"]),

  addresses: defineTable({
    clerkUserId: v.string(),
    name: v.string(),
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
    isDefault: v.boolean(),
  }).index("by_user", ["clerkUserId"]),

  orders: defineTable({
    clerkUserId: v.string(),
    orderId: v.string(),
    date: v.string(),
    totalAmount: v.float64(),
    status: v.string(), // "Delivered", "Pending", "Cancelled"
    itemsCount: v.number(),
  }).index("by_user", ["clerkUserId"]),
});
