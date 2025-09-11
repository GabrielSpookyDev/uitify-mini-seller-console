import React, { useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type SlideOverProps = {
  title: React.ReactNode;
  open: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export default function SlideOver({
  title,
  open,
  onClose,
  footer,
  children,
}: Readonly<SlideOverProps>) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(open);

  // Handle render state for animations
  useEffect(() => {
    if (open) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus panel when opened
  useEffect(() => {
    if (open && panelRef.current) {
      const timer = setTimeout(() => panelRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-50",
        // keep events disabled when closed, but still render for transition
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* Panel */}
      <div
        className={[
          "absolute inset-y-0 right-0 w-full max-w-md",
          // animation
          "transform-gpu transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-modal="true"
        aria-labelledby="slideover-title"
      >
        <Card
          ref={panelRef}
          tabIndex={-1}
          rounded="rounded-l-2xl"
          className="flex h-full flex-col outline-none"
        >
          <div className="flex items-start justify-between border-b border-zinc-200 px-4 py-3">
            <div
              id="slideover-title"
              className="text-base font-semibold text-zinc-900"
            >
              {title}
            </div>
            <Button variant="ghost" onClick={onClose} aria-label="Close panel">
              ✕
            </Button>
          </div>

          <div className="flex-1 overflow-auto px-4 py-3">{children}</div>

          {footer && (
            <div className="border-t border-zinc-200 px-4 py-3">
              <div className="flex items-center justify-end gap-2">
                {footer}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
