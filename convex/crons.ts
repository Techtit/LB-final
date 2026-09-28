/**
 * Convex Cron Jobs — Lalisa Belle
 *
 * Schedules periodic background jobs.
 * Per Convex guidelines: use crons.interval() or crons.cron() only.
 */
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

/**
 * Sync Shopify products into Convex vector index every 6 hours.
 * This keeps the LB Concierge's semantic search up to date
 * without needing Shopify webhooks.
 */
crons.interval(
  "sync shopify products for concierge",
  { hours: 6 },
  internal.productSync.syncProducts,
  {}
);

export default crons;
