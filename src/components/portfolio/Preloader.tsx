"use client"

import { useRef, useState } from "react"
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap"

/**
 * Intro curtain: a 0→100 counter, a split-text name reveal and a two-layer wipe.
 * Calls `onReveal` as the curtain starts lifting so the hero can animate in underneath.
 */
export function Preloader({ onReveal }: { onReveal: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        { motion: MOTION_OK, reduced: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          if (ctx.conditions?.reduced) {
            onReveal()
            gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: () => setDone(true) })
            return
          }

          const split = SplitText.create(".preloader-name", { type: "chars", mask: "chars" })
          const counter = { value: 0 }
          const counterEl = root.current!.querySelector<HTMLElement>(".preloader-count")!

          // Built paused (so the hidden start state applies at once) and only played after
          // the page's own start-up work — hydration, ScrollTrigger setup and the refresh
          // ScrollTrigger runs on `load` — so none of it lands mid-animation.
          const tl = gsap
            .timeline({ paused: true, onComplete: () => setDone(true) })
            .from(split.chars, { yPercent: 110, stagger: 0.04, duration: 0.8, ease: "expo.out" })
            .to(
              counter,
              {
                value: 100,
                duration: 1.6,
                ease: "power2.inOut",
                onUpdate: () => {
                  counterEl.textContent = String(Math.round(counter.value)).padStart(3, "0")
                },
              },
              0,
            )
            .to(".preloader-bar", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
            .to(split.chars, { yPercent: -110, stagger: 0.02, duration: 0.5, ease: "power3.in" }, ">-0.1")
            .to([".preloader-count", ".preloader-bar-wrap"], { autoAlpha: 0, duration: 0.3 }, "<")
            .add(onReveal, ">-0.1")
            .to(".preloader-panel", { yPercent: -100, duration: 1, ease: "expo.inOut", stagger: 0.12 }, "<")

          let started = false
          const start = () => {
            if (started) return
            started = true
            // Two frames: let the browser paint whatever the load handlers produced first.
            requestAnimationFrame(() => requestAnimationFrame(() => tl.play()))
          }
          const fallback = setTimeout(start, 1500) // never hold the intro on a slow network
          if (document.readyState === "complete") start()
          else window.addEventListener("load", start, { once: true })

          return () => {
            clearTimeout(fallback)
            window.removeEventListener("load", start)
          }
        },
      )
    },
    { scope: root },
  )

  if (done) return null

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="preloader-panel preloader-panel--color" />
      <div className="preloader-panel preloader-panel--main">
        <p className="preloader-name">Karthik Manche</p>
        <div className="preloader-bar-wrap">
          <div className="preloader-bar" />
        </div>
        <span className="preloader-count">
          000
        </span>
      </div>
    </div>
  )
}
