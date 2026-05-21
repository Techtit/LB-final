/**
 * A console-safe logging utility that redacts sensitive stack traces in production
 * while providing detailed logs in development.
 */

const isProd = import.meta.env.PROD;

export const logger = {
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    if (isProd) {
      // In production, we log a generic message without exposing raw stack traces
      // We could also send this to a service like Sentry here
      console.error(`[Lalisa Belle Error]: ${message}`, context ? { context } : '');
    } else {
      // In development, log full details
      console.error(`[Lalisa Belle Error]: ${message}`, error, context);
    }
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(`[Lalisa Belle Warn]: ${message}`, context || '');
  },
  info: (message: string, context?: Record<string, unknown>) => {
    if (!isProd) {
      console.info(`[Lalisa Belle Info]: ${message}`, context || '');
    }
  }
};
