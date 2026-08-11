import { notFound } from "next/navigation";

import {
  getProducts,
} from "../../../lib/services/products";

import ProductClient from "./ProductClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const products = await getProducts();

  console.log("Products:", products);

  const currentProduct = products.find(
    (product) => product.slug === slug
  );

  console.log("Current Product:", currentProduct);

  if (!currentProduct) {
    notFound();
  }

  return (
    <ProductClient
      products={products}
      currentSlug={slug}
    />
  );
}