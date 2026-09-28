"use node";
/**
 * LB Concierge — LangGraph AI Agent
 *
 * Runs entirely server-side in Convex's Node.js runtime.
 * Zero LangChain/LangGraph code ships to the browser.
 *
 * Architecture:
 *   Frontend → useAction(api.concierge.chat) → LangGraph ReAct agent
 *   → tools (product search, FAQ, orders, escalation)
 *   → structured response to frontend
 */
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { ActionCtx } from "./_generated/server";
import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchKnowledge } from "./knowledge";

const SHOPIFY_API_VERSION = "2025-07";
const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProductResult {
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  imageUrl: string | null;
  description: string;
  availableForSale: boolean;
  variants: Array<{
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    compareAtPrice: { amount: string; currencyCode: string } | null;
    availableForSale: boolean;
    selectedOptions: Array<{ name: string; value: string }>;
  }>;
}

export interface OrderResult {
  id: string;
  name: string; // e.g. #1234
  createdAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: string;
  currency: string;
  trackingUrl: string | null;
  trackingNumber: string | null;
  lineItems: Array<{ title: string; quantity: number }>;
}

export interface TicketResult {
  ticketRef: string;
  whatsappUrl: string;
}

export interface ConciergeResponse {
  reply: string;
  products?: ProductResult[];
  orders?: OrderResult[];
  ticket?: TicketResult;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate embedding via HuggingFace Inference API */
async function generateQueryEmbedding(text: string): Promise<number[]> {
  const hfToken = process.env.HF_TOKEN;
  if (!hfToken) throw new Error("HF_TOKEN not configured");

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

  if (response.status === 503) {
    // Model cold start — wait and retry once
    await new Promise((r) => setTimeout(r, 8000));
    return generateQueryEmbedding(text);
  }

  if (!response.ok) throw new Error(`HuggingFace error: ${response.status}`);

  const result = await response.json();
  return Array.isArray(result[0]) ? result[0] : result;
}

/** Fetch full product data from Shopify Storefront API by handles */
async function fetchShopifyProductsByHandles(
  handles: string[]
): Promise<ProductResult[]> {
  if (handles.length === 0) return [];

  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !token) throw new Error("Missing Shopify credentials");

  const url = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const results: ProductResult[] = [];

  // Fetch products individually to avoid complex GQL aliasing
  await Promise.all(
    handles.map(async (handle) => {
      try {
        const query = `
          query GetProduct($handle: String!) {
            product(handle: $handle) {
              handle title description
              availableForSale
              priceRange { minVariantPrice { amount currencyCode } }
              compareAtPriceRange { minVariantPrice { amount currencyCode } }
              images(first: 1) { edges { node { url } } }
              variants(first: 5) {
                edges { node {
                  id title availableForSale
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                  selectedOptions { name value }
                } }
              }
            }
          }
        `;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
          },
          body: JSON.stringify({ query, variables: { handle } }),
        });
        const data = await res.json();
        const p = data?.data?.product;
        if (!p) return;

        results.push({
          handle: p.handle,
          title: p.title,
          price: parseFloat(p.priceRange.minVariantPrice.amount),
          compareAtPrice: p.compareAtPriceRange?.minVariantPrice?.amount
            ? parseFloat(p.compareAtPriceRange.minVariantPrice.amount)
            : null,
          currency: p.priceRange.minVariantPrice.currencyCode,
          imageUrl: p.images.edges[0]?.node?.url ?? null,
          description: p.description || "",
          availableForSale: p.availableForSale,
          variants: p.variants.edges.map((e: { node: ProductResult["variants"][0] }) => e.node),
        });
      } catch {
        // Skip this product if fetch fails — don't break the whole response
      }
    })
  );

  return results;
}

/** Fetch orders from Shopify Admin API for the authenticated user */
async function fetchUserOrders(email: string): Promise<OrderResult[] | { error: string }> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

  if (!domain || !adminToken) {
    return { error: "Order lookup is temporarily unavailable." };
  }

  const url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
  const query = `
    query getOrders($query: String!) {
      orders(first: 10, query: $query, sortKey: CREATED_AT, reverse: true) {
        edges { node {
          id name createdAt
          displayFinancialStatus displayFulfillmentStatus
          totalPriceSet { shopMoney { amount currencyCode } }
          lineItems(first: 5) {
            edges { node { title quantity } }
          }
          fulfillments(first: 1) {
            trackingInfo(first: 1) { number url }
          }
        } }
      }
    }
  `;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({ query, variables: { query: `email:${email}` } }),
  });

  if (!res.ok) return { error: "Could not retrieve orders at this time." };
  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data?.data?.orders?.edges ?? []).map((e: any) => {
    const n = e.node;
    const tracking = n.fulfillments?.[0]?.trackingInfo?.[0];
    return {
      id: n.id,
      name: n.name,
      createdAt: n.createdAt,
      financialStatus: n.displayFinancialStatus,
      fulfillmentStatus: n.displayFulfillmentStatus,
      totalPrice: n.totalPriceSet?.shopMoney?.amount ?? "0",
      currency: n.totalPriceSet?.shopMoney?.currencyCode ?? "INR",
      trackingUrl: tracking?.url ?? null,
      trackingNumber: tracking?.number ?? null,
      lineItems: (n.lineItems?.edges ?? []).map((li: any) => ({
        title: li.node.title,
        quantity: li.node.quantity,
      })),
    } as OrderResult;
  });
}

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are LB Concierge, the AI shopping assistant for Lalisa Belle. Lalisa Belle is a premium imitation jewellery brand in Gurugram, India that sells earrings, necklaces, bangles, rings, and hair accessories.

You are warm, friendly, and helpful. You sound like a knowledgeable friend, not a formal assistant.

STRICT FORMATTING RULES (never break these):
- Write in plain sentences only. No bullet points, no numbered lists, no headers.
- Never use markdown like **bold**, *italic*, or # headings.
- Never use em dashes. Use commas or simple sentences instead.
- Never use colons to introduce lists. Just write naturally.
- Keep replies short. One to three sentences is ideal.
- When you need to ask for multiple things, ask them in one friendly sentence, not as a numbered list.

QUERY ROUTING RULES:
1. If someone asks about products or jewellery, call searchProducts. After it returns, write [PRODUCTS:{"handles":[...the handles...]}] and then one warm sentence about the finds.
2. If someone asks about their order, delivery, or tracking, call getMyOrders. After it returns, write a one-line friendly reply like "Here are your recent orders!" The cards will appear automatically.
3. If someone asks about returns, shipping, payments, or store policies, call getStorePolicy.
4. If someone has a complaint about a received product, collect the order number and what happened in a single casual question, then call createSupportTicket.

ABSOLUTE RULES:
- Never invent products, prices, or stock status. Only show what searchProducts returns.
- Never guess order status. Always call getMyOrders.
- Never confirm a ticket was raised unless createSupportTicket succeeded.
- If the user is not signed in and asks about orders or tickets, say: Please sign in to your account to see your orders.
- All prices are in Indian Rupees.`;

// ─── Tool Factory ─────────────────────────────────────────────────────────────

function createTools(
  ctx: ActionCtx,
  userEmail: string | null,
  tokenIdentifier: string | null,
  captureOrders: (orders: OrderResult[]) => void,
) {
  /**
   * Semantic product search using HF embeddings → Convex vector DB → Shopify live data.
   * Hard price filtering is enforced in application code, never by the LLM.
   */
  const searchProducts = tool(
    async ({ query, category, maxPrice, minPrice }) => {
      try {
        // Build rich embedding text
        const embedText = [query, category].filter(Boolean).join(" ");
        const embedding = await generateQueryEmbedding(embedText);

        // Vector search in Convex (with optional hard price filter at index level)
        const vectorResults = await ctx.runQuery(internal.products.vectorSearch, {
          embedding,
          limit: 10,
          maxPrice: maxPrice ?? undefined,
        });

        if (vectorResults.length === 0) {
          return JSON.stringify({ products: [], message: "No matching products found." });
        }

        // Fetch live Shopify data for the top matches
        const handles = vectorResults.map((r) => r.handle);
        const liveProducts = await fetchShopifyProductsByHandles(handles);

        // Final application-level hard filters (safety net)
        let filtered = liveProducts;
        if (maxPrice !== undefined) {
          filtered = filtered.filter((p) => p.price <= maxPrice);
        }
        if (minPrice !== undefined) {
          filtered = filtered.filter((p) => p.price >= minPrice);
        }
        if (category) {
          const cat = category.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(cat) ||
              p.handle.toLowerCase().includes(cat)
          );
          // If category filter is too strict, fall back to full results
          if (filtered.length === 0) filtered = liveProducts.slice(0, 6);
        }

        const top = filtered.slice(0, 6);
        const handles2 = top.map((p) => p.handle);

        return JSON.stringify({
          products: top.map((p) => ({
            handle: p.handle,
            title: p.title,
            price: p.price,
            currency: p.currency,
            available: p.availableForSale,
          })),
          // Special marker — frontend parses this to render product cards
          marker: `[PRODUCTS:${JSON.stringify({ handles: handles2 })}]`,
        });
      } catch (err) {
        console.error("[concierge.searchProducts] error:", err);
        return JSON.stringify({ error: "Product search is temporarily unavailable. Please try browsing our shop." });
      }
    },
    {
      name: "searchProducts",
      description:
        "Search for jewellery products semantically. Use this for any product-finding request. Extract category (earrings/necklaces/bangles/rings/hair accessories), max/min price if mentioned, and a descriptive query.",
      schema: z.object({
        query: z.string().describe("Descriptive search query e.g. 'elegant oxidized earrings for wedding'"),
        category: z.string().optional().describe("Jewellery category: earrings, necklaces, bangles, rings, hair accessories"),
        maxPrice: z.number().optional().describe("Maximum price in INR"),
        minPrice: z.number().optional().describe("Minimum price in INR"),
      }),
    }
  );

  /** FAQ / store policy lookup */
  const getStorePolicy = tool(
    async ({ question }) => {
      const results = searchKnowledge(question);
      if (results.length === 0) {
        return JSON.stringify({
          found: false,
          message: "No specific policy found. Direct user to WhatsApp 9211770999 or support@lalisabelle.com",
        });
      }
      return JSON.stringify({
        found: true,
        policies: results.map((r) => ({ topic: r.topic, content: r.content })),
      });
    },
    {
      name: "getStorePolicy",
      description:
        "Look up Lalisa Belle store policies and FAQs. Use for questions about shipping, returns, exchanges, payments, jewellery care, store location, or contact info.",
      schema: z.object({
        question: z.string().describe("The user's question about store policy"),
      }),
    }
  );

  /** Fetch authenticated user's orders from Shopify Admin API */
  const getMyOrders = tool(
    async () => {
      if (!userEmail) {
        return JSON.stringify({
          error: "User not signed in",
          message: "Please sign in to your account to view your orders.",
        });
      }
      const orders = await fetchUserOrders(userEmail);
      if ('error' in orders) return JSON.stringify(orders);
      if (orders.length === 0) {
        return JSON.stringify({ message: "No orders found for this account." });
      }
      // Capture orders reliably via closure — no regex parsing needed
      captureOrders(orders);
      return JSON.stringify({
        success: true,
        count: orders.length,
        // Give the LLM a short plain-text summary to reference in its reply
        summary: orders
          .map(o => `${o.name} placed on ${new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, status ${o.fulfillmentStatus}, total Rs ${o.totalPrice}`)
          .join(' | '),
      });
    },
    {
      name: "getMyOrders",
      description:
        "Retrieve the signed-in user's recent orders from Shopify including tracking info. Use for ANY query about orders, delivery status, tracking, or order history.",
      schema: z.object({}),
    }
  );

  /** Create a support ticket + generate WhatsApp escalation link */
  const createSupportTicket = tool(
    async ({ issueType, description, relatedOrderId }) => {
      if (!userEmail || !tokenIdentifier) {
        return JSON.stringify({
          error: "User not signed in",
          message: "Please sign in to raise a support ticket.",
        });
      }

      // Generate a short ticket reference
      const ticketRef = `LB-${Date.now().toString(36).toUpperCase().slice(-4)}`;

      try {
        await ctx.runMutation(internal.tickets.createTicket, {
          ticketRef,
          clerkUserId: tokenIdentifier,
          userEmail,
          userName: userEmail.split("@")[0], // best effort name
          subject: `${issueType}: ${description.slice(0, 80)}`,
          description,
          issueType,
          relatedOrderId: relatedOrderId ?? undefined,
          status: "open",
        });

        // Build pre-filled WhatsApp message
        const waText = [
          `🎫 Support Ticket ${ticketRef}`,
          `Issue: ${issueType}`,
          relatedOrderId ? `Order: ${relatedOrderId}` : null,
          `Details: ${description}`,
          `From: ${userEmail}`,
        ]
          .filter(Boolean)
          .join("\n");

        const whatsappUrl = `https://wa.me/919211770999?text=${encodeURIComponent(waText)}`;

        return JSON.stringify({
          success: true,
          ticketRef,
          whatsappUrl,
          message: `Ticket ${ticketRef} created successfully.`,
        });
      } catch (err) {
        console.error("[concierge.createSupportTicket] DB error:", err);
        return JSON.stringify({
          success: false,
          error: "Failed to create ticket",
          fallback: "Please contact us directly on WhatsApp 9211770999 or email support@lalisabelle.com",
        });
      }
    },
    {
      name: "createSupportTicket",
      description:
        "Create a formal support ticket for complaints requiring human attention: damaged product, wrong product, missing product, refund dispute, payment issues. Collect all needed details first.",
      schema: z.object({
        issueType: z
          .enum(["damaged", "wrong_product", "missing", "refund", "payment", "cancellation", "other"])
          .describe("Type of issue"),
        description: z
          .string()
          .describe("Clear description of the issue including what happened"),
        relatedOrderId: z
          .string()
          .optional()
          .describe("Shopify order ID or order name (e.g. #1234) if known"),
      }),
    }
  );

  return [searchProducts, getStorePolicy, getMyOrders, createSupportTicket];
}

// ─── Parse structured data from agent response ────────────────────────────────

function extractProductHandles(messages: BaseMessage[]): string[] | null {
  for (const msg of [...messages].reverse()) {
    const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
    const match = content.match(/\[PRODUCTS:(\{.*?\})\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed.handles)) return parsed.handles;
      } catch {
        // ignore parse errors
      }
    }
  }
  return null;
}

function extractOrders(messages: BaseMessage[]): OrderResult[] | null {
  for (const msg of [...messages].reverse()) {
    const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
    // Match [ORDERS:{...}] marker anywhere in the content
    const match = content.match(/\[ORDERS:(\{[\s\S]*?\})\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed.orders)) return parsed.orders;
      } catch {
        // ignore
      }
    }
    // Also check for raw tool result JSON with orders array
    try {
      const parsed = JSON.parse(content);
      if (parsed.marker && typeof parsed.marker === 'string') {
        const innerMatch = parsed.marker.match(/\[ORDERS:(\{[\s\S]*?\})\]/);
        if (innerMatch) {
          const inner = JSON.parse(innerMatch[1]);
          if (Array.isArray(inner.orders)) return inner.orders;
        }
      }
    } catch {
      // ignore
    }
  }
  return null;
}

function extractTicketResult(messages: BaseMessage[]): TicketResult | null {
  for (const msg of [...messages].reverse()) {
    const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
    try {
      // Look for tool results that contain ticketRef
      if (content.includes('"ticketRef"') && content.includes('"whatsappUrl"')) {
        const parsed = JSON.parse(content);
        if (parsed.success && parsed.ticketRef && parsed.whatsappUrl) {
          return { ticketRef: parsed.ticketRef, whatsappUrl: parsed.whatsappUrl };
        }
      }
    } catch {
      // continue
    }
  }
  return null;
}

// ─── Intent Router ────────────────────────────────────────────────────────────
// Handles clear-cut queries directly without burning LLM tokens.

const ORDER_INTENT = /\b(my order|my orders|order status|order history|where is my|track|tracking|delivery|shipped|dispatch)\b/i;
const POLICY_INTENT = /\b(return|refund|exchange|shipping time|how long|payment|cod|cash on delivery|care|tarnish|warranty|location|address|contact|whatsapp|email)\b/i;
const COMPLAINT_INTENT = /\b(complaint|complain|damaged|broken|wrong product|missing|not received|defective|problem with my)\b/i;
const GREETING_INTENT = /^\s*(hi|hello|hey|hii|good morning|good evening|what can you do|help)\s*[!?.]*\s*$/i;

type Intent = 'orders' | 'policy' | 'complaint' | 'greeting' | 'llm';

function detectIntent(message: string): Intent {
  if (GREETING_INTENT.test(message)) return 'greeting';
  if (ORDER_INTENT.test(message)) return 'orders';
  if (COMPLAINT_INTENT.test(message)) return 'complaint';
  if (POLICY_INTENT.test(message)) return 'policy';
  return 'llm';
}

// ─── Exported Convex Action ───────────────────────────────────────────────────

export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args): Promise<ConciergeResponse> => {
    const identity = await ctx.auth.getUserIdentity();
    const userEmail = identity?.email ?? null;
    const tokenIdentifier = identity?.tokenIdentifier ?? null;

    const lastMsg = args.messages[args.messages.length - 1]?.content ?? "";
    const intent = detectIntent(lastMsg);

    // ── Greeting: instant, no API ────────────────────────────────────────────
    if (intent === 'greeting') {
      return {
        reply: "Hi! I'm LB Concierge, your personal jewellery assistant. I can help you find jewellery, check your orders, answer policy questions, or raise a support request. What can I do for you?",
      };
    }

    // ── Orders: fetch directly, zero LLM tokens ──────────────────────────────
    if (intent === 'orders') {
      if (!userEmail) {
        return { reply: "Please sign in to your account first so I can pull up your orders." };
      }
      try {
        const orders = await fetchUserOrders(userEmail);
        if ('error' in orders) {
          return { reply: "I couldn't fetch your orders right now. Please try again or check your profile page directly." };
        }
        if (orders.length === 0) {
          return { reply: "You haven't placed any orders yet. Browse our collection and find something you love!" };
        }
        return {
          reply: `Here are your ${orders.length} recent orders! Tap Track Order on any card to follow your delivery.`,
          orders,
        };
      } catch {
        return { reply: "Something went wrong. Please try again or visit your profile page." };
      }
    }

    // ── Policy: keyword lookup, zero LLM tokens ──────────────────────────────
    if (intent === 'policy') {
      const results = searchKnowledge(lastMsg);
      if (results.length > 0) {
        return { reply: results[0].content };
      }
      return {
        reply: "For any policy questions you can reach us on WhatsApp at 9211770999 or email support@lalisabelle.com and we'll get back to you quickly.",
      };
    }

    // ── Products / Complaints / Complex: use LLM ─────────────────────────────
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return { reply: "LB Concierge is not fully set up yet. Please contact support." };
    }

    const model = new ChatGroq({
      model: "qwen/qwen3.8-27b",
      apiKey,
      maxTokens: 512,   // Free tier OTPM limit is 1000 — stay well under it
      temperature: 0.3,
    });

    let capturedOrders: OrderResult[] | null = null;
    const tools = createTools(ctx, userEmail, tokenIdentifier, (o) => { capturedOrders = o; });

    const agent = createReactAgent({
      llm: model,
      tools,
      stateModifier: SYSTEM_PROMPT,
    });

    // Cap at last 8 messages to keep context small
    const recentMessages = args.messages.slice(-8);
    const lcMessages = recentMessages.map((m) =>
      m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
    );

    let result: { messages: BaseMessage[] };
    try {
      result = await agent.invoke({ messages: lcMessages });
    } catch (err) {
      console.error("[concierge.chat] Agent error:", err);
      return {
        reply: "I'm having a bit of trouble right now. Please try again, or reach us on WhatsApp at 9211770999.",
      };
    }

    const lastAgentMessage = result.messages[result.messages.length - 1];
    let reply =
      typeof lastAgentMessage.content === "string"
        ? lastAgentMessage.content
        : JSON.stringify(lastAgentMessage.content);

    // Strip markers and markdown
    reply = reply
      .replace(/\[PRODUCTS:\{.*?\}\]/gs, "")
      .replace(/\[ORDERS:\{[\s\S]*?\}\]/gs, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/ — /g, ", ")
      .trim();

    const productHandles = extractProductHandles(result.messages);
    const ticket = extractTicketResult(result.messages);
    const orders = capturedOrders ?? undefined;

    let products: ProductResult[] | undefined;
    if (productHandles && productHandles.length > 0) {
      try {
        products = await fetchShopifyProductsByHandles(productHandles);
      } catch {
        // Products fetch failed, reply still goes through
      }
    }

    return { reply, products, orders, ticket: ticket ?? undefined };
  },
});

