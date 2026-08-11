"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useCart } from "../context/CartContext";
import { useTransition } from "../context/TransitionContext";
import HeroList from "../components/home/HeroList";
import {
  getProducts,
  Product,
} from "../lib/services/products";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cart, openBag } = useCart();
  const { navigate, hideOverlay } = useTransition();

  const mainRef = useRef<HTMLElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function animateScroll(target: number) {
    if (!mainRef.current) return;

    const main = mainRef.current;

    const start = main.scrollTop;
    const distance = target - start;

    const duration = 1500;

    let startTime: number | null = null;

    function easeInOutCubic(t: number) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime: number) {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const eased = easeInOutCubic(progress);

      if (mainRef.current) {
        mainRef.current.scrollTop =
          start + distance * eased;
      }

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  /*
   * Wait until the Hero images have actually
   * loaded/decoded before revealing the page.
   */
  useEffect(() => {
    if (loading || !products.length) {
      return;
    }

    let cancelled = false;

    async function revealHome() {
      /*
       * Wait for the browser to render the
       * HeroList into the DOM.
       */
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });

      if (cancelled) return;

      const images = Array.from(
        document.querySelectorAll(
          "main img"
        )
      ) as HTMLImageElement[];

      /*
       * Wait for all currently rendered images
       * to finish decoding.
       */
      await Promise.all(
        images.map(async (image) => {
          if (image.complete) {
            try {
              await image.decode();
            } catch {
              // Ignore decode errors.
            }

            return;
          }

          await new Promise<void>((resolve) => {
            image.addEventListener(
              "load",
              () => resolve(),
              { once: true }
            );

            image.addEventListener(
              "error",
              () => resolve(),
              { once: true }
            );
          });
        })
      );

      if (cancelled) return;

      /*
       * If Home was opened with ?view=shop,
       * position the page first.
       */
      if (searchParams.get("view") === "shop") {
        const secondHero =
          document.querySelector(
            '[data-hero="1"]'
          ) as HTMLElement | null;

        if (secondHero) {
          const target =
            secondHero.offsetTop -
            window.innerHeight * 0.18;

          /*
           * Set the position immediately while
           * the white overlay is still covering us.
           */
          if (mainRef.current) {
            mainRef.current.scrollTop = target;
          }
        }
      } else {
        /*
         * Normal Home navigation should start
         * at the very top.
         */
        if (mainRef.current) {
          mainRef.current.scrollTop = 0;
        }
      }

      /*
       * Only reveal Home after the hero is ready
       * and the scroll position is correct.
       */
      requestAnimationFrame(() => {
        if (!cancelled) {
          hideOverlay();
        }
      });
    }

    revealHome();

    return () => {
      cancelled = true;
    };
  }, [
    loading,
    products.length,
    searchParams,
    hideOverlay,
  ]);

  function scrollHome() {
    router.replace("/");

    animateScroll(0);
  }

  function scrollToShop() {
    const main = mainRef.current;

    if (!main) return;

    const secondHero =
      document.querySelector(
        '[data-hero="1"]'
      ) as HTMLElement | null;

    if (!secondHero) return;

    const target =
      secondHero.offsetTop -
      window.innerHeight * 0.18;

    router.replace("/?view=shop");

    animateScroll(target);
  }

  function handleProductClick(slug: string) {
    navigate(`/shop/${slug}`);
  }

  return (
    <main
      ref={mainRef}
      className="relative h-screen overflow-y-auto bg-white"
    >
      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-10 py-8">
        <button
          type="button"
          onClick={scrollHome}
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

        <nav className="flex items-center gap-10 text-sm uppercase tracking-[0.25em] text-white">
          <button
            type="button"
            onClick={scrollHome}
            className="uppercase tracking-[0.25em]"
          >
            Home
          </button>

          <button
            type="button"
            onClick={scrollToShop}
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

      {loading ? (
        <section
          aria-hidden="true"
          className="h-screen bg-white"
        />
      ) : (
        <HeroList
          products={products}
          onProductClick={handleProductClick}
        />
      )}
    </main>
  );
}