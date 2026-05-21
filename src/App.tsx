import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import { useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import { AppErrorBoundary } from "@/components/error/AppErrorBoundary";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "@/components/ScrollToTop";

// Code-split route components — each page becomes its own chunk
const Index = lazy(() => import("./pages/Index"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Auth = lazy(() => import("./pages/Auth"));
const About = lazy(() => import("./pages/About"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const Contact = lazy(() => import("./pages/Contact"));
const Profile = lazy(() => import("./pages/Profile"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

// Higher order component to wrap routes with the boundary
const withRouteBoundary = (Component: React.ComponentType) => (
  <RouteErrorBoundary>
    <Component />
  </RouteErrorBoundary>
);

const AppContent = () => {
  useCartSync();
  const { isSignedIn } = useAuth();

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={withRouteBoundary(Index)} />
            <Route path="/shop" element={withRouteBoundary(Shop)} />
            <Route path="/product/:handle" element={withRouteBoundary(ProductDetail)} />
            <Route path="/wishlist" element={withRouteBoundary(Wishlist)} />
            <Route path="/auth" element={isSignedIn ? <Navigate to="/" replace /> : withRouteBoundary(Auth)} />
            <Route path="/about" element={withRouteBoundary(About)} />
            <Route path="/shipping-policy" element={withRouteBoundary(ShippingPolicy)} />
            <Route path="/return-policy" element={withRouteBoundary(ReturnPolicy)} />
            <Route path="/privacy-policy" element={withRouteBoundary(PrivacyPolicy)} />
            <Route path="/contact" element={withRouteBoundary(Contact)} />
            <Route path="/profile" element={withRouteBoundary(Profile)} />
            <Route path="*" element={withRouteBoundary(NotFound)} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

const App = () => (
  <AppErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </AppErrorBoundary>
);

export default App;
