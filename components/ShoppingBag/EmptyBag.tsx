"use client";

export default function EmptyBag() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-8 text-center">
      <h2 className="text-lg font-medium uppercase tracking-[0.2em]">
        Your Bag is Empty
      </h2>

      <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500">
        When you add pieces from the VÚJ collection, they will appear here.
      </p>
    </div>
  );
}