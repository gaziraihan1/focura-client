import { cn } from "@/lib/utils";

describe("lib/utils", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes with clsx", () => {
    const active = true;
    const inactive = false;
    expect(cn("base", active && "active", inactive && "inactive")).toBe("base active");
  });

  it("merges conflicting tailwind classes with tailwind-merge", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles array inputs", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("handles undefined/null inputs", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});
