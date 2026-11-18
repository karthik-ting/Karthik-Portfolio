"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap"

/** Section title whose characters rise out of a mask when scrolled into view. */
export function SectionHeading({
  eyebrow,
  lead,
  accent,
  children,
  lag = true,
}: {
  eyebrow: string
  lead: string
  accent: string
  children?: ReactNode
  /** Drift behind the scroll a little. Off for headings that get pinned. */
  lag?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const scrollTrigger = { trigger: root.current, start: "top 80%" }
        SplitText.create(".heading-lead", {
          type: "chars",
          mask: "chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, { yPercent: 110, stagger: 0.03, duration: 1, ease: "expo.out", scrollTrigger }),
        })
        gsap.from(".heading-accent", {
          clipPath: "inset(0% 100% 0% 0%)",
          clearProps: "clipPath",
          duration: 1.2,
          ease: "expo.inOut",
          delay: 0.2,
          scrollTrigger,
        })
        gsap.from([".heading-eyebrow", ".heading-body"], {
          y: 24,
          autoAlpha: 0,
          stagger: 0.15,
          duration: 1,
          scrollTrigger,
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="section-heading" data-lag={lag ? 0.15 : undefined}>
      <p className="heading-eyebrow">
        <span>{eyebrow}</span>
        <span className="section-heading__rule" aria-hidden="true" />
      </p>
      <h2 className="section-heading__title">
        <span className="heading-lead">{lead}</span>{" "}
        <span className="heading-accent">
          {accent}
        </span>
      </h2>
      {children && <div className="heading-body">{children}</div>}
    </div>
  )
}
