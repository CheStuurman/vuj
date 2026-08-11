"use client";

import Image from "next/image";

import { Product } from "../../lib/services/products";

interface Props {
  product: Product;
  isActive: boolean;
}

export default function ProductSection({
  product,
  isActive,
}: Props) {
  return (
    <section
      id={product.slug}
      className="grid min-h-screen grid-cols-1 gap-16 px-10 pb-32 pt-40 lg:grid-cols-2"
    >
      {/* Product images */}

      <div>
        <Image
          src="/AKT_1233.JPG"
          alt={product.name}
          width={900}
          height={1350}
          className="w-full"
        />

        <Image
          src="/bw2.JPG"
          alt={product.name}
          width={900}
          height={1350}
          className="w-full"
        />

        <Image
          src="/AKT_1212.JPG"
          alt={product.name}
          width={900}
          height={1350}
          className="w-full"
        />
      </div>

      {/* 
        IMPORTANT:
        There is intentionally NO product information
        on the right here anymore.

        The product information is rendered once in
        ProductClient so it can stay fixed while the
        images scroll.
      */}
    </section>
  );
}