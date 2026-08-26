import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-8">
      <div className="max-w-lg text-center">
        <h1 className="mb-6 text-5xl font-light">
          Payment Cancelled
        </h1>

        <p className="mb-10 text-gray-600 leading-8">
          Your payment was cancelled.
          <br />
          Your items are still available if you would like to try again.
        </p>

        <Link
          href="/checkout"
          className="inline-block bg-black px-10 py-4 uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
        >
          Return to Checkout
        </Link>
      </div>
    </main>
  );
}