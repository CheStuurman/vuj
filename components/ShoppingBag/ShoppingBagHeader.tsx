"use client";

interface ShoppingBagHeaderProps {
  itemCount: number;
  onClose: () => void;
}

export default function ShoppingBagHeader({
  itemCount,
  onClose,
}: ShoppingBagHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
      <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-black">
        Bag ({itemCount})
      </h2>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close shopping bag"
        className="text-2xl leading-none text-black transition-opacity hover:opacity-60"
      >
        ×
      </button>
    </header>
  );
}