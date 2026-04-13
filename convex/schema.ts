import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  wishlists: defineTable({
    clerkUserId: v.string(),
    productHandle: v.string(),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_user_and_productHandle", ["clerkUserId", "productHandle"]),
});
