export default {
  providers: [
    {
      // Clerk issuer domain — decoded from the publishable key
      // Set CLERK_JWT_ISSUER_URL in your Convex environment variables
      domain: process.env.CLERK_JWT_ISSUER_URL,
      applicationID: "convex",
    },
  ],
};
