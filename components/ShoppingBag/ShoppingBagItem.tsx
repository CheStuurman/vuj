"use client";

import Image from "next/image";
import { CartItem, useCart } from "@/context/CartContext";

interface ShoppingBagItemProps {
  item: CartItem;
}

export default function ShoppingBagItem({
  item,
}: ShoppingBagItemProps) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <article className="flex gap-4 border-b border-neutral-200 px-6 py-5">
      <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide">
            {item.name}
          </h3>

          <p className="mt-1 text-sm text-neutral-500">
            Size {item.size}
          </p>

          <p className="mt-3 text-sm font-medium">
            R {item.price.toFixed(2)}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-neutral-300">
            <button
              type="button"
              onClick={() => decreaseQuantity(item.id, item.size)}
              className="px-3 py-1 transition hover:bg-neutral-100"
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span className="w-10 text-center text-sm">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => increaseQuantity(item.id, item.size)}
              className="px-3 py-1 transition hover:bg-neutral-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id, item.size)}
            className="text-xs uppercase tracking-wider text-neutral-500 transition hover:text-black"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}