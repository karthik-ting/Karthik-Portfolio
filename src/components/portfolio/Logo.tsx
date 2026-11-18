"use client"

import { useRef } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"

const NAME = "Karthik"

/**
 * Solid wordmark. Letters rise out of a mask when the preloader lifts; on hover each
 * letter rolls up to reveal a gradient copy underneath, and the accent dot pops.
 */
export function Logo({ ready, onClick }: { ready: boolean; onClick: (e: React.MouseEvent) => void }) {
  const root = useRef<HTMLAnchorElement>(null)

  const { contextSafe } = useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ delay: 0.4 })
          .from(".logo-char", { yPercent: 110, stagger: 0.04, duration: 0.9, ease: "expo.out" })
          .from(".logo-dot", { scale: 0, duration: 0.6, ease: "back.out(3)" }, "-=0.4")
      })
    },
    { scope: root, dependencies: [ready] },
  )

  const roll = contextSafe((up: boolean) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.to(".logo-roll", {
      yPercent: up ? -100 : 0,
      stagger: { each: 0.025, from: up ? "start" : "end" },
      duration: 0.5,
      ease: "power3.inOut",
      overwrite: true,
    })
    gsap.to(".logo-dot", { scale: up ? 1.6 : 1, rotate: up ? 180 : 0, duration: 0.5, ease: "back.out(3)" })
  })

  return (
    <a
      ref={root}
      href="#top"
      onClick={onClick}
      onPointerEnter={() => roll(true)}
      onPointerLeave={() => roll(false)}
      onFocus={() => roll(true)}
      onBlur={() => roll(false)}
      aria-label="Karthik Manche, back to top"
      className="logo"
    >
      <span className="logo__letters" aria-hidden="true">
        {NAME.split("").map((char, i) => (
          <span key={i} className="logo__mask">
            <span className="logo-char">
              <span className="logo-roll">
                <span className="logo__glyph">{char === " " ? " " : char}</span>
                <span className="logo__glyph logo__glyph--hover">
                  {char === " " ? " " : char}
                </span>
              </span>
            </span>
          </span>
        ))}
      </span>
      <span className="logo-dot" />
    </a>
  )
}
