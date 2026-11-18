import type { ReactNode } from "react"
import { BarChart3, Code2, Rocket } from "lucide-react"

/** Shared About content: used by the desktop scene (About.tsx) and the mobile stories. */

export const MOTTO = "Clean data. Clean code."

export const pillars = [
  {
    Icon: BarChart3,
    title: "Analyse",
    text: "Clean, transform and explore data with Python, Pandas and SQL, then tell its story in Power BI.",
  },
  {
    Icon: Code2,
    title: "Build",
    text: "Full-stack web apps with Next.js, JavaScript, Strapi CMS and REST APIs that are responsive and fast.",
  },
  {
    Icon: Rocket,
    title: "Automate",
    text: "Python scripts for scraping and repetitive tasks, so teams spend time on decisions, not data entry.",
  },
]

export const strengths = ["Full-stack web", "Data analytics", "Automation"]
export const stack = [
  { slug: "python", name: "Python" },
  { slug: "nextjs", name: "Next.js", invert: true },
  { slug: "javascript", name: "JavaScript" },
  { slug: "mysql", name: "MySQL" },
]

// Editor colours are fixed (code editors stay dark in both themes).
const K = ({ children }: { children: ReactNode }) => <span className="tok-keyword">{children}</span>
const V = ({ children }: { children: ReactNode }) => <span className="tok-var">{children}</span>
const P = ({ children }: { children: ReactNode }) => <span className="tok-punct">{children}</span>
const S = ({ children }: { children: ReactNode }) => <span className="tok-string">{children}</span>
const key = (k: string) => <span className="tok-key">{k}</span>

/** One line of code per piece of the profile card it renders (C++-flavoured). */
export const LINES: ReactNode[] = [
  <>
    <K>auto</K> <V>karthik</V> <P>=</P> <K>Profile</K>
    <P>{"{"}</P>
  </>,
  <>
    {"    "}
    <P>.</P>
    {key("role")}
    <P> = </P>
    <S>&quot;Software Developer &amp; Data Analyst&quot;</S>
    <P>,</P>
  </>,
  <>
    {"    "}
    <P>.</P>
    {key("based")}
    <P> = </P>
    <S>&quot;Navi Mumbai, India&quot;</S>
    <P>,</P>
  </>,
  <>
    {"    "}
    <P>.</P>
    {key("strengths")}
    <P> = {"{"}</P>
    <S>&quot;Web&quot;</S>
    <P>, </P>
    <S>&quot;Data&quot;</S>
    <P>, </P>
    <S>&quot;Automation&quot;</S>
    <P>{"},"}</P>
  </>,
  <>
    {"    "}
    <P>.</P>
    {key("stack")}
    <P> = {"{"}</P>
    <S>&quot;Python&quot;</S>
    <P>, </P>
    <S>&quot;Next.js&quot;</S>
    <P>, </P>
    <S>&quot;JS&quot;</S>
    <P>, </P>
    <S>&quot;SQL&quot;</S>
    <P>{"},"}</P>
  </>,
  <>
    {"    "}
    <P>.</P>
    {key("motto")}
    <P> = </P>
    <S>&quot;{MOTTO}&quot;</S>
    <P>,</P>
  </>,
  <>
    <P>{"};"}</P>
  </>,
]
