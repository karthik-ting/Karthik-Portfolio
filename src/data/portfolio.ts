export const NAME = "Karthik Manche"
export const FIRST_NAME = "Karthik"
export const INITIALS = "KM"
export const TITLE = "Software Developer & Data Analyst"
export const LOCATION = "Navi Mumbai, India"
export const CITY = "Mumbai"
export const TIME_ZONE = "Asia/Kolkata"

export const EMAIL = "kartikmanche@gmail.com"
export const PHONE = "+91 93244 06997"

export const CV_PATH = "/Karthik-Manche-Resume.pdf"
export const CV_FILENAME = "Karthik-Manche-Resume.pdf"

/**
 * Add your profile URLs here. Empty links are hidden everywhere on the site.
 * e.g. linkedin: "https://www.linkedin.com/in/your-handle/"
 */
export const socials = {
  linkedin: "",
  github: "",
  email: `mailto:${EMAIL}`,
  phone: `tel:${PHONE.replace(/\s/g, "")}`,
}

export const navItems = ["About", "Experience", "Projects", "Skills", "Contact"] as const

export const roles = ["Software Developer", "Data Analyst", "Python Automator"]

export type Job = {
  company: string
  role: string
  period: string
  location: string
  current?: boolean
  points: string[]
  tags: string[]
}

export const experience: Job[] = [
  {
    company: "TING Works LLP",
    role: "Software Developer",
    period: "Sept 2025 — Present",
    location: "CSMT, Mumbai",
    current: true,
    points: [
      "Building full-stack web applications with Next.js and JavaScript, delivering responsive and performant user experiences.",
      "Wrote Python scripts for web scraping and task automation, streamlining data collection and significantly reducing manual effort.",
      "Developed backend functionality with Strapi CMS, integrated REST APIs and managed structured data in SQL databases.",
      "Collaborated on live client projects spanning REST APIs, deployment workflows and performance optimisation across the stack.",
    ],
    tags: ["Next.js", "JavaScript", "Python", "Strapi", "SQL", "REST APIs"],
  },
  {
    company: "Q-Spiders",
    role: "Java Full Stack Trainee",
    period: "Dec 2024 — May 2025",
    location: "Navi Mumbai",
    points: [
      "Developed web applications using Java, HTML, CSS, JavaScript and SQL.",
      "Implemented object-oriented programming concepts and backend logic through real-world projects.",
      "Strengthened problem-solving and debugging skills using data structures and algorithms.",
    ],
    tags: ["Java", "HTML", "CSS", "JavaScript", "SQL"],
  },
]

export const education = [
  {
    school: "Pillai College of Engineering",
    degree: "B.Tech in Electronics and Computer Science",
    score: "CGPI 6.99",
    period: "2021 — 2025",
    location: "Panvel, Maharashtra",
  },
  {
    school: "The South Indian Education Society",
    degree: "HSC, State Board of Maharashtra",
    score: "86.17%",
    period: "2019 — 2021",
    location: "Mumbai, Maharashtra",
  },
  {
    school: "The Andhra Education Society High School",
    degree: "SSC, State Board of Maharashtra",
    score: "78.80%",
    period: "2019",
    location: "Mumbai, Maharashtra",
  },
]

export const certifications = [
  { name: "Web Technology", issuer: "Q-Spiders", period: "May — July 2024" },
  { name: "SQL", issuer: "Q-Spiders", period: "May — July 2024" },
  { name: "Core Java", issuer: "Q-Spiders", period: "May — Sept 2024" },
]

export const coursework = [
  "Data Structures & Algorithms",
  "Database Management Systems",
  "Operating Systems",
  "Computer Networks",
  "Object Oriented Programming",
  "Data Analytics",
]

export const extracurricular = [
  "Creatives Head — PCE Students Council, Pillai College of Engineering",
  "Creatives Head — Alegria Committee, Pillai College of Engineering",
]

export type Project = {
  title: string
  kind: string
  description: string
  points: string[]
  tags: string[]
  image?: string
  link?: string
  github?: string
}

export const projects: Project[] = [
  {
    title: "Crime Analytics Dashboard",
    kind: "Data Analytics",
    description:
      "An end-to-end crime analytics solution: large crime datasets cleaned and transformed in Python, then explored through interactive Power BI dashboards.",
    points: [
      "Cleaned and transformed large crime datasets with Python and Pandas.",
      "Power BI dashboards for crime trends, hotspot locations, categories and yearly statistics.",
      "SQL extraction plus an automated preprocessing pipeline for faster reporting.",
    ],
    tags: ["Python", "Pandas", "SQL", "Power BI"],
  },
  {
    title: "Climate Risk & Flood Assessment",
    kind: "Data Analytics",
    description:
      "A climate risk screening pipeline that combines environmental and rainfall data to evaluate regional flood vulnerability.",
    points: [
      "Data cleaning, feature engineering and EDA with Pandas and NumPy.",
      "Power BI dashboards visualising rainfall trends and flood-prone regions.",
      "Automated reports to support planning decisions.",
    ],
    tags: ["Python", "Pandas", "NumPy", "Power BI"],
  },
  {
    title: "Campus Cruise",
    kind: "Android App",
    description:
      "A campus navigation app built in Android Studio, helping students and visitors find their way between buildings and facilities.",
    points: [
      "Interactive campus map experience using WebView.",
      "Routes between buildings and facilities with step-by-step directions.",
      "Designed to make the on-campus experience easier for students and visitors.",
    ],
    tags: ["Java", "HTML", "CSS", "JavaScript"],
  },
]

export const skillClusters = [
  {
    title: "Languages",
    items: ["Python", "SQL", "JavaScript", "Java", "HTML", "CSS"],
  },
  {
    title: "Data Analytics",
    items: ["Pandas", "NumPy", "Power BI", "Excel", "Data Cleaning", "Data Visualization", "EDA"],
  },
  {
    title: "Web & Databases",
    items: ["Next.js", "REST APIs", "Strapi CMS", "Shopify", "WordPress", "MySQL"],
  },
  {
    title: "Dev Tools",
    items: ["VS Code", "Git", "GitHub", "Google Colab"],
  },
  {
    title: "Soft Skills",
    items: ["Problem Solving", "Debugging", "Collaboration", "Creative Direction", "Fast Learner"],
  },
]

/** Devicon slugs used by the floating background and the skill icons. */
export const techIcons: { slug: string; name: string; variant?: string }[] = [
  { slug: "python", name: "Python" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "java", name: "Java" },
  { slug: "html5", name: "HTML" },
  { slug: "css3", name: "CSS" },
  { slug: "mysql", name: "MySQL" },
  { slug: "nextjs", name: "Next.js" },
  { slug: "pandas", name: "Pandas" },
  { slug: "numpy", name: "NumPy" },
  { slug: "jupyter", name: "Jupyter" },
  { slug: "wordpress", name: "WordPress", variant: "plain" },
  { slug: "git", name: "Git" },
  { slug: "github", name: "GitHub" },
  { slug: "vscode", name: "VS Code" },
  { slug: "androidstudio", name: "Android Studio" },
  { slug: "nodejs", name: "Node.js" },
]

/** Logos that are black and need inverting on the dark theme. */
export const INVERT_ICONS = new Set(["nextjs", "github"])

export const deviconUrl = (slug: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${variant}.svg`
