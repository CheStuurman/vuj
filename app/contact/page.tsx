import Image from "next/image";
import Link from "next/link";
import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400"],
});

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-black px-10 py-8">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="VÚJ"
            width={110}
            height={40}
            priority
          />
        </Link>

        <nav className="flex items-center gap-10 text-xs uppercase tracking-[0.3em]">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      {/* Contact */}
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