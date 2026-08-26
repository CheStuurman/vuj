"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, size: string) => void;
  increaseQuantity: (id: number, size: string) => void;
  decreaseQuantity: (id: number, size: string) => void;

  subtotal: number;

  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;

  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("vuj-cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "vuj-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const openBag = () => setIsBagOpen(true);

  const closeBag = () => setIsBagOpen(false);

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("vuj-cart");
  };

  const addToCart = (item: CartItem) => {
    setCart((current) => {
      const existing = current.find(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existing) {
        return current.map((i) =>
          i.id === item.id && i.size === item.size
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i
        );
      }

      return [...current, item];
    });
  };

  const removeFromCart = (
    id: number,
    size: string
  ) => {
    setCart((current) =>
      current.filter(
        (i) => !(i.id === id && i.size === size)
      )
    );
  };

  const increaseQuantity = (
    id: number,
    size: string
  ) => {
    setCart((current) =>
      current.map((i) =>
        i.id === id && i.size === size
          ? {
              ...i,
              quantity: i.quantity + 1,
            }
          : i
      )
    );
  };

  const decreaseQuantity = (
    id: number,
    size: string
  ) => {
    setCart((current) =>
      current.flatMap((i) => {
        if (i.id !== id || i.size !== size) {
          return [i];
        }

        if (i.quantity === 1) {
          return [];
        }

        return [
          {
            ...i,
            quantity: i.quantity - 1,
          },
        ];
      })
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
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
        isBagOpen,
        openBag,
        closeBag,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
}