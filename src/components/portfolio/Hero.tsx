"use client"

import { useRef } from "react"
import { Briefcase, ChevronDown, Download, GraduationCap, MapPin } from "lucide-react"
import { gsap, useGSAP, SplitText, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { FIRST_NAME, INITIALS, LOCATION, NAME, TITLE, experience, roles } from "@/data/portfolio"
import { CvLink } from "./CvLink"
import { Magnetic } from "./Magnetic"
import { LocalTime, isExternal, socialLinks } from "./socialLinks"

const stats = [
  { value: "1+", label: "Years building" },
  { value: "3", label: "Data & app projects" },
  { value: "3", label: "Certifications" },
]

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)

  // Everything — including the text splitting — is prepared on mount while the preloader
  // still covers the page. When the curtain lifts, the intro only has to play.
  useGSAP(
    () => {
      gsap.set(".hero-content", { autoAlpha: 1 })
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const greeting = SplitText.create(".hero-greeting", { type: "chars", mask: "chars" })
        const sub = SplitText.create(".hero-sub", { type: "words", mask: "words" })

        const tl = (intro.current = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .from(greeting.chars, { yPercent: 120, rotate: 8, stagger: 0.035, duration: 1.2 })
          .from(
            ".hero-name",
            // clearProps: a lingering clip-path breaks background-clip:text in Chromium.
            { clipPath: "inset(0% 100% 0% 0%)", duration: 1.4, ease: "expo.inOut", clearProps: "clipPath" },
            "-=0.9",
          )
          .from(".hero-role", { autoAlpha: 0, y: 20, duration: 0.8 }, "-=0.6")
          .from(sub.words, { yPercent: 100, stagger: 0.03, duration: 0.9 }, "-=0.6")
          .from(".hero-cta > *", { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.9 }, "-=0.6")
          .from(".hero-social", { scale: 0, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: "back.out(2)" }, "-=0.7")
          .from(".hero-card", { x: 60, autoAlpha: 0, rotate: 3, duration: 1.2 }, "-=1.2")
          .from(".hero-scroll", { autoAlpha: 0, y: -20, duration: 0.8 }, "-=0.4"))

        // Rotating roles, decoded with ScrambleText; starts near the end of the intro.
        const roleTl = gsap.timeline({ paused: true, repeat: -1 })
        tl.call(() => roleTl.play(), undefined, tl.duration() - 1)
        roles.forEach((role) => {
          roleTl
            .to(".hero-role-text", {
              duration: 1.1,
              scrambleText: { text: role, chars: "upperAndLowerCase", speed: 0.5, revealDelay: 0.2 },
              ease: "none",
            })
            .to({}, { duration: 1.8 })
        })

        // Shimmer across the gradient name.
        gsap.to(".hero-name", {
          backgroundPosition: "200% center",
          duration: 6,
          ease: "none",
          repeat: -1,
        })

        gsap.to(".hero-scroll svg", { y: 10, duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 })

        // Scroll-out: content lifts, fades and softens as the hero leaves.
        gsap.to(".hero-content", {
          yPercent: -25,
          autoAlpha: 0,
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        gsap.to(".hero-marquee", {
          xPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
        })
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-role-text", { textContent: roles[0] })
      })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (ready) intro.current?.play()
    },
    { dependencies: [ready] },
  )

  const job = experience[0]

  return (
    <section
      ref={root}
      id="top"
      className="hero"
    >
      <p
        className="hero-marquee"
        aria-hidden="true"
      >
        Build · Analyse · Automate · Build · Analyse
      </p>

      <div className="hero-content">
        <div className="hero__intro">
          <p className="hero-sub hero__badge">
            Open to opportunities
          </p>

          <h1 className="hero__title">
            <span className="hero-greeting">Hello, I&apos;m</span>{" "}
            <span className="hero-name">
              {FIRST_NAME}
            </span>
          </h1>

          <p className="hero-role" aria-live="polite">
            <span className="hero-role__prompt">&gt; </span>
            <span className="hero-role-text">{roles[0]}</span>
            <span className="hero-role__caret">_</span>
          </p>

          <p className="hero-sub hero__lead">
            I build full-stack web apps with Next.js, automate the repetitive parts with Python, and turn raw data into
            dashboards people actually use.
          </p>

          <div className="hero-cta">
            <Magnetic>
              <button
                onClick={() => scrollToTarget("#contact")}
                className="hero__hire"
              >
                Hire me
              </button>
            </Magnetic>
            <Magnetic>
              <CvLink className="hero__resume">
                <Download size={16} />
                View Resume
              </CvLink>
            </Magnetic>
          </div>

          <div className="hero__socials">
            {socialLinks.map(({ href, label, Icon }) => (
              <Magnetic key={label} strength={0.5}>
                <a
                  href={href}
                  target={isExternal(href) ? "_blank" : undefined}
                  rel={isExternal(href) ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="hero-social"
                >
                  <Icon size={20} />
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Profile card. */}
        <aside className="hero-card">
          <div
            className="hero-card__glow"
            aria-hidden="true"
          />
          <div className="hero-card__body">
            <span aria-hidden="true" className="hero-card__bar" />
            <div className="hero-card__head">
              <span className="hero-card__avatar">
                {INITIALS}
              </span>
              <div>
                <p className="hero-card__name">{NAME}</p>
                <p className="hero-card__title">{TITLE}</p>
              </div>
            </div>

            <ul className="hero-card__facts">
              <li className="hero-card__fact">
                <Briefcase className="hero-card__icon hero-card__icon--gold" size={16} aria-hidden="true" />
                <span>
                  <span className="hero-card__strong">{job.role}</span>
                  <span className="hero-card__muted"> @ {job.company}</span>
                </span>
              </li>
              <li className="hero-card__fact">
                <GraduationCap className="hero-card__icon hero-card__icon--orange" size={16} aria-hidden="true" />
                <span className="hero-card__text">B.Tech, Electronics &amp; Computer Science</span>
              </li>
              <li className="hero-card__fact">
                <MapPin className="hero-card__icon hero-card__icon--rose" size={16} aria-hidden="true" />
                <span className="hero-card__text">
                  {LOCATION} · <span className="hero-card__time"><LocalTime /></span>
                </span>
              </li>
            </ul>

            <dl className="hero-card__stats">
              {stats.map((s) => (
                <div key={s.label} className="hero-card__stat">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="hero-card__stat-value">
                    {s.value}
                  </dd>
                  <dd aria-hidden="true" className="hero-card__stat-label">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <button
        onClick={() => scrollToTarget("#about")}
        className="hero-scroll"
        aria-label="Scroll to About"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  )
}
