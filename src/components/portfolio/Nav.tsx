"use client"

import { useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother, scrollToTarget, MOTION_OK } from "@/lib/gsap"
import { CITY, EMAIL, navItems, socials } from "@/data/portfolio"
import { LocalTime, isExternal, socialLinks } from "./socialLinks"
import { Logo } from "./Logo"
import { Magnetic } from "./Magnetic"
import { RollText } from "./RollText"

const pad = (n: number) => String(n + 1).padStart(2, "0")

export function Nav({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLSpanElement>(null)
  const menuTl = useRef<gsap.core.Timeline>(null)
  const [active, setActive] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const { contextSafe } = useGSAP(
    () => {
      // Scroll progress bar.
      gsap.to(".nav-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      })

      // Condense into a glass bar once the page has scrolled.
      ScrollTrigger.create({ start: 40, end: "max", toggleClass: { targets: ".site-nav", className: "is-scrolled" } })

      // Hide on scroll down, reveal on scroll up.
      const showNav = gsap
        .from(".site-nav", { yPercent: -110, paused: true, duration: 0.45, ease: "power3.out" })
        .progress(1)
      ScrollTrigger.create({
        start: "top top-=160",
        end: "max",
        onUpdate: (self) => (self.direction === -1 ? showNav.play() : showNav.reverse()),
      })

      // Mobile menu: burger morphs to ✕, panel wipes in, content staggers up.
      menuTl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .to(".burger-top", { y: 3.5, rotate: 45, duration: 0.5 }, 0)
        .to(".burger-bot", { y: -3.5, rotate: -45, duration: 0.5 }, 0)
        .set(".mobile-menu", { display: "flex" }, 0)
        .fromTo(
          ".mobile-menu",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
          0,
        )
        .from(".mobile-link", { yPercent: 120, stagger: 0.07, duration: 0.9, ease: "expo.out" }, 0.45)
        .from(".mobile-meta", { y: 20, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: "power3.out" }, 0.7)
    },
    { scope: root },
  )

  // Sliding indicator: follows the hovered tab, rests on the active section.
  const moveTo = contextSafe((el: HTMLElement | null) => {
    if (!pill.current) return
    if (!el) {
      gsap.to(pill.current, { autoAlpha: 0, scale: 0.7, duration: 0.35, ease: "power3.out" })
      return
    }
    gsap.to(pill.current, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      autoAlpha: 1,
      scale: 1,
      duration: 0.6,
      ease: "expo.out",
    })
  })
  const activeTab = () => root.current?.querySelector<HTMLElement>(`[data-nav="${active}"]`) ?? null

  useGSAP(() => moveTo(activeTab()), { scope: root, dependencies: [active] })

  // Intro once the preloader lifts.
  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from(".nav-shell", { y: -24, autoAlpha: 0, scale: 0.9, duration: 1, ease: "expo.out", delay: 0.5 })
        gsap.from(".nav-tab", { yPercent: 120, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: "expo.out", delay: 0.7 })
        gsap.from(".nav-side", { autoAlpha: 0, x: 20, stagger: 0.1, duration: 0.8, delay: 0.9 })
      })

      // Track the section under the middle of the viewport.
      const sections = navItems.map((item) => [item, document.getElementById(item.toLowerCase())!] as const)
      const track = () => {
        const mid = window.innerHeight / 2
        const hit = sections.find(([, el]) => {
          const r = el.getBoundingClientRect()
          return r.top <= mid && r.bottom > mid
        })
        setActive(hit ? hit[0] : "")
      }
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: track, onRefresh: track })
    },
    { scope: root, dependencies: [ready] },
  )

  const toggleMenu = (open: boolean) => {
    setMenuOpen(open)
    ScrollSmoother.get()?.paused(open)
    if (open) menuTl.current?.timeScale(1).play()
    else menuTl.current?.timeScale(1.5).reverse()
  }

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    if (menuOpen) toggleMenu(false)
    scrollToTarget(id)
  }

  return (
    <div ref={root}>
      <header className="site-nav">
        <div className="site-nav__inner">
          <Logo ready={ready} onClick={(e) => go(e, "#top")} />

          {/* Desktop: floating pill with a sliding, colour-inverting indicator. */}
          <nav aria-label="Main" className="site-nav__menu">
            <ul
              className="nav-shell"
              onPointerLeave={() => moveTo(activeTab())}
            >
              <span
                ref={pill}
                className="site-nav__pill"
                aria-hidden="true"
              />
              {navItems.map((item, i) => (
                <li key={item} className="site-nav__item">
                  <a
                    href={`#${item.toLowerCase()}`}
                    data-nav={item}
                    aria-current={active === item ? "true" : undefined}
                    onClick={(e) => go(e, `#${item.toLowerCase()}`)}
                    onPointerEnter={(e) => moveTo(e.currentTarget)}
                    onFocus={(e) => moveTo(e.currentTarget)}
                    onBlur={() => moveTo(activeTab())}
                    className="nav-tab"
                  >
                    <RollText text={item} />
                    <span className="nav-tab__num">{pad(i)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-nav__actions">
            <span className="nav-side site-nav__clock">
              {CITY} <LocalTime />
            </span>
            <div className="nav-side site-nav__cta-wrap">
              <Magnetic strength={0.3}>
                <a
                  href="#contact"
                  onClick={(e) => go(e, "#contact")}
                  className="nav-cta"
                >
                  <span className="nav-cta__status">
                    <span className="nav-cta__ping" />
                    <span className="nav-cta__dot" />
                  </span>
                  <RollText text="Let's talk" />
                  <span className="nav-cta__arrow">
                    <ArrowUpRight size={16} />
                  </span>
                </a>
              </Magnetic>
            </div>

            {/* Mobile burger. */}
            <button
              className="burger"
              onClick={() => toggleMenu(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="burger-top" />
              <span className="burger-bot" />
            </button>
          </div>
        </div>

        <div className="nav-progress" />
      </header>

      {/* Mobile full-screen menu. */}
      <div
        id="mobile-menu"
        className="mobile-menu"
      >
        <div className="mobile-menu__glow" />
        <p className="mobile-meta mobile-menu__label">Menu</p>

        <ul className="mobile-menu__list">
          {navItems.map((item, i) => (
            <li key={item} className="mobile-menu__item">
              <a
                href={`#${item.toLowerCase()}`}
                onClick={(e) => go(e, `#${item.toLowerCase()}`)}
                className={`mobile-link${active === item ? " is-active" : ""}`}
              >
                <RollText text={item} gradient />
                <span className="mobile-link__num">{pad(i)}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-menu__bottom">
          <a href={socials.email} className="mobile-meta mobile-menu__email">
            {EMAIL}
          </a>
          <div className="mobile-meta mobile-menu__footer">
            <div className="mobile-menu__socials">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={isExternal(href) ? "_blank" : undefined}
                  rel={isExternal(href) ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="mobile-menu__social"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <span className="mobile-menu__clock">
              {CITY} <LocalTime />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
