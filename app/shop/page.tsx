"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("");

  const { cart, addToCart } = useCart();

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    addToCart({
      id: "waist-cut-out-dress",
      name: "Waist Cut Out Dress",
      price: 1890,
      image: "/AKT_1233.JPG",
      size: selectedSize,
      quantity: 1,
    });
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}

      <header className="flex items-center justify-between px-10 py-8 border-b">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="VÚJ"
            width={110}
            height={40}
            priority
          />
        </Link>

        <nav className="flex items-center gap-10 uppercase tracking-[0.25em] text-sm">
          <Link href="/">Home</Link>

          <Link href="/shop">Shop</Link>

          <Link href="/contact">Contact</Link>

          <button className="uppercase tracking-[0.25em]">
            BAG ({totalItems})
          </button>
        </nav>
      </header>

      {/* Product */}

      <section className="max-w-7xl mx-auto px-10 py-20 grid lg:grid-cols-2 gap-20">
        {/* Images */}

        <div className="space-y-8">
          <Image
            src="/AKT_1233.JPG"
            alt="Waist Cut Out Dress Front"
            width={900}
            height={1350}
            className="w-full"
          />

          <Image
            src="/bw2.JPG"
            alt="Waist Cut Out Dress Side"
            width={900}
            height={1350}
            className="w-full"
          />

          <Image
            src="/AKT_1212.JPG"
            alt="Waist Cut Out Dress Back"
            width={900}
            height={1350}
            className="w-full"
          />
        </div>

        {/* Product Details */}

        <div className="sticky top-20 h-fit">
          <h1 className="text-5xl font-light">
            Waist Cut Out Dress
          </h1>

          <p className="mt-6 text-2xl">
            R1 890
          </p>

          <p className="mt-10 leading-8 text-gray-600">
            Sculptural tailoring meets effortless elegance.
            <br />
            Designed and handcrafted in Cape Town using premium fabrics.
            <br />
            The Waist Cut Out Dress celebrates clean lines,
            refined proportions and timeless femininity.
          </p>

          {/* Sizes */}

          <div className="mt-12">
            <h3 className="uppercase tracking-[0.2em] text-sm mb-4">
              Size
            </h3>

            <div className="flex gap-4">
              {["6", "8", "10", "12"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-5 py-3 transition ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "hover:bg-black hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag */}

          <button
            onClick={handleAddToBag}
            className="mt-12 w-full bg-black text-white py-5 uppercase tracking-[0.25em] hover:bg-gray-800 transition"
          >
            Add to Bag
          </button>
        </div>
      </section>
    </main>
  );
}