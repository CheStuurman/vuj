"use client";

import {
  Suspense,
  useEffect,
} from "react";
import { useSearchParams } from "next/navigation";

function PaymentContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    async function startCheckout() {
      const orderId = searchParams.get("order");

      if (!orderId) {
        alert("Missing order.");
        return;
      }

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.error ?? "Unable to start payment.");
          return;
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.gateway;

        Object.entries(data.fields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } catch (error) {
        console.error(error);
        alert("Unable to connect to payment gateway.");
      }
    }

    startCheckout();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-light">
          Redirecting to secure payment...
        </h1>

        <p className="text-gray-500">
          Please wait while we prepare your checkout.
        </p>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentContent />
    </Suspense>
  );
}