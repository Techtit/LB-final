import { ErrorBoundary } from "react-error-boundary";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface RouteErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const RouteErrorFallback = ({ error, resetErrorBoundary }: RouteErrorFallbackProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center min-h-[60vh]">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-muted-foreground opacity-50" />
      </div>
      <h2 className="text-2xl font-serif font-medium mb-3">Something went wrong here</h2>
      <p className="text-muted-foreground font-sans text-sm max-w-md mb-8">
        We couldn't load this page correctly. Please try again.
      </p>
      <div className="flex gap-4">
        <Button onClick={resetErrorBoundary} variant="outline" className="font-sans">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button onClick={() => window.location.href = '/'} className="font-sans">
          Return Home
        </Button>
      </div>
    </div>
  );
};

export const RouteErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary 
      FallbackComponent={RouteErrorFallback}
      onError={(error, info) => {
        logger.error("Route Rendering Error", error, { componentStack: info?.componentStack });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
