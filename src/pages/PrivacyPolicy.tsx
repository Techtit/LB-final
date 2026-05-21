import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Lalisa Belle</title>
        <meta name="description" content="Lalisa Belle Privacy Policy. Learn how we handle your data." />
      </Helmet>
      
      <div className="container py-16 md:py-24 max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none font-sans space-y-8 text-foreground/80">
          
          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">1. Introduction</h2>
            <p>
              Welcome to Lalisa Belle. We respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website 
              or make a purchase.
            </p>
            <p className="font-medium text-foreground">
              We want to be clear upfront: Lalisa Belle never sells your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">2. Information We Collect</h2>
            <p>We may collect and process the following data about you:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity Data:</strong> First name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> Billing address, shipping address, email address, and telephone numbers.</li>
              <li><strong>Financial Data:</strong> Payment card details (processed securely via our payment providers; we do not store this).</li>
              <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products you have purchased.</li>
              <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, operating system, and platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">3. How Your Information is Used</h2>
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and deliver your orders, including managing payments and refunds.</li>
              <li>Manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
              <li>Administer and protect our business and website (including troubleshooting, data analysis, and system maintenance).</li>
              <li>Deliver relevant website content and advertisements to you and measure the effectiveness of our advertising.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">4. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our service and hold certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
              However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">5. Third-Party Services</h2>
            <p>
              We employ third-party companies and individuals to facilitate our service, provide the service on our behalf, 
              perform service-related services, or assist us in analyzing how our service is used. These include:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Shopify:</strong> Our store is hosted on Shopify Inc. They provide us with the online e-commerce platform that allows us to sell our products to you.</li>
              <li><strong>Payment Providers:</strong> We use third-party services for payment processing (e.g., Stripe, PayPal). We will not store or collect your payment card details.</li>
              <li><strong>Analytics:</strong> We may use third-party Service Providers like Google Analytics to monitor and analyze the use of our service.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">6. Payment Security</h2>
            <p>
              Your payment information is handled securely. All direct payment gateways adhere to the standards set by PCI-DSS 
              as managed by the PCI Security Standards Council. PCI-DSS requirements help ensure the secure handling of credit 
              card information by our store and its service providers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">7. Your User Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The right to access, update, or delete the information we have on you.</li>
              <li>The right of rectification if your information is inaccurate or incomplete.</li>
              <li>The right to object to our processing of your personal data.</li>
              <li>The right to request that we restrict the processing of your personal information.</li>
              <li>The right to data portability.</li>
            </ul>
            <p>To exercise any of these rights, please contact us using the information below.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-foreground mb-4">8. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>By email: support@lalisabelle.com</li>
              <li>By visiting the Contact page on our website</li>
            </ul>
          </section>

        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
