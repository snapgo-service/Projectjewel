"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export default function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-heading/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fade-in"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={`bg-white rounded-2xl shadow-card-hover w-full ${sizeClasses[size]} relative animate-scale-in max-h-[90vh] overflow-y-auto`}>
        <button
          type="button"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-body hover:text-heading text-xl transition-colors z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
