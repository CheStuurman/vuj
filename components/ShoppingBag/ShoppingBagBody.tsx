"use client";

import { useCart } from "@/context/CartContext";
import ShoppingBagItem from "./ShoppingBagItem";
import EmptyBag from "./EmptyBag";

export default function ShoppingBagBody() {
  const { cart } = useCart();

  if (cart.length === 0) {
    return <EmptyBag />;
  }

  return (
    <div className="flex flex-col">
      {cart.map((item) => (
        <ShoppingBagItem
          key={`${item.id}-${item.size}`}
          item={item}
        />
      ))}
    </div>
  );
}