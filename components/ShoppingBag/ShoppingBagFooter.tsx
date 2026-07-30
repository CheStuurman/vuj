"use client";

import { useCart } from "@/context/CartContext";

interface ShoppingBagFooterProps {
  onCheckout?: () => void;
}

export default function ShoppingBagFooter({
  onCheckout,
}: ShoppingBagFooterProps) {
  const {
    subtotal,
    cart,
    closeBag,
  } = useCart();

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <footer className="border-t border-neutral-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between text-sm">
        <span className="uppercase tracking-[0.2em] text-neutral-500">
          Items
        </span>

        <span>{totalItems}</span>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <span className="text-sm uppercase tracking-[0.2em]">
          Subtotal
        </span>

        <span className="text-lg font-medium">
          R {subtotal.toFixed(2)}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="mb-3 w-full bg-black px-6 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
      >
        Checkout
      </button>

      <button
        type="button"
        onClick={closeBag}
        className="w-full border border-black px-6 py-4 text-sm uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
      >
        Continue Shopping
      </button>
    </footer>
  );
}