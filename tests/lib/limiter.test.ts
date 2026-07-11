import { vi } from "vitest";
import { limitLogin } from "@/lib/limiter";

describe("limiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("allows requests under the default limit", async () => {
    const ip = "10.0.0.1";
    const email = "user@example.com";

    for (let i = 0; i < 5; i++) {
      const result = await limitLogin(ip, email);
      expect(result.success).toBe(true);
      expect(result.remaining).toBeGreaterThanOrEqual(0);
    }
  });

  it("blocks requests over the default limit", async () => {
    const ip = "10.0.0.2";
    const email = "limited@example.com";

    for (let i = 0; i < 5; i++) {
      await limitLogin(ip, email);
    }

    const blocked = await limitLogin(ip, email);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("uses a different key when email is omitted", async () => {
    const ip = "10.0.0.3";

    const result = await limitLogin(ip);
    expect(result.success).toBe(true);
  });

  it("resets after window expires", async () => {
    const ip = "10.0.0.4";
    const email = "expire@example.com";

    for (let i = 0; i < 5; i++) {
      await limitLogin(ip, email);
    }

    const blocked = await limitLogin(ip, email);
    expect(blocked.success).toBe(false);

    vi.advanceTimersByTime(61_000);

    const afterExpiry = await limitLogin(ip, email);
    expect(afterExpiry.success).toBe(true);
  });
});
