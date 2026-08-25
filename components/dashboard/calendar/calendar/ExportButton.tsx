"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Download, Image, FileText, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

interface ExportButtonProps {
  /** Ref to the container element to capture */
  chartRef: React.RefObject<HTMLDivElement | null>;
  /** Base filename for the exported file (without extension) */
  filename?: string;
  /** Optional label to show next to the icon */
  showLabel?: boolean;
}

type ExportFormat = "png" | "pdf";
type ExportStatus = "idle" | "exporting-png" | "exporting-pdf";

// ─── Component ─────────────────────────────────────────────────────────────

export function ExportButton({
  chartRef,
  filename = "capacity-chart",
  showLabel = false,
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ExportStatus>("idle");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const captureElement = useCallback(async (): Promise<string | null> => {
    const el = chartRef.current;
    if (!el) return null;
    try {
      // Use a short delay to let any pending re-renders settle
      await new Promise((resolve) => setTimeout(resolve, 50));
      return await toPng(el, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        style: {
          // Ensure text is captured properly
          fontFamily: "inherit",
        },
      });
    } catch {
      return null;
    }
  }, [chartRef]);

  const handleExportPNG = useCallback(async () => {
    setStatus("exporting-png");
    try {
      const dataUrl = await captureElement();
      if (!dataUrl) {
        setStatus("idle");
        setOpen(false);
        return;
      }
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setStatus("idle");
      setOpen(false);
    }
  }, [captureElement, filename]);

  const handleExportPDF = useCallback(async () => {
    setStatus("exporting-pdf");
    try {
      const dataUrl = await captureElement();
      if (!dataUrl) {
        setStatus("idle");
        setOpen(false);
        return;
      }
      const imgWidth = 800;
      const imgHeight = (dataUrl.length / (imgWidth * 4)) * 2; // approximate
      const pdf = new jsPDF("landscape", "px", [imgWidth, Math.max(imgHeight, 400)]);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgHeight / imgWidth) * pdfWidth;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } finally {
      setStatus("idle");
      setOpen(false);
    }
  }, [captureElement, filename]);

  const isExporting = status !== "idle";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isExporting) setOpen(!open);
        }}
        disabled={isExporting}
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors",
          "text-muted-foreground hover:text-foreground hover:bg-accent/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
        aria-label="Export chart"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {isExporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        {showLabel && (
          <span>{isExporting ? "Exporting…" : "Export"}</span>
        )}
      </button>

      {/* Dropdown menu */}
      {open && !isExporting && (
        <div
          className={cn(
            "absolute right-0 top-full mt-1 z-50 min-w-40",
            "rounded-lg border border-border bg-popover shadow-lg",
            "py-1",
          )}
          role="menu"
          aria-label="Export options"
        >
          <button
            type="button"
            onClick={handleExportPNG}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors"
            role="menuitem"
          >
            <Image className="w-3.5 h-3.5 text-muted-foreground"  />
            Download as PNG
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-accent transition-colors"
            role="menuitem"
          >
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}
