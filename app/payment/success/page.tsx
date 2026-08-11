import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-8">
      <div className="max-w-lg text-center">
        <h1 className="mb-6 text-5xl font-light">
          Payment Successful
        </h1>

        <p className="mb-10 text-gray-600 leading-8">
          Thank you for shopping with VÚJ.
          <br />
          Your order has been received and is being processed.
        </p>

        <Link
          href="/"
          className="inline-block bg-black px-10 py-4 uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}