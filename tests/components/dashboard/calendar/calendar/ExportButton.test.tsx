import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React, { createRef } from "react";

// ─── Mocks ─────────────────────────────────────────────────────────────────

// Use vi.hoisted() so values are available before hoisted vi.mock() calls
const { mockAddImage, mockSave, mockGetWidth, MockJsPDF } = vi.hoisted(() => {
  const _mockAddImage = vi.fn();
  const _mockSave = vi.fn();
  const _mockGetWidth = vi.fn().mockReturnValue(800);
  const _MockJsPDF = vi.fn(function () {
    return {
      addImage: _mockAddImage,
      save: _mockSave,
      internal: { pageSize: { getWidth: _mockGetWidth } },
    };
  });
  return {
    mockAddImage: _mockAddImage,
    mockSave: _mockSave,
    mockGetWidth: _mockGetWidth,
    MockJsPDF: _MockJsPDF,
  };
});

// Mock html-to-image
vi.mock("html-to-image", () => ({
  toPng: vi.fn().mockResolvedValue("data:image/png;base64,fakebase64data"),
}));

// Mock jspdf
vi.mock("jspdf", () => ({ jsPDF: MockJsPDF }));

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid={`${name}-icon`} {...props} />
    );
    Component.displayName = name;
    return Component;
  };
  return {
    Download: icon("Download"),
    Image: icon("Image"),
    FileText: icon("FileText"),
    Loader2: icon("Loader2"),
  };
});

import { ExportButton } from "@/components/dashboard/calendar/ExportButton";
import { toPng } from "html-to-image";

describe("ExportButton", () => {
  const chartRef = createRef<HTMLDivElement>();

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up a real div in the ref
    chartRef.current = document.createElement("div");
    chartRef.current.innerHTML = "<span>Chart content</span>";
    // Prevent jsdom from attempting a real navigation/download on anchor.click()
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });

  afterEach(() => {
    chartRef.current = null;
    vi.restoreAllMocks();
  });

  it("renders the download button", () => {
    render(<ExportButton chartRef={chartRef} />);
    expect(screen.getByLabelText("Export chart")).toBeInTheDocument();
  });

  it("renders the Download icon", () => {
    render(<ExportButton chartRef={chartRef} />);
    expect(screen.getByTestId("Download-icon")).toBeInTheDocument();
  });

  it("shows label text when showLabel is true", () => {
    render(<ExportButton chartRef={chartRef} showLabel />);
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("does not show label when showLabel is false", () => {
    render(<ExportButton chartRef={chartRef} />);
    expect(screen.queryByText("Export")).not.toBeInTheDocument();
  });

  it("opens dropdown on click", () => {
    render(<ExportButton chartRef={chartRef} />);
    fireEvent.click(screen.getByLabelText("Export chart"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Download as PNG")).toBeInTheDocument();
    expect(screen.getByText("Download as PDF")).toBeInTheDocument();
  });

  it("closes dropdown on second click", () => {
    render(<ExportButton chartRef={chartRef} />);
    const btn = screen.getByLabelText("Export chart");

    fireEvent.click(btn);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(btn);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes dropdown on outside click", () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ExportButton chartRef={chartRef} />
      </div>,
    );

    fireEvent.click(screen.getByLabelText("Export chart"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("sets aria-expanded when dropdown is open", () => {
    render(<ExportButton chartRef={chartRef} />);
    const btn = screen.getByLabelText("Export chart");

    expect(btn).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("sets aria-haspopup attribute", () => {
    render(<ExportButton chartRef={chartRef} />);
    expect(screen.getByLabelText("Export chart")).toHaveAttribute(
      "aria-haspopup",
      "menu",
    );
  });

  it("calls toPng on PNG export", async () => {
    render(<ExportButton chartRef={chartRef} />);
    fireEvent.click(screen.getByLabelText("Export chart"));

    await act(async () => {
      fireEvent.click(screen.getByText("Download as PNG"));
      // captureElement waits 50ms before calling toPng, keep the test inside act
      // until the export settles so no state updates leak past the test's end.
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(toPng).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      }),
    );
  });

  it("calls toPng and jsPDF on PDF export", async () => {
    render(<ExportButton chartRef={chartRef} />);
    fireEvent.click(screen.getByLabelText("Export chart"));

    await act(async () => {
      fireEvent.click(screen.getByText("Download as PDF"));
      // Let the 50ms capture delay and follow-up work settle inside act.
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(toPng).toHaveBeenCalled();
    expect(MockJsPDF).toHaveBeenCalledWith("landscape", "px", expect.any(Array));
    expect(mockAddImage).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledWith(expect.stringContaining(".pdf"));
  });

  it("handles null chartRef gracefully", async () => {
    const nullRef = createRef<HTMLDivElement>();
    render(<ExportButton chartRef={nullRef} />);
    fireEvent.click(screen.getByLabelText("Export chart"));

    await act(async () => {
      fireEvent.click(screen.getByText("Download as PNG"));
    });

    expect(toPng).not.toHaveBeenCalled();
  });

  it("shows loading spinner during PNG export", async () => {
    vi.mocked(toPng).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve("data:image/png;base64,abc"), 300),
        ),
    );

    render(<ExportButton chartRef={chartRef} />);
    fireEvent.click(screen.getByLabelText("Export chart"));

    await act(async () => {
      fireEvent.click(screen.getByText("Download as PNG"));
    });

    // Button should be disabled during export
    const trigger = screen.getByLabelText("Export chart");
    expect(trigger).toBeDisabled();

    // Wait for the export to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    // Button should be enabled again
    expect(screen.getByLabelText("Export chart")).not.toBeDisabled();
  });

  it("closes dropdown after export", async () => {
    render(<ExportButton chartRef={chartRef} />);
    fireEvent.click(screen.getByLabelText("Export chart"));

    await act(async () => {
      fireEvent.click(screen.getByText("Download as PNG"));
      // Wait for the export flow (50ms capture delay included) to fully finish.
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("renders with custom filename", () => {
    render(
      <ExportButton chartRef={chartRef} filename="my-custom-chart" />,
    );
    fireEvent.click(screen.getByLabelText("Export chart"));
    expect(screen.getByText("Download as PNG")).toBeInTheDocument();
    expect(screen.getByText("Download as PDF")).toBeInTheDocument();
  });
});
