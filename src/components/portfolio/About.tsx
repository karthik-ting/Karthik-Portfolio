"use client"

import { useRef } from "react"
import { MapPin } from "lucide-react"
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap"
import { INITIALS, LOCATION, NAME, TITLE, deviconUrl } from "@/data/portfolio"
import { SectionHeading } from "./SectionHeading"
import { AboutStories } from "./AboutStories"
import { LINES, MOTTO, pillars, stack, strengths } from "./aboutData"


export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Desktop only: phones get the Stories format (AboutStories) instead.
      mm.add(
        `(min-width: 1024px) and ${MOTION_OK}`,
        () => {
          const lines = gsap.utils.toArray<HTMLElement>(".code-line")

          // ── Scene: each line types out (stepped clip = one character per step), then the
          //    part of the card it describes renders. Pinned and scroll-scrubbed.
          gsap.set(lines, { clipPath: "inset(0% 100% 0% 0%)" })
          gsap.set(".card-step", { autoAlpha: 0, y: 18 })
          gsap.set(".profile-card", { autoAlpha: 0.35, scale: 0.96 })

          const scene = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".about-scene", start: "center center", end: "+=1500", pin: true, scrub: 0.6, anticipatePin: 1 },
          })

          lines.forEach((line, i) => {
            const chars = Math.max(1, (line.textContent ?? "").length)
            scene.to(line, { clipPath: "inset(0% 0% 0% 0%)", ease: `steps(${chars})`, duration: chars * 0.028 })
            if (i === 0) scene.to(".profile-card", { autoAlpha: 1, scale: 1, duration: 0.5 }, "<0.1")
            scene.to(`.card-step-${i}`, { autoAlpha: 1, y: 0, duration: 0.45 }, "<0.15")
            if (i === 3) scene.from(".strength-chip", { scale: 0.6, stagger: 0.08, duration: 0.35, ease: "back.out(2)" }, "<")
            if (i === 4)
              scene.from(".stack-logo", { y: 24, rotate: -20, stagger: 0.07, duration: 0.4, ease: "back.out(2)" }, "<")
          })

          // The closing brace "compiles" the card.
          scene
            .to(".status-compiling", { autoAlpha: 0, duration: 0.2 })
            .to(".status-compiled", { autoAlpha: 1, duration: 0.2 }, "<")
            .to(".status-dot", { backgroundColor: "#a5e844", duration: 0.2 }, "<")
            .fromTo(
              ".profile-glow",
              { autoAlpha: 0, scale: 0.8 },
              { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power2.out" },
              "<",
            )
            .from(".motto-underline", { scaleX: 0, duration: 0.5, ease: "power2.inOut" }, "<")

          // ── Bio: words light up as the paragraph scrolls through the viewport.
          SplitText.create(".about-copy", {
            type: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.12 },
                {
                  opacity: 1,
                  stagger: 0.1,
                  ease: "none",
                  scrollTrigger: { trigger: ".about-copy", start: "top 78%", end: "bottom 50%", scrub: true },
                },
              ),
          })

          // ── Process: the path draws across Design → Develop → Deliver; each step lights up
          //    as the line reaches it.
          const process = gsap.timeline({
            scrollTrigger: { trigger: ".process", start: "top 75%", end: "bottom 60%", scrub: 0.8 },
          })
          process.from(".process-path", { drawSVG: "0%", ease: "none", duration: 1 }, 0)
          gsap.utils.toArray<HTMLElement>(".pillar").forEach((card, i) => {
            const at = i / (pillars.length - 1)
            process
              .from(card.querySelector(".pillar-node"), { scale: 0, duration: 0.12, ease: "back.out(3)" }, at * 0.92)
              .from(card.querySelector(".pillar-body"), { y: 40, autoAlpha: 0, duration: 0.2 }, at * 0.92)
          })
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="about">
      <div className="about__inner">
        <SectionHeading eyebrow="01 / Who I am" lead="About" accent="Me" />

        {/* Phones and tablets: About as swipeable stories. */}
        <AboutStories />

        {/* Desktop: the pinned code-to-card scene, bio and process. */}
        <div className="about-desktop">
        {/* Scene: the code on the left renders the card on the right, one line at a time. */}
        <div className="about-scene">
          <div
            className="code-card"
            aria-hidden="true"
          >
            <div className="code-card__bar">
              <span className="code-card__light code-card__light--red" />
              <span className="code-card__light code-card__light--yellow" />
              <span className="code-card__light code-card__light--green" />
              <span className="code-card__file">about.cpp</span>
              <span className="code-card__status">
                <span className="status-dot" />
                <span className="status-compiling">Compiling…</span>
                <span className="status-compiled">Compiled</span>
              </span>
            </div>
            <pre className="code-card__code">
              <code>
                {LINES.map((line, i) => (
                  <span key={i} className="code-line">
                    <span className="code-line__num">{i + 1}</span>
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>

          {/* The rendered output. */}
          <div className="about__output">
            <div
              className="profile-glow"
              aria-hidden="true"
            />
            <article className="profile-card">
              <div className="card-step card-step-0 profile-card__head">
                <span className="profile-card__avatar">
                  {INITIALS}
                </span>
                <div>
                  <h3 className="profile-card__name">{NAME}</h3>
                  <p className="profile-card__tagline">Builds for the web, reads the data</p>
                </div>
              </div>

              <p className="card-step card-step-1 profile-card__role">
                <span className="profile-card__role-text">
                  {TITLE}
                </span>
              </p>

              <p className="card-step card-step-2 profile-card__location">
                <MapPin size={16} aria-hidden="true" />
                {LOCATION}
              </p>

              <ul className="card-step card-step-3 profile-card__chips" aria-label="Strengths">
                {strengths.map((s) => (
                  <li
                    key={s}
                    className="strength-chip"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <ul className="card-step card-step-4 profile-card__stack" aria-label="Stack">
                {stack.map(({ slug, name, invert }) => (
                  <li
                    key={slug}
                    title={name}
                    className="stack-logo"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={deviconUrl(slug)} alt={name} width={26} height={26} className={invert ? "invert-dark" : ""} />
                  </li>
                ))}
              </ul>

              <blockquote className="card-step card-step-5 profile-card__motto">
                &ldquo;{MOTTO}&rdquo;
                <span className="motto-underline" />
              </blockquote>
              <span className="card-step card-step-6 sr-only">End of profile</span>
            </article>
          </div>
        </div>

        {/* Bio. */}
        <div className="about-copy">
          <p>
            I&apos;m a Software Developer at TING Works in Mumbai, building full-stack web applications with Next.js,
            Strapi CMS and REST APIs for live client projects, and writing Python scripts that scrape, clean and
            automate away hours of manual work.
          </p>
          <p>
            With a B.Tech in Electronics and Computer Science and a real love for data, I enjoy the full journey: from
            messy datasets in Pandas and SQL to Power BI dashboards that make the answer obvious.
          </p>
        </div>

        {/* Process: a path drawn through Design → Develop → Deliver. */}
        <div className="process">
          <svg
            className="process__line"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="process-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>
            <path
              className="process-path"
              d="M200 40 C 330 -5, 470 85, 600 40 S 870 -5, 1000 40"
              stroke="url(#process-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <ol className="process__list">
            {pillars.map(({ Icon, title, text }, i) => (
              <li key={title} className="pillar">
                <span
                  className="pillar-node"
                  aria-hidden="true"
                />
                <div className="pillar-body">
                  <div className="pillar-body__head">
                    <Icon className="pillar-body__icon" size={32} />
                    <span className="pillar-body__num">0{i + 1}</span>
                  </div>
                  <h3 className="pillar-body__title">{title}</h3>
                  <p className="pillar-body__text">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        </div>
      </div>
    </section>
  )
}
