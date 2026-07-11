import { qc } from "@/lib/react-query/query-client";

describe("react-query/query-client", () => {
  it("exports a QueryClient instance", () => {
    expect(qc).toBeDefined();
    expect(typeof qc.getQueryData).toBe("function");
  });

  it("uses default staleTime of 5 minutes", () => {
    const defaults = qc.getDefaultOptions().queries;
    expect(defaults?.staleTime).toBe(300_000);
  });

  it("uses gcTime of 10 minutes", () => {
    const defaults = qc.getDefaultOptions().queries;
    expect(defaults?.gcTime).toBe(600_000);
  });

  it("disables refetchOnWindowFocus by default", () => {
    const defaults = qc.getDefaultOptions().queries;
    expect(defaults?.refetchOnWindowFocus).toBe(false);
  });

  it("retries queries once by default", () => {
    const defaults = qc.getDefaultOptions().queries;
    expect(defaults?.retry).toBe(1);
  });
});
