import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FilePreviewModal } from "@/components/Dashboard/Storage/Files/FilePreviewModal";

vi.mock("lucide-react", () => {
  const icon = (name: string) => {
    const C = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`icon-${name}`} {...props} />;
    C.displayName = name;
    return C;
  };
  return { Download: icon("Download") };
});

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}));

vi.mock("@/hooks/useFileManagement", () => ({
  FileWithDetails: {},
}));

vi.mock("@/components/Dashboard/Storage/Files/FilePreviewModalHeader", () => ({
  default: ({ file, onClose }: Record<string, unknown>) => (
    <div data-testid="modal-header">
      <span>{file.originalName}</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const baseFile = {
  id: "f1",
  originalName: "test-file.txt",
  mimeType: "text/plain",
  url: "https://example.com/file.txt",
  size: 1024,
  project: null,
  task: null,
};

describe("FilePreviewModal", () => {
  it("renders the modal with file name in header", () => {
    render(<FilePreviewModal file={baseFile as any as Record<string, unknown>} onClose={vi.fn()} />);
    expect(screen.getByText("test-file.txt")).toBeInTheDocument();
  });

  it("shows fallback for unsupported file types", () => {
    render(<FilePreviewModal file={baseFile as any as Record<string, unknown>} onClose={vi.fn()} />);
    expect(screen.getByText("Preview not available for this file type")).toBeInTheDocument();
    expect(screen.getByText("Download File")).toBeInTheDocument();
  });

  it("renders image preview for image mime types", () => {
    const imageFile = { ...baseFile, mimeType: "image/png", originalName: "photo.png" };
    render(<FilePreviewModal file={imageFile as any as Record<string, unknown>} onClose={vi.fn()} />);
    const img = screen.getByRole("img", { name: "photo.png" });
    expect(img).toBeInTheDocument();
  });

  it("renders audio preview for audio mime types", () => {
    const audioFile = { ...baseFile, mimeType: "audio/mp3", originalName: "sound.mp3" };
    render(<FilePreviewModal file={audioFile as any as Record<string, unknown>} onClose={vi.fn()} />);
    expect(screen.getByText("Your browser does not support audio playback.")).toBeInTheDocument();
  });
});
