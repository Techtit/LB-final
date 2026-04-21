import { action } from "./_generated/server";
import { v } from "convex/values";

const SHOPIFY_API_VERSION = "2025-07";

/**
 * Proxy action for Shopify Storefront API requests.
 * Credentials are stored in Convex environment variables:
 *   - SHOPIFY_STORE_DOMAIN
 *   - SHOPIFY_STOREFRONT_ACCESS_TOKEN
 *
 * This keeps the Storefront Access Token server-side (never shipped to the browser).
 */
export const storefrontProxy = action({
  args: {
    query: v.string(),
    variables: v.string(), // JSON-stringified variables
  },
  handler: async (_ctx, args) => {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      throw new Error(
        "Missing Shopify credentials. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in your Convex environment variables."
      );
    }

    const url = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: args.query,
        variables: JSON.parse(args.variables),
      }),
    });

    const status = response.status;

    if (!response.ok) {
      // Return the error status so the client can handle specific codes (e.g. 402)
      return JSON.stringify({ _proxyError: true, status });
    }

    const data = await response.json();
    return JSON.stringify(data);
  },
});

export const getCustomerOrders = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to getCustomerOrders");
    }

    const email = identity.email;
    if (!email) {
      throw new Error("User has no email associated with their account");
    }

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

    if (!domain || !adminToken) {
      console.warn("Missing Shopify Admin API token. Returning empty orders for now.");
      return JSON.stringify({ data: { orders: { edges: [] } } });
    }

    const url = `https://${domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
    
    // Shopify Admin GraphQL query to fetch orders by email
    const query = `
      query getCustomerOrders($query: String!) {
        orders(first: 20, query: $query, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              displayFinancialStatus
              displayFulfillmentStatus
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              fulfillments(first: 5) {
                status
                trackingInfo {
                  number
                  url
                  company
                }
              }
              lineItems(first: 20) {
                edges {
                  node {
                    id
                    title
                    variantTitle
                    quantity
                    image {
                      url
                      altText
                    }
                  }
                }
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
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          query: `email:${email}`,
        },
      }),
    });

    if (!response.ok) {
      console.error("Failed to fetch from Shopify admin", await response.text());
      return JSON.stringify({ data: { orders: { edges: [] } } });
    }

    const data = await response.json();
    return JSON.stringify(data);
  },
});
