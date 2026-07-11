import { sanitizeInput, sanitizeFilename, isValidUrl } from "@/lib/security/sanitize";

describe("security/sanitize", () => {
  describe("sanitizeInput", () => {
    it("returns empty string for null/undefined/non-string", () => {
      expect(sanitizeInput(null as unknown as string)).toBe("");
      expect(sanitizeInput(undefined as unknown as string)).toBe("");
      expect(sanitizeInput(123 as unknown as string)).toBe("");
    });

    it("removes angle brackets", () => {
      expect(sanitizeInput("<script>alert('xss')</script>")).toBe(
        "scriptalert('xss')/script"
      );
    });

    it("trims whitespace", () => {
      expect(sanitizeInput("  hello world  ")).toBe("hello world");
    });

    it("truncates to 10000 chars", () => {
      const long = "a".repeat(10001);
      expect(sanitizeInput(long).length).toBe(10000);
    });
  });

  describe("sanitizeFilename", () => {
    it("returns 'file' for null/undefined/non-string", () => {
      expect(sanitizeFilename(null as unknown as string)).toBe("file");
      expect(sanitizeFilename(undefined as unknown as string)).toBe("file");
    });

    it("removes path traversal sequences", () => {
      expect(sanitizeFilename("../../etc/passwd")).toBe("__etc_passwd");
    });

    it("replaces special chars with underscores", () => {
      expect(sanitizeFilename("my file@name!.docx")).toBe("my_file_name_.docx");
    });

    it("truncates to 255 chars", () => {
      const long = "a".repeat(256);
      expect(sanitizeFilename(long).length).toBe(255);
    });
  });

  describe("isValidUrl", () => {
    it("returns true for valid http/https URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://example.com/path")).toBe(true);
    });

    it("returns false for invalid protocols", () => {
      expect(isValidUrl("ftp://example.com")).toBe(false);
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
      expect(isValidUrl("not-a-url")).toBe(false);
    });
  });
});
