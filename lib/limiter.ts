
export interface RateLimitResult {
  success: boolean;
  reset?: number;
  remaining?: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

class DevRateLimiter implements RateLimiter {
  private store = new Map<
    string,
    { count: number; resetAt: number }
  >();

  constructor(
    private max = 5,
    private windowMs = 60_000
  ) {}

  async limit(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      this.store.set(key, {
        count: 1,
        resetAt: now + this.windowMs,
      });

      return {
        success: true,
        remaining: this.max - 1,
        reset: now + this.windowMs,
      };
    }

    if (entry.count >= this.max) {
      return {
        success: false,
        remaining: 0,
        reset: entry.resetAt,
      };
    }

    entry.count += 1;
    this.store.set(key, entry);

    return {
      success: true,
      remaining: this.max - entry.count,
      reset: entry.resetAt,
    };
  }
}

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

class UpstashRateLimiter implements RateLimiter {
  private ratelimit: Ratelimit;

  constructor() {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    this.ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      prefix: "focura:rl",
      analytics: true,
    });
  }

  async limit(key: string): Promise<RateLimitResult> {
    const result = await this.ratelimit.limit(key);

    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  }
}

export const limiter: RateLimiter =
  process.env.NODE_ENV === "production"
    ? new UpstashRateLimiter()
    : new DevRateLimiter(5, 60_000);
