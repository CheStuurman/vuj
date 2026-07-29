"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { cart } = useCart();

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Navigation */}

      <header className="absolute top-0 left-0 z-20 w-full px-10 py-8 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="VÚJ"
            width={110}
            height={40}
            priority
          />
        </Link>

        <nav className="flex items-center gap-10 uppercase tracking-[0.25em] text-sm text-white">
          <Link href="/shop">Shop</Link>

          <Link href="/contact">Contact</Link>

          <Link href="/bag">
            BAG ({totalItems})
          </Link>
        </nav>
      </header>

      {/* Hero Image */}

      <div className="relative h-screen w-full">
        <Image
          src="/AKT_1233.JPG"
          alt="Waist Cut Out Dress"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Hero Text */}

      <section className="absolute bottom-16 left-10 z-20 text-white">
        <h1 className="text-6xl md:text-8xl leading-none font-light">
          WAIST
          <br />
          CUT OUT
          <br />
          DRESS
        </h1>

        <p className="mt-6 text-2xl">R1 890</p>

        <Link
          href="/shop"
          className="inline-block mt-8 border border-white px-8 py-4 uppercase tracking-[0.2em] hover:bg-white hover:text-black transition"
        >
          SHOP NOW
        </Link>
      </section>
    </main>
  );
}