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
