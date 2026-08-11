import HeroSection from "./HeroSection";
import { Product } from "../../lib/services/products";

interface HeroListProps {
  products: Product[];
  onProductClick: (slug: string) => void;
}

export default function HeroList({
  products,
  onProductClick,
}: HeroListProps) {
  return (
    <>
      {products.map((product, index) => (
        <div
          key={product.id}
          data-hero={index}
        >
          <HeroSection
            product={product}
            onProductClick={onProductClick}
          />
        </div>
      ))}
    </>
  );
}