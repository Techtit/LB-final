export default {
  providers: [
    {
      // Clerk issuer domain — decoded from the publishable key
      // For production: update to your live Clerk domain
      domain: "https://kind-tiger-44.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
