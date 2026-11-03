# Ahmed Al Malah — Portfolio

A bilingual personal portfolio for Ahmed Al Malah, built with React, TypeScript, and Vite. The site supports Arabic (RTL) and English (LTR), and presents skills, experience, community impact, collaborations, and contact information.

## Requirements

- Node.js 20 or newer
- npm

## Local development

```bash
npm ci
npm run dev
```

## Checks and production build

```bash
npm run lint
npm run build
npm run preview
```

`npm run lint` runs the TypeScript check. Vite writes production files to `dist/`; generated output and dependencies are excluded from Git.

## Project structure

- `src/` — application, bilingual content, components, and styles
- `public/` — static assets, favicon, robots.txt, and sitemap.xml
- `index.html` — document metadata and app entry point
- `vercel.json` — Vercel deployment configuration

The app does not require environment variables. External company logo sources and social links are defined in `src/data/portfolio.ts`.
