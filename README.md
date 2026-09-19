# Dreweb — Premium Web Design & Development Agency Portfolio

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployment-F38020?style=flat&logo=cloudflare)](https://pages.cloudflare.com/)

**Dreweb** is a premium, state-of-the-art web design and software engineering agency portfolio. Built with visual excellence in mind, the platform delivers high-end aesthetics (sleek dark/light modes, curated HSL color systems, glassmorphism, responsive grids) coupled with buttery smooth performance and cutting-edge frontend features.

---

## ✨ Features

- **Premium Modern UI**: Vibrant gradients, custom backdrop-filters, interactive hover state micro-animations, and Outfit/Playfair typography.
- **High-Performance Motion**: Integrated with `motion` (Framer Motion) and `lenis` for smooth inertial scrolling and reveal-on-scroll animations.
- **Dynamic Local Landing Pages**: Programmatically structured Local SEO templates (e.g., `/locations/indore/website-development`) optimized to convert and rank on search engines.
- **Advanced Media Library**: Upload, search, filter, and manage rich assets (images, videos, documents) in a clean admin layout.
- **Custom Local CMS Backend**: Local dev server integrates custom API syncing to seamlessly persist content directly inside local JSON stores.
- **Enterprise-Ready SEO**: Comprehensive `react-helmet-async` header manipulation paired with structured JSON-LD schemas out-of-the-box.

---

## 🛠️ Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | React 19 & TypeScript | Strict type-safety, modern hooks, and state management. |
| **Build Tooling** | Vite 6 | Lightning-fast HMR and highly optimized production builds. |
| **Styling Engine** | Tailwind CSS v4 & Base UI | Utility-first styling with unstyled, highly accessible React primitives. |
| **Animations** | Motion & Lenis Scroll | Dynamic keyframes, spring physical-animations, and smooth scrolling. |
| **Analytics & Data** | Recharts | Interactive dashboards, SVG charts, and responsive layouts. |
| **Forms & Validation**| React Hook Form & Zod | Robust form state handlers and strict validation schemas. |
| **Hosting Platform** | Cloudflare Pages | Globe-spanning Edge CDN, DDoS protection, and serverless compute. |

---

## 📂 Project Structure

```text
dreweb-main/
├── .env.example          # Template for local environment variables
├── README.md             # Premium repository documentation
├── components.json       # Shadcn UI configuration
├── index.html            # Core entry shell
├── package.json          # Dependency and script definitions
├── tsconfig.json         # Strict TypeScript compiler options
├── vite.config.ts        # Vite config with custom local CMS sync middlewares
└── src/
    ├── components/       # Reusable layout and custom motion primitives
    │   ├── home/         # Showcase cards and hero sections
    │   ├── motion/       # FadeIn, TextReveal, ScaleIn wrappers
    │   └── ui/           # Shared UI elements (Button, Card, Dropdown, etc.)
    ├── pages/            # View components mapping routes
    │   ├── LocalLanding  # Dynamically matched local SEO content templates
    │   └── admin/        # Media and CMS dashboard interface
    └── lib/              # Database hooks, CRUD helper methods, and context
```

---

## 🚀 Local Development

Follow these steps to launch the local development environment:

### 1. Installation
Install project dependencies including developer-friendly utilities:
```bash
npm install
```

### 2. Run Dev Server
Launch Vite development server with local file-watching and API support:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 🔄 Understanding the Local CMS Sync Middleware
Dreweb uses an integrated dev server middleware to enable a seamless "no-database" content management experience.
- When saving pages or files, a `POST` request is sent to `/api/sync`.
- The Vite plugin inside `vite.config.ts` intercepts this, parses the payload, and writes the contents locally to `src/lib/db.json`.
- Changes are instantly reflected without needing a traditional database engine.

---

## ☁️ Cloudflare Pages Deployment

This project is tailored for lightning-fast deployments on **Cloudflare Pages** utilizing the official developer CLI **Wrangler**.

### SPA Routing & Redirects configuration
Because this is a Single Page Application (SPA) utilizing React Router client-side routing, page reloads on custom paths (like `/locations/indore`) would return `404 Not Found` on static hosts. 

We solve this using a `_redirects` file mapped at the root of our build directory `dist/`.
Our setup includes a **postbuild hook** in `package.json` that automatically compiles this:
```bash
# Generated on npm run build
/* /index.html 200
```

### Build & Deploy CLI Commands

#### 1. Compile the Application
Generate the production bundle with SPA redirects:
```bash
npm run build
```

#### 2. Local Wrangler Emulator
Preview the built production directory inside Cloudflare's exact local environment emulation:
```bash
npm run pages:dev
```

#### 3. Deploy to Cloudflare
Publish your latest build directly onto Cloudflare's global CDN:
```bash
npm run pages:deploy
```
*(Wrangler will guide you to log in to your Cloudflare account upon the first execution).*
# Dreweb
