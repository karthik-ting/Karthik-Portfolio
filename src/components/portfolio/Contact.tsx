"use client"

import { useRef, useState, type FormEvent, type InputHTMLAttributes } from "react"
import { ArrowUp, CheckCircle2, ChevronDown, Loader2, Mail, Phone, Send } from "lucide-react"
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { EMAIL, NAME, PHONE, socials } from "@/data/portfolio"
import { Magnetic } from "./Magnetic"
import { isExternal, socialLinks } from "./socialLinks"

export function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const title = SplitText.create(".contact-title", { type: "chars", mask: "chars" })

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 65%" } })
          .from(title.chars, {
            yPercent: 120,
            rotate: 10,
            stagger: { each: 0.035, from: "center" },
            duration: 1.1,
            ease: "expo.out",
          })
          .from(".contact-underline", { drawSVG: "0%", duration: 1.4, ease: "power2.inOut" }, 0.5)
          .from(".contact-copy > *", { y: 30, autoAlpha: 0, stagger: 0.12, duration: 1 }, 0.4)
          .from(".contact-cta", { y: 50, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, 0.7)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="contact" className="contact">
      <div className="contact__inner">
        <p className="contact__eyebrow">05 / Get in touch</p>
        <div className="contact__title-wrap">
          <h2 className="contact-title">Let&apos;s Work Together</h2>
          <svg
            className="contact__underline"
            viewBox="0 0 400 20"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="underline-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
            </defs>
            <path
              className="contact-underline"
              d="M2 14 C 60 4, 120 18, 200 10 S 340 4, 398 12"
              stroke="url(#underline-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="contact-copy">
          <p>
            Need someone who can <span className="contact__em">build</span> the web app,{" "}
            <span className="contact__em">automate</span> the workflow and{" "}
            <span className="contact__em">make sense of the data</span>? I&apos;m open to full-time roles,
            freelance work and interesting collaborations.
          </p>
          <p className="contact-copy__note">
            Tell me what you&apos;re working on and I&apos;ll get back to you by email.
          </p>
        </div>

        <div className="contact-cta">
          <EnquiryForm />
          <p className="contact__direct">
            <span>Prefer direct?</span>
            <a
              href={socials.email}
              className="contact__pill"
            >
              <Mail size={16} aria-hidden="true" />
              {EMAIL}
            </a>
            <a
              href={socials.phone}
              className="contact__pill"
            >
              <Phone size={16} aria-hidden="true" />
              {PHONE}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

const ENQUIRY_TYPES = [
  "Job opportunity",
  "Web app development (Next.js)",
  "Data analysis / Power BI dashboard",
  "Python automation or web scraping",
  "Collaboration on a project",
  "Something else",
] as const

/**
 * Static-host friendly: posts straight to FormSubmit, which relays the enquiry to EMAIL.
 * (The very first submission triggers a one-time activation email to that inbox.)
 */
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`

type Status = "idle" | "sending" | "sent" | "error"

/** A labelled text input; every field is required unless it says otherwise. */
function Field({ label, className, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field-label ${className ?? ""}`}>
      <span className="field-label__text">
        {label} <span className="field-label__req" aria-hidden="true">*</span>
      </span>
      <input required className="field field--input" {...props} />
    </label>
  )
}

function EnquiryForm() {
  const [type, setType] = useState<(typeof ENQUIRY_TYPES)[number] | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const somethingElse = type === "Something else"

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data._honey) return // bots fill hidden fields; humans don't

    setStatus("sending")
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "First Name": data.firstName,
          "Last Name": data.lastName,
          "Contact Email": data.email,
          "Enquiry Type": type,
          Notes: data.notes || "—",
          _subject: `Portfolio enquiry: ${type} — ${data.firstName} ${data.lastName}`,
          _replyto: data.email,
          _template: "table",
          _captcha: "false",
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || String(json.success) === "false") throw new Error(json.message)
      setStatus("sent")
      form.reset()
      setType(null)
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="enquiry enquiry--sent">
        <CheckCircle2 className="enquiry__check" size={48} />
        <p className="enquiry__sent-title">Message received.</p>
        <p className="enquiry__sent-text">Thanks for reaching out. I&apos;ll get back to you soon.</p>
        <button onClick={() => setStatus("idle")} className="enquiry__again">
          Send another →
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="enquiry"
    >
      {/* gradient hairline across the top edge */}
      <span aria-hidden="true" className="enquiry__hairline" />

      <div className="enquiry__head">
        <h3 className="enquiry__title">Send me a message</h3>
        <p className="enquiry__intro">
          Tell me a little about what you need and I&apos;ll get back to you by email.
        </p>
      </div>

      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="enquiry__honey" aria-hidden="true" />

      <div className="enquiry__grid">
        <Field label="First name" name="firstName" autoComplete="given-name" placeholder="Priya" />
        <Field label="Last name" name="lastName" autoComplete="family-name" placeholder="Sharma" />
        <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="priya@company.com" className="field-label--full" />
      </div>

      <label className="field-label enquiry__select">
        <span className="field-label__text">
          What can I help with? <span className="field-label__req" aria-hidden="true">*</span>
        </span>
        <span className="enquiry__select-wrap">
          <select
            name="enquiryType"
            required
            value={type ?? ""}
            onChange={(e) => setType((e.target.value || null) as typeof type)}
            className={`field field--select${type ? "" : " is-placeholder"}`}
          >
            <option value="" disabled>
              Choose a topic…
            </option>
            {ENQUIRY_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="enquiry__chevron" size={20} aria-hidden="true" />
        </span>
      </label>

      <label className="field-label enquiry__message">
        <span className="field-label__text field-label__text--split">
          <span>
            Message {somethingElse && <span className="field-label__req" aria-hidden="true">*</span>}
          </span>
          <span className="field-label__hint">{somethingElse ? "Required" : "Optional"}</span>
        </span>
        <textarea
          name="notes"
          rows={5}
          required={somethingElse}
          placeholder={somethingElse ? "What can I help you with?" : "A few words about your project, timeline or budget…"}
          className="field field--textarea"
        />
      </label>

      <div className="enquiry__footer">
        <div className="enquiry__status">
          {status === "error" ? (
            <p role="alert" className="enquiry__error">
              Something went wrong. Please try again or email me directly.
            </p>
          ) : (
            <p className="enquiry__note">Your details are only used to reply to you.</p>
          )}
        </div>
        <Magnetic strength={0.3}>
          <button
            type="submit"
            disabled={status === "sending"}
            className="enquiry__submit"
          >
            {status === "sending" ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </Magnetic>
      </div>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">© {new Date().getFullYear()} {NAME}. Built in Navi Mumbai.</p>
        <div className="site-footer__links">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={isExternal(href) ? "_blank" : undefined}
              rel={isExternal(href) ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="site-footer__link"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    const show = gsap
      .timeline({ paused: true })
      .fromTo(ref.current, { autoAlpha: 0, scale: 0, rotate: -180 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" })

    ScrollTrigger.create({
      start: 600,
      end: "max",
      onEnter: () => show.play(),
      onLeaveBack: () => show.reverse(),
    })
  })

  return (
    <button
      ref={ref}
      onClick={() => scrollToTarget(0)}
      className="back-to-top"
      aria-label="Back to top"
    >
      <ArrowUp size={24} />
    </button>
  )
}
