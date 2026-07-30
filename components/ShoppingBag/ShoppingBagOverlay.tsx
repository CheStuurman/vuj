"use client";

interface ShoppingBagOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingBagOverlay({
  isOpen,
  onClose,
}: ShoppingBagOverlayProps) {
  return (
    <div
      onClick={onClose}
      aria-hidden={!isOpen}
      className={`
        fixed inset-0 z-40
        bg-black/40
        transition-opacity duration-300 ease-out
        ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
    />
  );
}