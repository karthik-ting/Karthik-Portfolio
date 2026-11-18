"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Download, MapPin, Pause, Play } from "lucide-react"
import { gsap, useGSAP, SplitText, ScrollTrigger, Observer, scrollToTarget } from "@/lib/gsap"
import { INITIALS, LOCATION, NAME, TITLE, deviconUrl } from "@/data/portfolio"
import { CvLink } from "./CvLink"
import { LocalTime } from "./socialLinks"
import { LINES, MOTTO, pillars, stack, strengths } from "./aboutData"

const STORIES = [
  { label: "about.cpp", duration: 6.5 },
  { label: "Profile", duration: 4.5 },
  { label: "Toolkit", duration: 4.5 },
  { label: "My story", duration: 6.5 },
  { label: "How I work", duration: 5.5 },
  { label: "Motto", duration: 6 },
]

/**
 * About, phone edition: a stories deck. Segmented bars auto-advance; swipe or tap the sides to
 * move, press and hold to pause. Each story has its own GSAP entrance, and the deck pauses
 * whenever it's off-screen. The deck keeps a fixed dark palette in both themes, as stories do.
 */
export function AboutStories() {
  const root = useRef<HTMLDivElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const api = useRef<{ go: (d: 1 | -1) => void; toggle: () => void } | null>(null)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)

  useGSAP(
    () => {
      const el = deck.current!
      const slides = gsap.utils.toArray<HTMLElement>(".story", el)
      const fills = gsap.utils.toArray<HTMLElement>(".seg-fill", el)
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const n = slides.length

      let index = 0
      let timer: gsap.core.Tween | null = null
      let entrance: gsap.core.Timeline | null = null
      let inView = false
      let userPaused = reduce // no autoplay with reduced motion
      let holding = false
      let started = false
      let swipedAt = 0
      if (reduce) setPlaying(false)

      // Text splits are prepared once; entrances replay them on every visit.
      const storyWords = SplitText.create(".st-words", { type: "words" }).words
      const mottoChars = SplitText.create(".st-motto", { type: "words,chars", mask: "chars" }).chars // words keep letters together when wrapping

      const q = (i: number, sel: string) => slides[i].querySelectorAll<HTMLElement>(sel)
      const ENTER: ((i: number) => gsap.core.Timeline)[] = [
        // about.cpp: type each line (stepped clip = one character per step), then compile.
        (i) => {
          const t = gsap.timeline()
          t.set(q(i, ".st-compiled"), { autoAlpha: 0 })
            .set(q(i, ".st-compiling"), { autoAlpha: 1 })
            .set(q(i, ".st-dot"), { backgroundColor: "#febc2e" })
            .set(q(i, ".st-line"), { clipPath: "inset(0% 100% 0% 0%)" })
          q(i, ".st-line").forEach((line) => {
            const chars = Math.max(1, (line.textContent ?? "").length)
            t.to(line, { clipPath: "inset(0% 0% 0% 0%)", ease: `steps(${chars})`, duration: chars * 0.016 })
          })
          return t
            .to(q(i, ".st-compiling"), { autoAlpha: 0, duration: 0.15 })
            .to(q(i, ".st-compiled"), { autoAlpha: 1, duration: 0.15 }, "<")
            .to(q(i, ".st-dot"), { backgroundColor: "#a5e844", duration: 0.15 }, "<")
            .fromTo(q(i, ".st-hint"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 })
        },
        // Profile: avatar pops, details rise in.
        (i) =>
          gsap
            .timeline()
            .fromTo(q(i, ".st-avatar"), { scale: 0.4, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2)" })
            .fromTo(q(i, ".st-item"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" }, "<0.15"),
        // Toolkit: chips pop, logos tumble in.
        (i) =>
          gsap
            .timeline()
            .fromTo(q(i, ".st-chip"), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.08, duration: 0.45, ease: "back.out(2.5)" })
            .fromTo(
              q(i, ".st-logo"),
              { y: 40, rotate: -30, autoAlpha: 0 },
              { y: 0, rotate: 0, autoAlpha: 1, stagger: 0.08, duration: 0.6, ease: "back.out(1.8)" },
              "-=0.15",
            ),
        // My story: words light up in reading order.
        () =>
          gsap
            .timeline()
            .fromTo(storyWords, { opacity: 0.15 }, { opacity: 1, stagger: 0.07, duration: 0.25, ease: "none" }),
        // How I work: the line draws down, each step arrives as it's reached.
        (i) =>
          gsap
            .timeline()
            .fromTo(q(i, ".st-path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.8, ease: "power1.inOut" })
            .fromTo(
              q(i, ".st-step"),
              { x: -24, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, stagger: 0.55, duration: 0.5, ease: "power3.out" },
              0.1,
            ),
        // Motto: letters rise out of their masks, then the actions.
        (i) =>
          gsap
            .timeline()
            .fromTo(mottoChars, { yPercent: 110 }, { yPercent: 0, stagger: 0.025, duration: 0.8, ease: "expo.out" })
            .fromTo(q(i, ".st-cta"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.5 }, "-=0.3"),
      ]

      const canPlay = () => inView && !userPaused && !holding
      const resume = () => {
        if (canPlay()) timer?.resume()
      }
      const enter = (i: number) => {
        entrance?.kill()
        entrance = reduce ? null : ENTER[i](i)
      }

      const show = (next: number, dir: 1 | -1) => {
        const prev = index
        index = (next + n) % n
        fills.forEach((f, k) => gsap.set(f, { scaleX: k < index ? 1 : 0 }))
        slides.forEach((s, k) => {
          s.inert = k !== index
          s.setAttribute("aria-hidden", String(k !== index))
        })

        if (reduce || prev === index) {
          gsap.set(slides, { autoAlpha: 0 })
          gsap.set(slides[index], { autoAlpha: 1, xPercent: 0, rotateY: 0 })
        } else {
          gsap.to(slides[prev], {
            xPercent: -32 * dir,
            rotateY: 40 * dir,
            autoAlpha: 0,
            duration: 0.45,
            ease: "power2.in",
            overwrite: true,
          })
          gsap.fromTo(
            slides[index],
            { xPercent: 32 * dir, rotateY: -40 * dir, autoAlpha: 0 },
            { xPercent: 0, rotateY: 0, autoAlpha: 1, duration: 0.6, delay: 0.1, ease: "power3.out", overwrite: true },
          )
        }

        setCurrent(index)
        if (started) enter(index)

        timer?.kill()
        timer = gsap.to(fills[index], {
          scaleX: 1,
          duration: STORIES[index].duration,
          ease: "none",
          paused: true,
          onComplete: () => show(index + 1, 1),
        })
        if (reduce) gsap.set(fills[index], { scaleX: 1 })
        else resume()
      }

      const go = (d: 1 | -1) => show(index + d, d)
      api.current = {
        go,
        toggle: () => {
          userPaused = !userPaused
          setPlaying(!userPaused)
          if (userPaused) timer?.pause()
          else resume()
        },
      }

      show(0, 1)

      // Only run while on screen; the first time it appears, play the opening story.
      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        end: "bottom 25%",
        onToggle: (self) => {
          inView = self.isActive
          if (inView) {
            if (!started) {
              started = true
              enter(index)
            }
            resume()
          } else timer?.pause()
        },
      })

      // Drag: the story follows the finger, then commits on release if dragged far enough (or
      // flicked fast), otherwise springs back. Direction comes from the real geometry
      // (start vs current position). Horizontal drags only, so page scrolling still works.
      // Press and hold pauses.
      const dragX = (self: Observer) => (self.x ?? 0) - (self.startX ?? 0)
      const obs = Observer.create({
        target: el,
        type: "touch,pointer",
        dragMinimum: 6,
        lockAxis: true,
        onDrag: (self) => {
          if (self.axis !== "x" || reduce) return
          gsap.set(slides[index], { x: dragX(self) * 0.4, rotateY: dragX(self) * 0.04 })
        },
        onDragEnd: (self) => {
          if (self.axis !== "x") return
          const dx = dragX(self)
          swipedAt = Date.now()
          if (Math.abs(dx) > 60 || (Math.abs(dx) > 20 && Math.abs(self.velocityX) > 600)) {
            gsap.set(slides[index], { x: 0 })
            go(dx < 0 ? 1 : -1)
          } else if (!reduce) {
            gsap.to(slides[index], { x: 0, rotateY: 0, duration: 0.5, ease: "elastic.out(1, 0.6)" })
          }
        },
        onPress: () => {
          holding = true
          timer?.pause()
        },
        onRelease: () => {
          holding = false
          resume()
        },
      })

      // Tap the left third to go back, anywhere else to go forward. A click whose pointer
      // travelled is a swipe, not a tap (the click can arrive before Observer reports the swipe).
      let down = { x: 0, y: 0 }
      const onDown = (e: PointerEvent) => {
        down = { x: e.clientX, y: e.clientY }
      }
      const onClick = (e: MouseEvent) => {
        if (Date.now() - swipedAt < 400) return
        if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) return
        if ((e.target as HTMLElement).closest("a, button")) return
        const r = el.getBoundingClientRect()
        go(e.clientX < r.left + r.width / 3 ? -1 : 1)
      }
      el.addEventListener("pointerdown", onDown)
      el.addEventListener("click", onClick)

      return () => {
        el.removeEventListener("pointerdown", onDown)
        el.removeEventListener("click", onClick)
        obs.kill()
        timer?.kill()
        entrance?.kill()
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="stories">
      <div
        ref={deck}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="About me, in stories"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") api.current?.go(1)
          if (e.key === "ArrowLeft") api.current?.go(-1)
        }}
        className="stories__deck"
      >
        {/* Header: progress segments, who, which story, pause. */}
        <div className="stories__header">
          <div className="stories__segments" aria-hidden="true">
            {STORIES.map((s) => (
              <span key={s.label} className="stories__segment">
                <span className="seg-fill" />
              </span>
            ))}
          </div>
          <div className="stories__meta">
            <span className="stories__avatar">
              {INITIALS}
            </span>
            <span className="stories__name">{NAME}</span>
            <span className="stories__label" aria-live="polite">
              {STORIES[current].label}
            </span>
            <button
              type="button"
              onClick={() => api.current?.toggle()}
              aria-label={playing ? "Pause stories" : "Play stories"}
              className="stories__btn stories__btn--pause"
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        </div>

        {/* 1. about.cpp */}
        <section className="story story--code" aria-label={`1 of ${STORIES.length}: about.cpp`}>
          <div className="story__bg story__bg--code" />
          <div className="st-editor">
            <div className="st-editor__bar">
              <span className="st-editor__light st-editor__light--red" />
              <span className="st-editor__light st-editor__light--yellow" />
              <span className="st-editor__light st-editor__light--green" />
              <span className="st-editor__file">about.cpp</span>
              <span className="st-editor__status">
                <span className="st-dot" />
                <span className="st-compiling">Compiling…</span>
                <span className="st-compiled">Compiled</span>
              </span>
            </div>
            <pre className="st-editor__code" aria-hidden="true">
              <code>
                {LINES.map((line, i) => (
                  <span key={i} className="st-line">
                    <span className="st-line__num">{i + 1}</span>
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
          <p className="st-hint">
            Clean data, clean code. Swipe to see what it renders →
          </p>
        </section>

        {/* 2. Profile */}
        <section className="story story--center" aria-label={`2 of ${STORIES.length}: Profile`}>
          <div className="story__bg story__bg--profile" />
          <span className="st-avatar">
            {INITIALS}
          </span>
          <h3 className="st-item story__name">{NAME}</h3>
          <p className="st-item story__title">
            {TITLE}
          </p>
          <p className="st-item story__location">
            <MapPin size={20} aria-hidden="true" />
            {LOCATION}
          </p>
          <p className="st-item story__time">
            Local time <LocalTime />
          </p>
        </section>

        {/* 3. Toolkit */}
        <section className="story story--center" aria-label={`3 of ${STORIES.length}: Toolkit`}>
          <div className="story__bg story__bg--toolkit" />
          <h3 className="story__heading">Strengths</h3>
          <ul className="story__chips">
            {strengths.map((s) => (
              <li key={s} className="st-chip">
                {s}
              </li>
            ))}
          </ul>
          <h3 className="story__heading story__heading--stack">Daily stack</h3>
          <ul className="story__stack">
            {stack.map(({ slug, name, invert }) => (
              <li key={slug} className="st-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={deviconUrl(slug)} alt="" width={32} height={32} className={invert ? "invert" : ""} />
                <span className="st-logo__name">{name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. My story */}
        <section className="story story--center" aria-label={`4 of ${STORIES.length}: My story`}>
          <div className="story__bg story__bg--story" />
          <p className="st-words">
            Software developer by day, data nerd always. I build Next.js apps, automate with Python and turn raw
            datasets into Power BI dashboards that make decisions easier.
          </p>
        </section>

        {/* 5. How I work */}
        <section className="story story--center" aria-label={`5 of ${STORIES.length}: How I work`}>
          <div className="story__bg story__bg--work" />
          <div className="story__steps">
            <svg
              className="story__path"
              viewBox="0 0 4 100"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                {/* userSpaceOnUse: a straight vertical path has a zero-width bounding box, so a bounding-box gradient would not render. */}
                <linearGradient id="st-grad" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="100">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
              </defs>
              <path className="st-path" d="M2 0 V100" stroke="url(#st-grad)" strokeWidth="3" />
            </svg>
            <ol className="story__step-list">
              {pillars.map(({ Icon, title, text }) => (
                <li key={title} className="st-step">
                  <span className="st-step__icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="st-step__title">{title}</h3>
                    <p className="st-step__text">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Motto */}
        <section className="story story--motto" aria-label={`6 of ${STORIES.length}: Motto`}>
          <p className="st-motto">
            {MOTTO}
          </p>
          <div className="story__actions">
            <button
              type="button"
              onClick={() => scrollToTarget("#contact")}
              className="st-cta story__talk"
            >
              Let&apos;s talk
            </button>
            <CvLink className="st-cta story__cv">
              <Download size={16} aria-hidden="true" />
              Preview CV
            </CvLink>
          </div>
        </section>

        {/* Footer: explicit controls (also the accessible way to navigate). */}
        <div className="stories__footer">
          <button
            type="button"
            onClick={() => api.current?.go(-1)}
            aria-label="Previous story"
            className="stories__btn"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="stories__count">
            {current + 1} / {STORIES.length}
          </span>
          <button
            type="button"
            onClick={() => api.current?.go(1)}
            aria-label="Next story"
            className="stories__btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <p className="stories__hint">
        Swipe or tap the sides to move between stories. Press and hold to pause.
      </p>
    </div>
  )
}
