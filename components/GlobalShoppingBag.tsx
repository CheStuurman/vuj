"use client";

import ShoppingBag from "@/components/ShoppingBag/ShoppingBag";
import ShoppingBagBody from "@/components/ShoppingBag/ShoppingBagBody";
import ShoppingBagFooter from "@/components/ShoppingBag/ShoppingBagFooter";

import { useCart } from "@/context/CartContext";

export default function GlobalShoppingBag() {
  const {
    cart,
    isBagOpen,
    closeBag,
  } = useCart();

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <ShoppingBag
      isOpen={isBagOpen}
      onClose={closeBag}
      itemCount={totalItems}
    >
      <ShoppingBagBody />
      <ShoppingBagFooter />
    </ShoppingBag>
  );
}