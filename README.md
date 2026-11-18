# Karthik Manche · Portfolio

Personal portfolio of **Karthik Manche**, Software Developer & Data Analyst based in Navi Mumbai, India.

Built with **Next.js 15**, **React 19**, **TypeScript**, **SCSS** (see `src/styles/`) and **GSAP** (ScrollSmoother, SplitText, ScrambleText and ScrollTrigger).

## Sections

- **Hero**: intro, rotating roles and a profile card
- **About**: an animated `about.py` code card that renders a profile, plus how I work (Analyse → Build → Automate)
- **Experience & Education**: work timeline, education, certifications, coursework and leadership
- **Projects**: Crime Analytics Dashboard, Climate Risk & Flood Assessment, Campus Cruise
- **Tech Stack**: interactive orbiting skills "galaxy"
- **Contact**: enquiry form (via FormSubmit) and direct links
- **/cv**: in-site resume viewer with download

## Editing content

Almost everything lives in [`src/data/portfolio.ts`](src/data/portfolio.ts): name, contact details, social links, experience, education, projects and skills.

- Add your LinkedIn / GitHub URLs in `socials` (empty links are hidden).
- Replace `public/Karthik-Manche-Resume.pdf` to update the resume.
- Add a project screenshot by putting an image in `public/` and setting `image: "/your-image.png"` on the project.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

- **Vercel**: import the repo, no configuration needed.
- **GitHub Pages**: `npm run build:pages` produces a static export served from `/karthik-portfolio` (see `next.config.ts` and `.github/workflows/deploy-pages.yml`).

## Credits

Originally based on an open-source MIT-licensed portfolio template; see [LICENSE](LICENSE).
