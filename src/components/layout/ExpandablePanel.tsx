"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandablePanelProps {
  children: React.ReactNode;
  title: string;
  className?: string;
  expandedClassName?: string;
}

export default function ExpandablePanel({
  children,
  title,
  className,
  expandedClassName,
}: ExpandablePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mount animation: when modal opens, trigger visibility after a frame
  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 200);
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  return (
    <>
      {/* Compact card */}
      <div
        className={cn(
          "group relative cursor-pointer rounded-xl border border-[#0f1a2e] bg-[#0a0f1c] transition hover:border-[#1a2e4a]",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        {/* Expand icon hint */}
        <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
        </div>
        {children}
      </div>

      {/* Modal overlay via portal */}
      {isOpen &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            onClick={handleBackdropClick}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal content */}
            <div
              className={cn(
                "relative w-[90vw] max-w-[1400px] max-h-[90vh] overflow-y-auto rounded-xl border border-[#1a2e4a] bg-[#0a0f1c] shadow-2xl transition-transform duration-200",
                isVisible ? "scale-100" : "scale-95",
                expandedClassName
              )}
            >
              {/* Sticky header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#0f1a2e] bg-[#0a0f1c]/95 px-6 py-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  {title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#1a2e4a] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Panel content */}
              <div className="p-6">{children}</div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
