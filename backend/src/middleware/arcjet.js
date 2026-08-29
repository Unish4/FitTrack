import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ENV } from "../config/env.js";

const globalLimiter = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 100,
      interval: 60,
      capacity: 100,
    }),
  ],
});

// Global rate limit middleware
export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await globalLimiter.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          success: false,
          error: "Too many requests. Please try again later.",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          success: false,
          error: "Bot traffic not allowed.",
        });
      }

      return res.status(403).json({
        success: false,
        error: "Access denied.",
      });
    }

    if (decision.isErrored()) {
      console.error("Arcjet evaluation error:", decision.reason);
      return res.status(500).json({
        success: false,
        error: "Security verification failed. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet error:", error);
    return res.status(500).json({
      success: false,
      error: "Security verification failed. Please try again later.",
    });
  }
};

const loginLimiter = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 60,
      capacity: 5,
    }),
  ],
});

// Login rate limit middleware
export const loginRateLimit = async (req, res, next) => {
  try {
    const decision = await loginLimiter.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      return res.status(429).json({
        success: false,
        error: "Too many login attempts. Try again in a minute.",
      });
    }

    if (decision.isErrored()) {
      console.error("Arcjet evaluation error:", decision.reason);
      return res.status(500).json({
        success: false,
        error: "Security verification failed. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet error:", error);
    return res.status(500).json({
      success: false,
      error: "Security verification failed. Please try again later.",
    });
  }
};
