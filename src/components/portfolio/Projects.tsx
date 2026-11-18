"use client"

import { useRef } from "react"
import Image from "next/image"
import { ArrowUpRight, BarChart3, CloudRain, Github, Map } from "lucide-react"
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap"
import { projects, type Project } from "@/data/portfolio"
import { asset } from "@/lib/utils"
import { SectionHeading } from "./SectionHeading"

const pad = (n: number) => String(n).padStart(2, "0")

export function Projects() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // Desktop: cards rise in a staggered wave as the grid arrives.
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        gsap.from(".project-card", {
          y: 80,
          rotateX: -12,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".projects-track", start: "top 80%" },
        })
      })

      // Mobile / tablet: a deck being dealt. Each card pins a little lower than the one before
      // (so earlier cards peek out above), and as the next card slides up over it, the card
      // underneath shrinks, tilts back and darkens. GSAP pins rather than CSS sticky, because
      // ScrollSmoother moves the page with transforms, which breaks position: sticky.
      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card")
        const last = cards.length - 1
        const head = root.current!.querySelector<HTMLElement>(".projects-head")!
        // The heading pins just under the nav; the cards pin just under its title, so they
        // slide up over the subtitle while the eyebrow and title stay in view.
        const headTop = () => (document.querySelector<HTMLElement>(".site-nav")?.offsetHeight ?? 64) + 8
        const titleBottom = () => {
          const h2 = head.querySelector("h2")!
          return h2.getBoundingClientRect().bottom - head.getBoundingClientRect().top
        }
        const top = (i: number) => headTop() + titleBottom() + 24 + i * 12

        ScrollTrigger.create({
          trigger: head,
          start: () => `top top+=${headTop()}`,
          endTrigger: cards[last],
          end: () => `top top+=${top(last)}`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        })

        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: () => `top top+=${top(i)}`,
            endTrigger: cards[last],
            end: () => `top top+=${top(last)}`,
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          })
          if (i === last) return
          gsap
            .timeline({
              scrollTrigger: {
                trigger: cards[i + 1],
                start: "top bottom",
                end: () => `top top+=${top(i + 1)}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .to(card.querySelector(".project-inner"), { scale: 0.9, rotateX: 10, ease: "none" }, 0)
            .to(card.querySelector(".stack-shade"), { opacity: 0.55, ease: "none" }, 0)
        })

        // First card deals in as the section arrives.
        gsap.from(cards[0], {
          y: 60,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: cards[0], start: "top 90%" },
        })
      })

      // Pointer tilt on every card (fine pointers only).
      mm.add(`(pointer: fine) and ${MOTION_OK}`, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>(".project-card").map((card) => {
          const inner = card.querySelector<HTMLElement>(".project-inner")!
          const rx = gsap.quickTo(inner, "rotationX", { duration: 0.6, ease: "power3" })
          const ry = gsap.quickTo(inner, "rotationY", { duration: 0.6, ease: "power3" })
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect()
            ry(((e.clientX - r.left) / r.width - 0.5) * 12)
            rx(-((e.clientY - r.top) / r.height - 0.5) * 12)
          }
          const leave = () => {
            rx(0)
            ry(0)
          }
          card.addEventListener("pointermove", move)
          card.addEventListener("pointerleave", leave)
          return () => {
            card.removeEventListener("pointermove", move)
            card.removeEventListener("pointerleave", leave)
          }
        })
        return () => cleanups.forEach((fn) => fn())
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="projects" className="projects">
      <div className="projects-head">
        <SectionHeading eyebrow="03 / Selected work" lead="Featured" accent="Projects" lag={false}>
          Data pipelines, dashboards and apps: a few things I&apos;ve built end to end.
        </SectionHeading>
      </div>

      <div className="projects-track">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className="project-card" data-cursor={project.link ? "View" : undefined}>
      <div className="project-inner">
        {/* Darkens a card as the next one stacks over it (mobile). */}
        <span className="stack-shade" aria-hidden="true" />
        <div className="project-media">
          {project.image ? (
            <>
              <div className="project-media__frame">
                <Image
                  src={asset(project.image)}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1280px) 520px, (min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
                  className="project-media__img"
                />
              </div>
              <div className="project-media__shade" />
              <div className="project-links">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link project-link--github"
                    aria-label={`${project.title} on GitHub`}
                  >
                    <Github size={20} />
                    GitHub
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link project-link--live"
                    aria-label={`Visit ${project.title}`}
                  >
                    Live site
                    <ArrowUpRight className="project-link__arrow" size={20} />
                  </a>
                )}
              </div>
            </>
          ) : (
            <ProjectCover project={project} index={index} />
          )}
          <span className="project-num">{pad(index + 1)}</span>
        </div>

        <div className="project-body">
          <h3 className="project-body__title">
            {project.link ? (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <p className="project-body__kind">{project.kind}</p>
          <p className="project-body__desc">{project.description}</p>
          <ul className="project-body__points">
            {project.points.map((pt) => (
              <li key={pt}>
                <span className="project-body__bullet" aria-hidden="true" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
          <ul className="project-body__tags">
            {project.tags.map((tag) => (
              <li key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

const COVER_ICONS = [BarChart3, CloudRain, Map]

/** Generated cover for projects without a screenshot: gradient, grid and a big icon. */
function ProjectCover({ project, index }: { project: Project; index: number }) {
  const Icon = COVER_ICONS[index % COVER_ICONS.length]
  return (
    <div className="project-cover">
      <div className="bg-grid project-cover__grid" aria-hidden="true" />
      <Icon
        className="project-cover__icon"
        size={192}
        aria-hidden="true"
      />
      <div className="project-cover__tags">
        {project.tags.slice(0, 3).map((t) => (
          <span key={t}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
