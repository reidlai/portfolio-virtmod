import pino from "pino";

/**
 * Shared logger instance for the portfolio module
 *
 * Configuration:
 * - Development: Uses pino-pretty for human-readable output
 * - Production: Uses JSON logging for structured logs
 * - Log level: Configurable via LOG_LEVEL env var (default: 'info')
 */
const isBrowser = typeof process === "undefined";
const logLevel =
  !isBrowser && process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info";
const isProduction = !isBrowser && process.env.NODE_ENV === "production";

export const logger = pino({
  name: "portfolio",
  level: logLevel,
  // Only use pino-pretty in Node.js development environment
  transport:
    !isBrowser && !isProduction
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});
