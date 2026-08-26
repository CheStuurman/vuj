"use client";

import { useTransition } from "@/context/TransitionContext";

export default function TransitionOverlay() {
  const { visible } = useTransition();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        zIndex: 999999,
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 450ms ease",
      }}
    />
  );
}