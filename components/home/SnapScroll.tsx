"use client";

import { useEffect } from "react";

export default function SnapScroll() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll("section[data-snap]")
    ) as HTMLElement[];

    if (!sections.length) return;

    let timeout: NodeJS.Timeout;
    let lastDirection: "up" | "down" = "down";
    let lastScroll = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;

      lastDirection =
        current > lastScroll ? "down" : "up";

      lastScroll = current;

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const middle =
          window.scrollY + window.innerHeight / 2;

        let target = sections[0];

        if (lastDirection === "down") {
          for (const section of sections) {
            if (
              section.offsetTop >
              window.scrollY + window.innerHeight * 0.6
            ) {
              target = section;
              break;
            }
          }
        } else {
          for (let i = sections.length - 1; i >= 0; i--) {
            if (
              sections[i].offsetTop <
              middle
            ) {
              target = sections[i];
              break;
            }
          }
        }

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, []);

  return null;
}