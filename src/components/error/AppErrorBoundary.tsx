import { ErrorBoundary } from "react-error-boundary";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";

const AppErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-serif font-medium tracking-tight">We're temporarily unavailable</h1>
        <p className="text-muted-foreground font-sans text-sm leading-relaxed">
          We're experiencing a technical issue with Lalisa Belle. Our team has been notified. 
          Please try refreshing the page or check back in a few minutes.
        </p>
        <div className="pt-4">
          <Button onClick={resetErrorBoundary} size="lg" className="font-sans font-medium rounded-full px-8">
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export const AppErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary 
      FallbackComponent={AppErrorFallback} 
      onReset={() => window.location.reload()}
      onError={(error, info) => {
        logger.error("Fatal Application Error", error, { componentStack: info?.componentStack });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
