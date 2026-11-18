"use client"

import { useRef } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"

/**
 * Text whose letters roll up to reveal a second copy when the closest link/button is
 * hovered or focused. Screen readers get the plain text once.
 */
export function RollText({
  text,
  className = "",
  gradient = false,
}: {
  text: string
  className?: string
  /** The rolled-in copy uses the accent gradient. */
  gradient?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const trigger = ref.current!.closest<HTMLElement>("a, button") ?? ref.current!
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const chars = ref.current!.querySelectorAll(".roll-inner")
        const roll = (up: boolean) =>
          gsap.to(chars, {
            yPercent: up ? -100 : 0,
            stagger: { each: 0.018, from: up ? "start" : "end" },
            duration: 0.45,
            ease: "power3.inOut",
            overwrite: true,
          })
        const enter = () => roll(true)
        const leave = () => roll(false)

        trigger.addEventListener("pointerenter", enter)
        trigger.addEventListener("pointerleave", leave)
        trigger.addEventListener("focus", enter)
        trigger.addEventListener("blur", leave)
        return () => {
          trigger.removeEventListener("pointerenter", enter)
          trigger.removeEventListener("pointerleave", leave)
          trigger.removeEventListener("focus", enter)
          trigger.removeEventListener("blur", leave)
        }
      })
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={`roll-text ${className}`}>
      <span className="sr-only">{text}</span>
      <span className="roll-text__letters" aria-hidden="true">
        {text.split("").map((char, i) => {
          const glyph = char === " " ? " " : char
          return (
            <span key={i} className="roll-text__mask">
              <span className="roll-inner">
                {glyph}
                <span className={`roll-text__copy${gradient ? " roll-text__copy--gradient" : ""}`}>{glyph}</span>
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
