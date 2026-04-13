import { createRoot } from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { useCallback, useMemo } from "react";
import App from "./App.tsx";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

/**
 * Bridges Clerk auth into Convex so that ctx.auth.getUserIdentity() works
 * in all Convex functions.
 *
 * SETUP REQUIRED: Create a JWT template named "convex" in the Clerk Dashboard
 *   → JWT Templates → New Template → Name: "convex", Audience: "convex"
 */
function useConvexAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        const token = await getToken({
          template: "convex",
          skipCache: forceRefreshToken,
        });
        return token ?? null;
      } catch {
        return null;
      }
    },
    [getToken]
  );

  return useMemo(
    () => ({
      isLoading: !isLoaded,
      isAuthenticated: isSignedIn ?? false,
      fetchAccessToken,
    }),
    [isLoaded, isSignedIn, fetchAccessToken]
  );
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}>
    <ConvexProviderWithAuth client={convex} useAuth={useConvexAuth}>
      <App />
    </ConvexProviderWithAuth>
  </ClerkProvider>
);
