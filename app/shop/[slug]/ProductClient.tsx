"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Product } from "../../../lib/services/products";
import { useCart } from "../../../context/CartContext";
import { useTransition } from "@/context/TransitionContext";

import ProductSection from "../../../components/product/ProductSection";

interface Props {
  products: Product[];
  currentSlug: string;
}

export default function ProductClient({
  products,
  currentSlug,
}: Props) {
  const { cart, addToCart, openBag } = useCart();
  const { navigate, hideOverlay } = useTransition();

  const [activeSlug, setActiveSlug] =
    useState(currentSlug);

  const [selectedSize, setSelectedSize] =
    useState("");

  /*
   * This is the product whose
   * name / price / description
   * is currently being displayed.
   */
  const [displayedProduct, setDisplayedProduct] =
    useState<Product | undefined>(
      products.find(
        (product) =>
          product.slug === currentSlug
      ) ?? products[0]
    );

  /*
   * Controls the fade of the
   * entire product information block.
   */
  const [productInfoVisible, setProductInfoVisible] =
    useState(true);

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /*
   * Product currently in the center
   * of the screen.
   */
  const activeProduct =
    products.find(
      (product) =>
        product.slug === activeSlug
    ) ?? products[0];

  /*
   * Reveal the page after navigation.
   */
  useEffect(() => {
    hideOverlay();
  }, [hideOverlay]);

  /*
   * Keep active product synchronized
   * with the URL.
   */
  useEffect(() => {
    setActiveSlug(currentSlug);
  }, [currentSlug]);

  /*
   * Fade the entire product information
   * block out, change the product, then
   * fade the new product back in.
   */
  useEffect(() => {
    if (!activeProduct) return;

    /*
     * Nothing to change if this is
     * already the displayed product.
     */
    if (
      displayedProduct?.slug ===
      activeProduct.slug
    ) {
      return;
    }

    /*
     * Start fading the current
     * product information out.
     */
    setProductInfoVisible(false);

    /*
     * Wait for the fade-out to progress
     * before replacing the content.
     */
    const timeout = setTimeout(() => {
      setDisplayedProduct(activeProduct);

      /*
       * Fade the new product in.
       */
      requestAnimationFrame(() => {
        setProductInfoVisible(true);
      });
    }, 750);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    activeProduct,
    displayedProduct?.slug,
  ]);

  /*
   * Scroll to the product specified
   * by the URL.
   */
  useEffect(() => {
    const section =
      document.getElementById(currentSlug);

    if (!section) return;

    const timeout = setTimeout(() => {
      const headerOffset = 160;

      const sectionTop =
        section.getBoundingClientRect().top +
        window.scrollY;

      window.scrollTo({
        top: sectionTop - headerOffset,
        behavior: "auto",
      });
    }, 50);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentSlug]);

  /*
   * Detect which product is currently
   * being viewed.
   */
  useEffect(() => {
    if (!products.length) return;

    const sections: HTMLElement[] = [];

    for (const product of products) {
      const section =
        document.getElementById(product.slug);

      if (section) {
        sections.push(section);
      }
    }

    if (!sections.length) return;

    const updateActiveProduct = () => {
      const viewportCenter =
        window.innerHeight / 2;

      let closestSection: HTMLElement | null =
        null;

      let closestDistance = Infinity;

      for (const section of sections) {
        const rect =
          section.getBoundingClientRect();

        const sectionCenter =
          rect.top + rect.height / 2;

        const distance = Math.abs(
          sectionCenter - viewportCenter
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      }

      if (!closestSection) return;

      const slug = closestSection.id;

      if (!slug) return;

      setActiveSlug((previousSlug) => {
        if (previousSlug === slug) {
          return previousSlug;
        }

        return slug;
      });

      const currentPath =
        window.location.pathname;

      const nextPath = `/shop/${slug}`;

      if (currentPath !== nextPath) {
        window.history.replaceState(
          null,
          "",
          nextPath
        );
      }
    };

    updateActiveProduct();

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        updateActiveProduct();
        ticking = false;
      });
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateActiveProduct
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        updateActiveProduct
      );
    };
  }, [products]);

  /*
   * Reset selected size when changing
   * products.
   */
  useEffect(() => {
    setSelectedSize("");
  }, [activeSlug]);

  /*
   * Add active product to bag.
   */
  const handleAddToBag = () => {
    if (!activeProduct) return;

    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    addToCart({
      id: activeProduct.id,
      slug: activeProduct.slug,
      name: activeProduct.name,
      price: activeProduct.price,
      image: activeProduct.image_url,
      size: selectedSize,
      quantity: 1,
    });

    openBag();
  };

  return (
    <main>
      {/* ================================================== */}
      {/* HEADER                                             */}
      {/* ================================================== */}

      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-10 py-8">
        {/* Logo */}

        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Home"
          className="relative h-20 w-32"
        >
          <Image
            src="/logo.png"
            alt="VÚJ"
            width={110}
            height={40}
            priority
          />
        </button>

        {/* Navigation */}

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
            BAG (
            {String(totalItems).padStart(2, "0")}
            )
          </button>
        </nav>
      </header>

      {/* ================================================== */}
      {/* PRODUCT IMAGES                                     */}
      {/* ================================================== */}

      {products.map((product) => (
        <ProductSection
          key={product.id}
          product={product}
          isActive={
            activeSlug === product.slug
          }
        />
      ))}

      {/* ================================================== */}
      {/* FIXED PRODUCT NAME + PRICE + DESCRIPTION           */}
      {/* ================================================== */}

      {displayedProduct && (
        <div
          className="
            fixed
            left-[calc(50%+1rem)]
            right-10
            top-40
            z-40
          "
        >
          {/* ============================================== */}
          {/* ALL THREE FADE TOGETHER                        */}
          {/* ============================================== */}

          <div
            className={`
              transition-opacity
              duration-[1500ms]
              ease-in-out
              ${
                productInfoVisible
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          >
            {/* Product name */}

            <h1 className="text-5xl font-light">
              {displayedProduct.name}
            </h1>

            {/* Price */}

            <p className="mt-6 text-2xl">
              R
              {displayedProduct.price.toLocaleString()}
            </p>

            {/* Description */}

            <p className="mt-10 max-w-3xl leading-8 text-gray-600">
              {displayedProduct.description}
            </p>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* FIXED SIZE + ADD TO BAG                            */}
      {/* ================================================== */}

      {activeProduct && (
        <div
          className="
            fixed
            left-[calc(50%+1rem)]
            right-10
            top-[450px]
            z-40
          "
        >
          {/* Size */}

          <h3 className="mb-4 text-sm uppercase tracking-[0.2em]">
            Size
          </h3>

          <div className="flex gap-4">
            {["6", "8", "10", "12"].map(
              (size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    setSelectedSize(size)
                  }
                  className={`
                    h-14
                    w-14
                    border
                    transition
                    ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-white hover:bg-black hover:text-white"
                    }
                  `}
                >
                  {size}
                </button>
              )
            )}
          </div>

          {/* Add to Bag */}

          <button
            type="button"
            onClick={handleAddToBag}
            className="
              mt-12
              w-full
              bg-black
              py-5
              text-white
              uppercase
              tracking-[0.25em]
              transition
              hover:bg-gray-800
            "
          >
            Add to Bag
          </button>
        </div>
      )}
    </main>
  );
}