"use client";

import { useState } from "react";
import Image from "next/image";

import { useCart } from "../../context/CartContext";
import { useTransition } from "../../context/TransitionContext";

export default function CheckoutPage() {
  const { cart, openBag, subtotal } = useCart();
  const { navigate } = useTransition();

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  async function continueToPayment(e: React.FormEvent) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your bag is empty.");
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          subtotal,
          items: cart.map((item) => ({
            productId: item.id,
            productName: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Order creation failed:", data);
        alert(data.error ?? "Unable to create order.");
        return;
      }

      sessionStorage.setItem(
        "checkout",
        JSON.stringify({
          firstName,
          lastName,
          email,
        })
      );

      navigate(`/payment?order=${data.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to create your order.");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="relative border-b border-neutral-200 bg-white">
        <div className="relative mx-auto flex h-32 items-center px-10 pt-2">
          <div className="absolute left-1/2 -translate-x-1/2">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Home"
            >
              <Image
                src="/logo.png"
                alt="VÚJ"
                width={110}
                height={40}
                priority
              />
            </button>
          </div>

          <nav className="ml-auto flex items-center gap-8 text-sm uppercase tracking-[0.25em]">
            <button
              type="button"
              onClick={() => navigate("/")}
            >
              HOME
            </button>

            <button
              type="button"
              onClick={() => navigate("/?view=shop")}
            >
              SHOP
            </button>

            <button
              type="button"
              onClick={() => navigate("/contact")}
            >
              CONTACT
            </button>

            <button
              type="button"
              onClick={openBag}
            >
              BAG {String(totalItems).padStart(2, "0")}
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-8 py-20">
        <h1 className="mb-12 text-4xl font-light">
          Checkout
        </h1>

        <form
          onSubmit={continueToPayment}
          className="space-y-8"
        >
          <div>
            <label className="mb-2 block uppercase tracking-[0.2em] text-xs">
              First Name
            </label>

            <input
              required
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              className="w-full border border-neutral-300 p-4 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block uppercase tracking-[0.2em] text-xs">
              Last Name
            </label>

            <input
              required
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              className="w-full border border-neutral-300 p-4 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block uppercase tracking-[0.2em] text-xs">
              Email
            </label>

            <input
              required
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border border-neutral-300 p-4 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black py-5 text-white transition hover:bg-neutral-800"
          >
            CONTINUE TO PAYMENT
          </button>
        </form>
      </div>
    </main>
  );
}