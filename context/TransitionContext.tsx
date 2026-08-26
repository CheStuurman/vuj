"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface TransitionContextType {
  navigate: (href: string) => void;
  hideOverlay: () => void;
  visible: boolean;
}

const TransitionContext =
  createContext<TransitionContextType | null>(null);

const TRANSITION_DURATION = 450;

export function TransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [visible, setVisible] = useState(false);

  const timeoutRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const navigate = useCallback(
    (href: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      /*
       * Cover the current page first.
       */
      setVisible(true);

      /*
       * Give the overlay time to become
       * completely opaque before navigating.
       */
      timeoutRef.current = setTimeout(() => {
        router.push(href);
      }, TRANSITION_DURATION);
    },
    [router]
  );

  const hideOverlay = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        navigate,
        hideOverlay,
        visible,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(
    TransitionContext
  );

  if (!context) {
    throw new Error(
      "useTransition must be used inside TransitionProvider."
    );
  }

  return context;
}