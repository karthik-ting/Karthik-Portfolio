"use client"

import { useRef } from "react"
import { Award, BookOpen, Briefcase, GraduationCap, MapPin, Sparkles } from "lucide-react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { certifications, coursework, education, experience, extracurricular } from "@/data/portfolio"
import { SectionHeading } from "./SectionHeading"

export function Experience() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // The timeline rail grows as the section scrolls past.
        gsap.from(".xp-rail", {
          scaleY: 0,
          ease: "none",
          scrollTrigger: { trigger: ".xp-list", start: "top 75%", end: "bottom 60%", scrub: true },
        })

        gsap.utils.toArray<HTMLElement>(".xp-item").forEach((item) => {
          gsap
            .timeline({ scrollTrigger: { trigger: item, start: "top 80%" } })
            .from(item.querySelector(".xp-node"), { scale: 0, duration: 0.5, ease: "back.out(3)" })
            .from(item.querySelector(".xp-card"), { x: 40, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, "<0.1")
        })

        gsap.from(".edu-card", {
          y: 40,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: ".edu-grid", start: "top 80%" },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="experience" className="experience">
      <div className="experience__inner">
        <SectionHeading eyebrow="02 / Journey" lead="Experience &" accent="Education">
          Where I&apos;ve worked, what I&apos;ve studied and the certifications along the way.
        </SectionHeading>

        {/* Work timeline. */}
        <ol className="xp-list">
          <span
            className="xp-rail"
            aria-hidden="true"
          />
          {experience.map((job) => (
            <li key={job.company} className="xp-item">
              <span
                className="xp-node"
                aria-hidden="true"
              >
                <Briefcase size={16} />
              </span>
              <article className="xp-card">
                <header className="xp-card__header">
                  <div>
                    <h3 className="xp-card__role">{job.role}</h3>
                    <p className="xp-card__company">{job.company}</p>
                  </div>
                  <div className="xp-card__meta">
                    <span
                      className={`xp-card__period${job.current ? " xp-card__period--current" : ""}`}
                    >
                      {job.current && <span className="xp-card__live" />}
                      {job.period}
                    </span>
                    <span className="xp-card__location">
                      <MapPin size={14} aria-hidden="true" />
                      {job.location}
                    </span>
                  </div>
                </header>
                <ul className="xp-card__points">
                  {job.points.map((pt) => (
                    <li key={pt}>
                      <span className="xp-card__bullet" aria-hidden="true" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <ul className="xp-card__tags" aria-label="Technologies">
                  {job.tags.map((t) => (
                    <li key={t}>
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>

        {/* Education, certifications, coursework, leadership. */}
        <div className="edu-grid">
          <div className="edu-card edu-card--wide">
            <h3 className="edu-card__title">
              <GraduationCap className="edu-card__icon--gold" size={24} aria-hidden="true" />
              Education
            </h3>
            <ul className="edu-list">
              {education.map((e) => (
                <li key={e.school}>
                  <div>
                    <p className="edu-list__school">{e.school}</p>
                    <p className="edu-list__degree">
                      {e.degree} · <span className="edu-list__score">{e.score}</span>
                    </p>
                  </div>
                  <div className="edu-list__when">
                    <p className="edu-list__period">{e.period}</p>
                    <p>{e.location}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="edu-card">
            <h3 className="edu-card__title">
              <Award className="edu-card__icon--orange" size={24} aria-hidden="true" />
              Certifications
            </h3>
            <ul className="cert-list">
              {certifications.map((c) => (
                <li key={c.name}>
                  <p className="cert-list__name">{c.name}</p>
                  <p className="cert-list__meta">
                    {c.issuer} · <span className="cert-list__period">{c.period}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="edu-card edu-card--wide">
            <h3 className="edu-card__title">
              <BookOpen className="edu-card__icon--rose" size={24} aria-hidden="true" />
              Relevant coursework
            </h3>
            <ul className="course-list">
              {coursework.map((c) => (
                <li key={c}>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="edu-card">
            <h3 className="edu-card__title">
              <Sparkles className="edu-card__icon--gold" size={24} aria-hidden="true" />
              Leadership
            </h3>
            <ul className="lead-list">
              {extracurricular.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
