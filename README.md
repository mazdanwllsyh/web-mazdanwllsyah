<div align="center">

# Mazda Nawallsyah

### Frontend Software Engineer — Based in Ambarawa, ID

[![Live Website](https://img.shields.io/badge/Production-mazdaweb.bejalen.com-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mazdaweb.bejalen.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.7-5A0EF8?style=flat&logo=daisyui&logoColor=white)](https://daisyui.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443E38?style=flat)](https://github.com/pmndrs/zustand)

A high-performance personal portfolio built with modern client-side rendering optimizations, dynamic CMS integration, structured data validation, and progressive crawler accessibility.

<br />

<img src="https://res.cloudinary.com/dr7olcn4r/image/upload/w_1200,c_fill,q_auto,f_auto/v1761989348/portfolio_profile/portfolio_profile/MazdaN_Profile_Image_1761989345137.webp" width="500" style="border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);" alt="Mazda Nawallsyah Portfolio Banner" />

</div>

---

## Architectural Highlights

- **Progressive Crawler Hydration**: Lightweight lifecycle pipeline that skips non-critical introductory animations during headless crawler inspections, ensuring immediate DOM availability and zero render-blocking penalties.
- **Granular Manual Chunking**: Tuned Rollup vendor splitting (`motion`, `routing`, `vendor`, `core`) via Vite to eliminate main-thread bottlenecks and maintain optimal Core Web Vitals.
- **Responsive Navigation Gestures**: Adaptive touch-drag boundaries utilizing Framer Motion's `domMax` engine with directional locks, scoped strictly to tablet/mobile viewports with a 65% swipe threshold.
- **Micro-Engineered SEO Injection**: React-native dynamic meta injection paired with Schema.org JSON-LD structured data (`WebSite`, `Person`, `ProfilePage`, `ItemList`) for rich snippet compliance in Google Search Console.
- **Dedicated Management Console**: Fully isolated protected administrative dashboard to update projects, certifications, and career history dynamically via external API stores.

---

## Tech Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend Core** | React 19, Vite, ESNext |
| **State Management** | Zustand (Global site, portfolio, and project stores) |
| **Styling & UI Kit** | Tailwind CSS v4, DaisyUI 5.7, Custom SVG Auras |
| **Motion & Gestures** | Framer Motion (`LazyMotion` with dynamic `domMax` routing) |
| **Data & Auth** | Axios, Google Identity Services (FedCM / OAuth 2.0) |
| **Media Delivery** | Cloudinary CDN (Automated WebP/AVIF formatting, dynamic transforms) |
| **SEO & Diagnostics** | JSON-LD, Sitemap Generator, Self-hosted Typography |

---

## Project Structure

```bash
src/
├── components/          # Reusable UI primitives & section components
│   ├── Dashboard/       # Dedicated administration console UI & navigation
│   ├── LandingPage/     # Core portfolio landing modules (Hero, Skills, Gallery, etc.)
│   ├── ErrorBoundary/   # Crash containment with clipboard diagnostic utilities
│   └── Transition.jsx   # Micro-animation loader with graceful exit pipelines
├── hooks/               # Custom hooks (Auth, pagination, notifications)
├── routes/              # Protected admin route wrappers & layout routing
├── stores/              # Zustand centralized atomic state stores
├── utils/               # Axios instances & Cloudinary image transformation helpers
└── App.jsx              # App orchestration, global styling, & bot rendering checks
