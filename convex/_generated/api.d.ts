/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as concierge from "../concierge.js";
import type * as crons from "../crons.js";
import type * as knowledge from "../knowledge.js";
import type * as productSync from "../productSync.js";
import type * as products from "../products.js";
import type * as profile from "../profile.js";
import type * as shopify from "../shopify.js";
import type * as tickets from "../tickets.js";
import type * as wishlist from "../wishlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  concierge: typeof concierge;
  crons: typeof crons;
  knowledge: typeof knowledge;
  productSync: typeof productSync;
  products: typeof products;
  profile: typeof profile;
  shopify: typeof shopify;
  tickets: typeof tickets;
  wishlist: typeof wishlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
