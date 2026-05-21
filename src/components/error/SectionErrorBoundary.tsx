import { ErrorBoundary } from "react-error-boundary";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const SectionErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-6 text-center bg-muted/20 border border-border/50 rounded-xl my-4">
      <AlertTriangle className="w-6 h-6 text-muted-foreground mb-3 opacity-60" />
      <p className="text-sm font-sans text-muted-foreground mb-4">
        This section couldn't be loaded.
      </p>
      <Button onClick={resetErrorBoundary} variant="outline" size="sm" className="font-sans text-xs">
        Retry Section
      </Button>
    </div>
  );
};

export const SectionErrorBoundary = ({ children, sectionName = "Unknown" }: { children: React.ReactNode, sectionName?: string }) => {
  return (
    <ErrorBoundary 
      FallbackComponent={SectionErrorFallback}
      onError={(error, info) => {
        logger.error(`Section Error (${sectionName})`, error, { componentStack: info?.componentStack });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
