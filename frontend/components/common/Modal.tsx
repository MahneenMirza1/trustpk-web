"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = "",
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-desc" : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={[
          "relative z-10 w-full rounded-2xl border border-surface-border bg-white p-6 shadow-elevated transition-all sm:p-8",
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-xl p-2 text-ink-subtle transition hover:bg-page hover:text-navy focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <X className="h-5 w-5" />
        </button>

        {title ? (
          <div className="mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-navy sm:text-2xl">
              {title}
            </h2>
            {description ? (
              <p id="modal-desc" className="mt-1 text-sm text-ink-muted">
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}
