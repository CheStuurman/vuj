"use client";

import Image from "next/image";

import { Product } from "../../lib/services/products";
import { useTransition } from "@/context/TransitionContext";

interface HeroSectionProps {
  product: Product;
  onProductClick?: (slug: string) => void;
}

export default function HeroSection({
  product,
}: HeroSectionProps) {
  const { navigate } = useTransition();

  function handleClick() {
    navigate(`/shop/${product.slug}`);
  }

  return (
    <section
      data-snap
      className="relative h-screen w-full overflow-hidden"
    >
      <Image
        src={product.image_url}
        alt={product.name}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute bottom-20 left-10 z-10 max-w-xl text-white">
        <h1 className="text-6xl font-light leading-none md:text-8xl">
          {product.name}
        </h1>

        <p className="mt-6 text-xl md:text-2xl">
          R {product.price.toLocaleString()}
        </p>

        <button
          onClick={handleClick}
          className="mt-8 inline-block border border-white px-8 py-4 uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
}