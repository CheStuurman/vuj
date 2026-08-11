"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";

import { useCart } from "../../context/CartContext";
import { useTransition } from "../../context/TransitionContext";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400"],
});

export default function ContactPage() {
  const { cart, openBag } = useCart();
  const { navigate, hideOverlay } = useTransition();

  // Contact page has loaded.
  // Tell the transition system to reveal it.
  useEffect(() => {
    hideOverlay();
  }, [hideOverlay]);

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="flex items-center justify-between border-b px-10 py-8">
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

        <nav className="flex items-center gap-10 text-sm uppercase tracking-[0.25em]">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="uppercase tracking-[0.25em]"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => navigate("/?view=shop")}
            className="uppercase tracking-[0.25em]"
          >
            Shop
          </button>

          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="uppercase tracking-[0.25em]"
          >
            Contact
          </button>

          <button
            type="button"
            onClick={openBag}
            className="uppercase tracking-[0.25em]"
          >
            BAG {String(totalItems).padStart(2, "0")}
          </button>
        </nav>
      </header>

      <section className="flex justify-center pt-20">
        <div className="text-center">
          <h1 className="mb-5 text-[1.75rem] font-extralight uppercase tracking-[0.22em]">
            Contact
          </h1>

          <p className="mb-3 text-xs uppercase tracking-[0.3em]">
            Tel
          </p>

          <a
            href="tel:+27725820953"
            className={`${libreBaskerville.className} text-xl tracking-[0.08em] transition-opacity duration-300 hover:opacity-60`}
          >
            +27&nbsp;72&nbsp;582&nbsp;09&nbsp;53
          </a>
        </div>
      </section>
    </main>
  );
}