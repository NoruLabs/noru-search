"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "lg",
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-[95vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[5vh] sm:pt-[10vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-2xl border border-border bg-bg-primary shadow-2xl animate-fade-in`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold text-text-primary">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Close button when no title */}
        {!title && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-bg-card/80 text-text-muted backdrop-blur transition-colors hover:text-text-primary"
          >
            <X size={16} />
          </button>
        )}

        {/* Body */}
        <div className={title ? "p-6" : "p-0"}>{children}</div>
      </div>
    </div>
  );
}
