// lib/limiter.ts
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class InMemoryRateLimiter {
  private store: RateLimitStore = {};
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 5, windowMinutes: number = 1) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMinutes * 60 * 1000;

    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  async limit(identifier: string): Promise<{ success: boolean }> {
    const now = Date.now();
    const entry = this.store[identifier];

    // If no entry or expired, create new
    if (!entry || now > entry.resetTime) {
      this.store[identifier] = {
        count: 1,
        resetTime: now + this.windowMs,
      };
      return { success: true };
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return { success: false };
    }

    // Increment count
    entry.count++;
    return { success: true };
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}

// Export based on environment
export const limiter =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? await createUpstashLimiter()
    : new InMemoryRateLimiter(5, 1);

async function createUpstashLimiter() {
  const { Ratelimit } = await import("@upstash/ratelimit");
  const { Redis } = await import("@upstash/redis");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}