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

  /**
   * Product embeddings for semantic vector search.
   * Synced from Shopify every 6 hours via the productSync cron job.
   * Embedding model: sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
   */
  product_embeddings: defineTable({
    shopifyHandle: v.string(),
    title: v.string(),
    description: v.string(),
    tags: v.array(v.string()),
    productType: v.string(),
    priceMin: v.float64(),
    embedding: v.array(v.float64()), // 384-dimensional vector
    syncedAt: v.number(),
  })
    .index("by_handle", ["shopifyHandle"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 384,
      filterFields: ["priceMin"],
    }),

  /**
   * Support tickets raised via LB Concierge.
   * Created only when the user has a genuine complaint/escalation.
   */
  support_tickets: defineTable({
    ticketRef: v.string(),       // e.g. "LB-3A2F"
    clerkUserId: v.string(),
    userEmail: v.string(),
    userName: v.string(),
    subject: v.string(),
    description: v.string(),
    issueType: v.string(),       // "damaged", "wrong", "missing", "refund", "other"
    relatedOrderId: v.optional(v.string()),
    status: v.string(),          // "open", "in_progress", "resolved"
  })
    .index("by_user", ["clerkUserId"])
    .index("by_status", ["status"]),
});
