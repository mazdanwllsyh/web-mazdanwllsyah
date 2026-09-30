<div align="center">

# Mazda Nawallsyah

### Frontend Software Engineer — Based in Ambarawa, Central Java, ID

[![Live Website](https://img.shields.io/badge/Production-mazdaweb.bejalen.com-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mazdaweb.bejalen.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.7-5A0EF8?style=flat&logo=daisyui&logoColor=white)](https://daisyui.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443E38?style=flat)](https://github.com/pmndrs/zustand)

A high-performance personal portfolio focused on Core Web Vitals, accessibility, and dynamic CMS integration. Built to be fast for everyone.

<br />

<img src="https://res.cloudinary.com/dr7olcn4r/image/upload/w_1200,c_fill,q_auto,f_auto/v1761989348/portfolio_profile/portfolio_profile/MazdaN_Profile_Image_1761989345137.webp" width="500" style="border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);" alt="Mazda Nawallsyah Portfolio Banner" />

</div>

---

## Architectural Highlights

- **Instant Content Pipeline**: Heavy intro transitions are deferred via `requestIdleCallback` and `prefers-reduced-motion`. Content is available immediately for all users with LCP < 1s.
- **Granular Manual Chunking**: Tuned Rollup vendor splitting (`motion`, `routing`, `vendor`, `core`) via Vite to eliminate main-thread bottlenecks and keep the TBT.
- **Responsive Navigation Gestures**: Adaptive touch-drag boundaries using Framer Motion `domMax` with directional locks, scoped to tablet/mobile with 65% swipe threshold.
- **SEO-First Injection**: Dynamic meta handling + Schema.org JSON-LD (`WebSite`, `Person`, `ProfilePage`, `ItemList`) for rich results compliance.
- **Dedicated Management Console**: Isolated protected dashboard to manage projects, certifications, and career history via API.

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Core** | React 19, Vite, ESNext |
| **State** | Zustand (site, portfolio, project stores) |
| **Styling & UI** | Tailwind CSS v4, DaisyUI 5.7, Custom SVG Auras |
| **Motion** | Framer Motion (`LazyMotion`) |
| **Data & Auth** | Axios, Google Identity Services (FedCM) |
| **Media** | Cloudinary CDN (auto WebP/AVIF) |
| **SEO** | JSON-LD, Sitemap, Self-hosted Typography |

## Project Structure

```bash
src/
├── components/
│   ├── Dashboard/       # Admin console UI
│   ├── LandingPage/     # Hero, Skills, Gallery, etc.
│   ├── ErrorBoundary/   # Crash containment
│   └── Transition.jsx   # Graceful loading with idle defer
├── hooks/               # Auth, pagination, notifications
├── routes/              # Protected route wrappers
├── stores/              # Zustand centralized stores
├── utils/               # Axios & Cloudinary helpers
└── App.jsx              # App orchestration & performance guards
