/**
 * Internal Convex functions for support_tickets table.
 * Called by the concierge agent when a user needs human escalation.
 */
import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a support ticket. Only succeeds if the DB write succeeds.
 * The concierge will ONLY tell the user their ticket was created after this resolves.
 */
export const createTicket = internalMutation({
  args: {
    ticketRef: v.string(),
    clerkUserId: v.string(),
    userEmail: v.string(),
    userName: v.string(),
    subject: v.string(),
    description: v.string(),
    issueType: v.string(),
    relatedOrderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("support_tickets", {
      ...args,
      status: "open",
    });
    return id;
  },
});

/**
 * Get all support tickets for the authenticated user (for profile page use).
 */
export const getMyTickets = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("support_tickets")
      .withIndex("by_user", (q) => q.eq("clerkUserId", args.clerkUserId))
      .order("desc")
      .take(20);
  },
});
