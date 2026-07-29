import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, alt = "", className, ...imgProps } = props;
    return (
      <img
        alt={alt as string}
        className={className as string}
        {...imgProps}
        data-fill={fill}
      />
    );
  },
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: (string | boolean | undefined | null)[]) =>
    args.filter(Boolean).join(" "),
}));

import { Avatar } from "@/components/Shared/Avatar";

describe("Avatar", () => {
  describe("with image", () => {
    it("renders an img element when image prop is provided", () => {
      render(
        <Avatar image="/avatar.png" name="John Doe" />
      );

      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/avatar.png");
    });

    it("uses name as alt text", () => {
      render(<Avatar image="/pic.jpg" name="Jane" />);
      expect(screen.getByAltText("Jane")).toBeInTheDocument();
    });

    it("uses empty alt when name is not provided", () => {
      render(<Avatar image="/pic.jpg" />);
      expect(screen.getByAltText("")).toBeInTheDocument();
    });

    it("applies size classes to image", () => {
      const { container } = render(
        <Avatar image="/pic.jpg" name="A" size="lg" />
      );
      const img = container.querySelector("img");
      expect(img?.className).toContain("w-11");
    });

    it("resolves image from user object", () => {
      render(<Avatar user={{ name: "User", image: "/user.jpg" }} />);
      expect(screen.getByAltText("User")).toBeInTheDocument();
    });
  });

  describe("without image (initials fallback)", () => {
    it("renders first letter of name as initial", () => {
      render(<Avatar name="Alice" />);
      expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("renders two-letter initials when twoLetterInitials is true", () => {
      render(<Avatar name="John Doe" twoLetterInitials />);
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("renders '?' when name is not provided", () => {
      render(<Avatar />);
      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("resolves name from user object", () => {
      render(<Avatar user={{ name: "Bob" }} />);
      expect(screen.getByText("B")).toBeInTheDocument();
    });

    it("prefers name prop over user.name", () => {
      render(<Avatar name="Direct" user={{ name: "User" }} />);
      expect(screen.getByText("D")).toBeInTheDocument();
    });
  });

  describe("size variants", () => {
    it("renders sm size", () => {
      const { container } = render(<Avatar name="A" size="sm" />);
      const span = container.querySelector("span");
      expect(span?.className).toContain("w-7");
      expect(span?.className).toContain("text-xs");
    });

    it("renders md (default) size", () => {
      const { container } = render(<Avatar name="A" />);
      const span = container.querySelector("span");
      expect(span?.className).toContain("w-9");
      expect(span?.className).toContain("text-sm");
    });

    it("renders lg size", () => {
      const { container } = render(<Avatar name="A" size="lg" />);
      const span = container.querySelector("span");
      expect(span?.className).toContain("w-11");
      expect(span?.className).toContain("text-base");
    });
  });

  describe("color variants", () => {
    it("applies hash color (default variant)", () => {
      const { container } = render(
        <Avatar name="TestUser" />
      );
      const span = container.querySelector("span");
      // Hash variant should have one of the hash color classes
      const hasHashColor = /bg-(rose|orange|amber|emerald|cyan|blue|violet|fuchsia|pink|teal)-500/.test(
        span?.className ?? ""
      );
      expect(hasHashColor).toBe(true);
    });

    it("applies muted variant styles", () => {
      const { container } = render(
        <Avatar name="Test" variant="muted" />
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("bg-muted");
      expect(span?.className).toContain("border");
    });

    it("applies gray variant styles", () => {
      const { container } = render(
        <Avatar name="Test" variant="gray" />
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("bg-gray-200");
    });

    it("uses custom color when provided", () => {
      const { container } = render(
        <Avatar name="Test" color="#ff0000" />
      );
      const span = container.querySelector("span");
      expect(span?.style.backgroundColor).toBe("rgb(255, 0, 0)");
    });
  });

  describe("className prop", () => {
    it("applies custom className to the root element", () => {
      const { container } = render(
        <Avatar name="Test" className="my-custom-class" />
      );
      const span = container.querySelector("span");
      expect(span?.className).toContain("my-custom-class");
    });
  });

  describe("hashColor function", () => {
    it("deterministically maps same name to same color", () => {
      const { container: c1 } = render(<Avatar name="Consistent" />);
      const { container: c2 } = render(<Avatar name="Consistent" />);
      expect(c1.querySelector("span")?.className).toBe(
        c2.querySelector("span")?.className
      );
    });

    it("different names may get different colors", () => {
      const { container: c1 } = render(<Avatar name="Alpha" />);
      const { container: c2 } = render(<Avatar name="Beta" />);
      // At least ensure both render without error
      expect(c1.querySelector("span")).toBeInTheDocument();
      expect(c2.querySelector("span")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles null name gracefully", () => {
      render(<Avatar name={null} />);
      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("handles null image gracefully", () => {
      render(<Avatar image={null} name="Test" />);
      expect(screen.getByText("T")).toBeInTheDocument();
    });

    it("handles null user properties gracefully", () => {
      render(<Avatar user={{ name: null, image: null }} />);
      expect(screen.getByText("?")).toBeInTheDocument();
    });

    it("renders ring-2 on non-muted variants", () => {
      const { container } = render(<Avatar name="A" variant="hash" />);
      expect(container.querySelector("span")?.className).toContain("ring-2");
    });

    it("renders ring-2 when image is provided", () => {
      const { container } = render(<Avatar image="/img.jpg" name="A" />);
      expect(container.querySelector("img")?.className).toContain("ring-2");
    });
  });
});
