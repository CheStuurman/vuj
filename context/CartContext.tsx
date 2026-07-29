"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  increaseQuantity: (id: string, size: string) => void;
  decreaseQuantity: (id: string, size: string) => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((current) => {
      const existing = current.find(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existing) {
        return current.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...current, item];
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCart((current) =>
      current.filter((i) => !(i.id === id && i.size === size))
    );
  };

  const increaseQuantity = (id: string, size: string) => {
    setCart((current) =>
      current.map((i) =>
        i.id === id && i.size === size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  const decreaseQuantity = (id: string, size: string) => {
    setCart((current) =>
      current.flatMap((i) => {
        if (i.id !== id || i.size !== size) return [i];
        if (i.quantity === 1) return [];
        return [{ ...i, quantity: i.quantity - 1 }];
      })
    );
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
