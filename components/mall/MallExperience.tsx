"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function MallExperience({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-mall-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-mall-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-mall-flow-dot]").forEach((el, i) => {
        gsap.to(el, {
          x: 8,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
          delay: i * 0.05,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return <>{children}</>;
}
