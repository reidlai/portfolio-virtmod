import pino from "pino";

/**
 * Shared logger instance for the portfolio module
 * Consistent with the pattern used in other modules.
 */
const logLevel = "info"; // Default to info, could be environment-driven

export const logger = pino({
  name: "portfolio",
  level: logLevel,
  browser: {
    asObject: true,
  },
});
