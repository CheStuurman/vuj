"use client";

import { ReactNode, useEffect } from "react";
import ShoppingBagOverlay from "./ShoppingBagOverlay";
import ShoppingBagHeader from "./ShoppingBagHeader";

interface ShoppingBagProps {
  isOpen: boolean;
  onClose: () => void;
  itemCount: number;
  children?: ReactNode;
}

export default function ShoppingBag({
  isOpen,
  onClose,
  itemCount,
  children,
}: ShoppingBagProps) {
  // Close with ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lock page scrolling
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <ShoppingBagOverlay isOpen={isOpen} onClose={onClose} />

      <aside
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-50 flex h-screen w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ShoppingBagHeader
          itemCount={itemCount}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </aside>
    </>
  );
}