# CLAUDE.md — LKL Cloud V2

## Project Overview

**LKLCloud** is a premium French cloud hosting provider website. This is the V2 frontend-only marketing site built with modern React. The site showcases hosting products (web, VPS, game servers), case studies, and legal pages. All content is in **French**. Light mode only (dark mode has been removed).

**Live site:** `https://lklcloud.fr`
**Live store (WHMCS):** `https://client.lklcloud.fr`

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| Vite | 7.2 | Build tool + dev server |
| TypeScript | 5.9 (strict) | Type safety |
| Tailwind CSS | 4.1 | Utility-first styling (v4 — uses `@theme` in CSS, NOT `tailwind.config.ts`) |
| Framer Motion | 12.33 | Animations & page transitions |
| React Router DOM | 7.13 | Client-side routing |
| Lenis | 1.3 | Smooth scrolling |
| Lucide React | 0.563 | Icon library |
| OGL | 1.0 | WebGL gradient background (Grainient component) |
| GSAP | 3.14 | Advanced animations |

### Dev Dependencies
- `@vitejs/plugin-react` — React SWC plugin
- `shadcn` 3.8 — Component generator (dev only)
- ESLint 9 + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`

---

## Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

**Build command** runs `tsc -b && vite build` — TypeScript errors break the build.

---

## TypeScript Configuration

- **Strict mode** enabled: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- Path alias: `@` → `./src` (configured in both `tsconfig.app.json` and `vite.config.ts`)
- Target: ES2022, Module: ESNext, JSX: react-jsx
- `verbatimModuleSyntax: true` — must use `import type` for type-only imports

### Strict Mode Tips
- `noUnusedLocals` is on — use `[, setter]` destructuring for unused state values
- Example: `const [, setScrolled] = useState(false)` if only the setter is used
- HeaderBubble.tsx uses `scrolled` and `announcementVisible` values directly in JSX, so they are not unused

---

## Design System & Theming

### Tailwind v4 Theme (defined in `src/index.css` `@theme` block)

**Fonts (self-hosted from `lklcloud.fr/fonts/`):**
- Sans: `Satoshi` (primary), fallback to `Inter`, system-ui
- Serif: `Instrument Serif` (accent/italic headings via `.font-accent`)
- `@font-face` declarations in `src/index.css` — weight mapping shifted lighter:
  - Regular (Satoshi-Regular.otf): weight `300-500`
  - Medium (Satoshi-Medium.otf): weight `600-700`
  - Bold (Satoshi-Bold.otf): weight `800`
  - Black (Satoshi-Black.otf): weight `900`

**Colors:**
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#FF6A30` | Main brand orange |
| `primary-light` | `#FF8F5E` | Hover states, lighter accents |
| `primary-dark` | `#E85A20` | CTA gradients, active states |
| `neutral-lightest` | `#FAFAFA` | Page background |
| `neutral-light` | `#F5F5F5` | Section backgrounds, hover |
| `neutral-gray` | `#E5E5E5` | Borders, dividers |
| `neutral-medium` | `#A3A3A3` | Secondary text, muted content |
| `neutral-dark` | `#171717` | Primary text, headings |

### Custom Utility Classes (defined in `@layer utilities` in `index.css`)

| Class | Description |
|---|---|
| `.glass` | Frosted glass: `bg-white/70 + blur(20px) + border-white/30` |
| `.glass-strong` | Stronger glass: `bg-white/85 + blur(30px) + border-white/50` |
| `.font-accent` | Instrument Serif italic |
| `.text-gradient` | Animated primary gradient text |
| `.animate-float` | 6s vertical float |
| `.animate-breathe` | 4s scale+opacity breathing |
| `.animate-breathe-slow` | 6s slow breathing |
| `.animate-breathe-glow` | 5s glow pulse |
| `.animate-pulse-orange` | 3s orange bg pulse |
| `.bg-breathe` | Pseudo-element radial breathing background |
| `.cta-shimmer` | 3s shimmer sweep on CTA buttons |
| `.cta-pulse` | 2.5s subtle scale pulse |
| `.card-idle-breathe` | 3.5s card scale breathing |
| `.card-border-glow` | 4s border glow cycle |
| `.shadow-dynamic` | 4s animated shadow |
| `.skeleton-shimmer` | 1.5s loading skeleton animation |

### Accessibility Modes (applied on `<html>`)
- `.high-contrast` — Darker neutral-medium (#666), darker primary (#E85A20), thicker glass borders
- `.font-sm` / `.font-md` / `.font-lg` — 14/16/18px base font size
- `.focus-mode` — Fades header/footer/`[data-focus-hide]` to 0.3 opacity
- `.reduce-motion` — Collapses all animations (also respects `prefers-reduced-motion`)

---

## Project Structure

```
src/
├── main.tsx                    # Entry point — provider tree
├── App.tsx                     # Router + lazy loading + AnimatePresence
├── index.css                   # Tailwind v4 + @theme + @font-face + utilities
├── types/
│   └── index.ts                # PricingPlan, ProductCategory, NavItem, FAQ, Testimonial
├── contexts/
│   ├── PreferencesContext.tsx   # Font size, contrast, motion, focus mode (ACTIVE)
│   ├── NotificationContext.tsx  # Toast notifications (ACTIVE)
│   └── ThemeContext.tsx         # DEAD CODE — dark mode removed, not mounted
├── hooks/
│   ├── useExitIntent.ts        # Cursor leaving viewport detection
│   ├── useIdleDetection.ts     # User inactivity detection
│   ├── useInView.ts            # Intersection Observer wrapper
│   ├── useKeyboardShortcuts.ts # Keyboard shortcut registry
│   ├── useLocaleDetection.ts   # Browser locale detection
│   ├── useLocalStorage.ts      # Typed localStorage hook
│   ├── useScrollPosition.ts    # Scroll Y position
│   ├── useSessionPersistence.ts # Session-scoped storage
│   └── useWebVitals.ts         # Core Web Vitals measurement
├── data/
│   ├── products.ts             # 13 product categories with plans, FAQs, use cases
│   ├── navigation.ts           # mainNavigation + productGroups
│   ├── team.ts                 # 4 team members (avatars from lklcloud.fr/images/team/)
│   ├── testimonials.ts         # Customer testimonials
│   ├── caseStudies.ts          # Case study content
│   ├── certifications.ts       # Trust/certification data
│   ├── faqs.ts                 # Global FAQ data
│   └── timeline.ts             # Company milestones
├── components/
│   ├── layout/
│   │   ├── Layout.tsx          # Main layout: Lenis smooth scroll, page transitions
│   │   ├── HeaderBubble.tsx    # Floating bubble navigation header (ACTIVE)
│   │   ├── Header.tsx          # UNUSED legacy header
│   │   ├── Footer.tsx          # Site footer with product/game/legal links
│   │   └── Logo.tsx            # Logo component (header/footer variants)
│   ├── sections/               # Homepage sections (21 files)
│   ├── ui/                     # Reusable UI components (90+ files)
│   ├── product/                # Product-specific components (16 files)
│   └── onboarding/
│       └── OnboardingOverlay.tsx # Nyx chatbot recommendation wizard
├── pages/
│   ├── Home.tsx                # Homepage composition
│   ├── CaseStudyPage.tsx       # Dynamic case study
│   ├── ComingSoon.tsx          # Placeholder for unreleased products
│   ├── NotFound.tsx            # 404 page
│   ├── products/
│   │   └── ProductCategory.tsx # Dynamic product page (/produits/:category)
│   └── legal/
│       ├── LegalLayout.tsx     # Shared legal page layout
│       ├── MentionsLegales.tsx
│       ├── CGV.tsx
│       ├── CGU.tsx
│       └── PolitiqueConfidentialite.tsx
├── assets/
│   └── images/team/            # Team member photos (unused — avatars now remote)
public/
├── images/
│   ├── logos/                  # Self-hosted tech logos (proxmox, intel, cloudflare, plesk, debian, ubuntu, windows, wisp)
│   └── og.png                  # OpenGraph image
├── sitemap.xml                 # 19 URLs with priorities
├── robots.txt                  # Crawl rules + blocked bots
├── .htaccess                   # HTTPS, SPA fallback, security headers, caching
└── manifest.json               # PWA manifest
```

---

## Provider Tree (`main.tsx`)

```
<StrictMode>
  <BrowserRouter>
    <PreferencesProvider>       ← font size, contrast, motion, focus mode
      <NotificationProvider>    ← toast notifications
        <App />                 ← ErrorBoundary + AnimatePresence + Routes + Layout
      </NotificationProvider>
    </PreferencesProvider>
  </BrowserRouter>
</StrictMode>
```

**Note:** `ThemeContext` / `ThemeProvider` exists but is NOT mounted — it's dead code from when dark mode was removed.

---

## Routing (`App.tsx`)

All routes use `lazy()` imports with a `<Suspense>` fallback (Skeleton grid). Routes are nested under `<Layout />`.

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Homepage |
| `/produits/:category` | `ProductCategory` | Dynamic product page (slug from `products.ts`) |
| `/etudes-de-cas/:id` | `CaseStudyPage` | Case study detail |
| `/mentions-legales` | `MentionsLegales` | Legal notice |
| `/cgv` | `CGV` | Terms of sale |
| `/cgu` | `CGU` | Terms of use |
| `/politique-confidentialite` | `PolitiqueConfidentialite` | Privacy policy |
| `/coming-soon` | `ComingSoon` | Placeholder for unreleased products |
| `*` | `NotFound` | 404 page |

**Note:** Coming-soon products (`comingSoon: true` in `products.ts`) redirect to `/coming-soon` via `<Navigate>` in `ProductCategory.tsx`.

---

## Layout Architecture (`Layout.tsx`)

```
<div class="min-h-screen flex flex-col">
  <ScrollProgress />          ← Thin orange progress bar at top
  <HeaderBubble />            ← Floating bubble navigation
  <main class="flex-1">
    <motion.div>              ← Page transition (opacity + y + blur)
      <Outlet />              ← Page content
    </motion.div>
  </main>
  <Footer />
  <GradientCursor />          ← Custom orange cursor glow effect
  <BackToTop />               ← Scroll-to-top button
  <QuickActions />            ← Floating action menu
  <NotificationContainer />   ← Toast notifications
  <PrintStyles />             ← Print-specific style injector
</div>
```

**Lenis smooth scroll:** Initialized on mount with `duration: 1.4`, exponential easing. On route change, scrolls to top instantly. Stored on `window.__lenis` for global access.

**Page transitions:** `opacity: 0 → 1`, `y: 20 → 0`, `filter: blur(6px) → blur(0px)`, 0.45s cubic-bezier `[0.22, 1, 0.36, 1]`.

---

## Navigation (`data/navigation.ts`)

### `mainNavigation` — Header nav items

```
Accueil → /
Serveurs Games → dropdown:
  ├── Serveur FiveM → /produits/fivem
  ├── Serveur Minecraft Java → /coming-soon (comingSoon)
  ├── Serveur Garry's Mod → /coming-soon (comingSoon)
  ├── Serveur ARK → /coming-soon (comingSoon)
  ├── Serveur Rust → /coming-soon (comingSoon)
  └── Serveur Hytale → /coming-soon (comingSoon)
Web Hosting → dropdown:
  ├── Web Plesk → /produits/plesk
  ├── Python Hosting → /produits/python
  └── Node.js Hosting → /produits/nodejs
Cloud Hosting → dropdown:
  ├── VPS KVM Linux → /produits/vps-linux
  ├── VPS Windows → /coming-soon (comingSoon)
  └── VPS Game → /coming-soon (comingSoon)
Contact → mailto:support@lklcloud.fr
```

### Dropdown badges
- Items with `comingSoon: true` show a "Prochainement" badge in desktop dropdowns
- In mobile: shorter "Bientôt" badge
- **Serveurs Games** dropdown uses `ml-auto` to align badges in parallel
- **Other dropdowns** (Cloud Hosting, etc.) use `ml-1.5` to keep badges close to text

### Dropdown color dots
| Group | Color |
|---|---|
| Serveurs Games | `bg-primary` (orange) |
| Web Hosting | `bg-blue-500` |
| Cloud Hosting | `bg-emerald-500` |

---

## Header (`HeaderBubble.tsx`)

The main navigation component. Features:
- **Scroll detection:** Adds `bg-white/80 backdrop-blur-xl` background when scrolled > 20px
- **Announcement bar:** Promotional banner — "En profiter" opens `DeployModal` via `onClick`
- **Desktop nav:** Centered glass pill with nav links, hover dropdowns with 150ms leave delay
- **Mobile nav:** Full-width slide-down panel with expandable groups (grid-cols-2)
- **Search:** Ctrl+K / Cmd+K opens `CmdKSearch` modal
- **CTA buttons:** "Espace Client" (login) and "Rejoignez-nous" (register) linking to WHMCS

---

## DeployModal (`components/ui/DeployModal.tsx`)

Shared modal for product range selection, used by **5 CTA buttons** across the site:
- Hero "Découvrir nos offres"
- Benefits "Déployer mon projet maintenant"
- About "Découvrir nos offres"
- CTASection "Commencer maintenant"
- AnnouncementBar "En profiter"

### Features
- 3 product ranges: Game Hosting, Cloud Hosting, App Hosting
- Active products link to their pages, coming-soon items show "Bientôt" badge
- `createPortal` to `document.body`, `AnimatePresence` for enter/exit
- Escape key closes, click outside closes
- **Scroll lock:** Sets `document.body.style.overflow = 'hidden'` AND calls `lenis.stop()` (Lenis bypasses CSS overflow)

### Props
```typescript
{ open: boolean; onClose: () => void }
```

---

## Products System (`data/products.ts`)

### Types (`types/index.ts`)

```typescript
interface PricingPlan {
  id: string
  name: string
  price: number                    // Monthly price
  priceQuarterly?: number          // Per-month price on quarterly billing
  priceYearly?: number             // Per-month price on yearly billing
  period: 'mois' | 'an'
  features: string[]               // Feature bullet points
  highlighted?: boolean            // Visually emphasized plan
  badge?: string                   // e.g. "Populaire", "Meilleur rapport"
  orderUrl?: string                // WHMCS order link
  specs: {
    ram: string                    // e.g. "4 Go RAM"
    cpu: string                    // e.g. "2 vCPU"
    storage: string                // e.g. "50 Go NVMe"
    bandwidth: string              // e.g. "10 Gbps"
  }
}

interface ProductCategory {
  slug: string                     // URL slug: /produits/{slug}
  name: string                     // Full name
  shortName: string                // Short display name
  description: string
  icon: string                     // Lucide icon name
  heroTitle: string
  heroDescription: string
  plans: PricingPlan[]
  faqs: FAQ[]                      // Product-specific FAQ
  useCases: string[]               // Use case examples
  comingSoon?: boolean             // Shows "Prochainement" badge + redirects to /coming-soon
}
```

### Product Catalog (13 categories)

| Slug | Name | Plans | Status | Order URL Pattern |
|---|---|---|---|---|
| `plesk` | Web Plesk | 3 (Orbit, Pulsar, Quasar) | Active | `/store/plesk/{plan}` |
| `python` | Hébergement Python | 3 (Viper, Mamba, Anaconda) | Active | `/store/python/{plan}` |
| `nodejs` | Hébergement Node.js | 3 (Pulse, Cipher, Flux) | Active | `/store/node-js/{plan}` |
| `vps-linux` | VPS KVM Linux | 6 (Iskra→Zenith) | Active | `/store/vps/{plan}` |
| `vps-windows` | VPS Windows | 4 | Coming Soon | — |
| `vps-game` | VPS Game | 3 | Coming Soon | — |
| `fivem` | Serveur FiveM | 6 (Lane→Overdrive) | Active | Not set yet |
| `minecraft` | Serveur Minecraft Java | 6 | Coming Soon | — |
| `garrysmod` | Serveur Garry's Mod | 6 | Coming Soon | — |
| `ark` | Serveur ARK | 3 | Coming Soon | — |
| `rust` | Serveur Rust | 3 | Coming Soon | — |
| `hytale` | Serveur Hytale | 3 | Coming Soon | — |

### Order URL Format
All order URLs point to WHMCS: `https://client.lklcloud.fr/index.php?rp=/store/{category}/{plan_name_lowercase}`

### VPS KVM Linux Plans (most recently updated)
| Plan | Price/mo | RAM | CPU | Storage | Bandwidth |
|---|---|---|---|---|---|
| Iskra | €3.99 | 4 Go RAM | 2 vCPU | 30 Go NVMe | 10 Gbps |
| Impulse | €7.99 | 8 Go RAM | 4 vCPU | 60 Go NVMe | 10 Gbps |
| Momentum | €9.99 | 8 Go RAM | 4 vCPU | 80 Go NVMe | 10 Gbps |
| Keystone | €11.99 | 16 Go RAM | 6 vCPU | 120 Go NVMe | 10 Gbps |
| Aurora | €18.99 | 32 Go RAM | 8 vCPU | 200 Go NVMe | 10 Gbps |
| Zenith | €24.99 | 32 Go RAM | 8 vCPU | 300 Go NVMe | 10 Gbps |

---

## Product Page (`pages/products/ProductCategory.tsx`)

- **Coming-soon redirect:** `if (product?.comingSoon) return <Navigate to="/coming-soon" replace />`

Sections in order:
1. **Hero** — Breadcrumb + title + description + share buttons
2. **Pricing Grid** — `PricingCard` components in responsive grid
3. **Comparison Table** — `ComparisonTable` with specs only (features section removed)
4. **Use Cases** — "Exemples d'utilisation" with check icons
5. **FAQ** — Product-specific accordion (supports HTML in answers via `dangerouslySetInnerHTML`)
6. **Recently Viewed** — Previously visited products
7. **CTA** — Contact section

### Floating TOC
A `FloatingTOC` component provides sticky navigation between product page sections.

---

## Key Components

### `PricingCard` (`components/ui/PricingCard.tsx`)
- Shows plan name, price (with billing cycle toggle if quarterly/yearly available), features, specs
- `highlighted` plans get `z-10` and primary styling (no `lg:scale-105` — all cards are equal size)
- `ctaLink` prop defaults to WHMCS register URL

### `ComparisonTable` (`components/product/ComparisonTable.tsx`)
- Shows specs comparison (RAM, CPU, Storage, Bandwidth) in a table
- Dynamically detects if bandwidth field contains "base" to show "Bases SQL" instead
- CTA uses `plan.orderUrl` when available
- Features checklist section has been removed — specs only

### `Accordion` (`components/ui/Accordion.tsx`)
- FAQ accordion with animated expand/collapse
- **Uses `dangerouslySetInnerHTML`** for answer rendering to support HTML links
- Link styles: `[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary-dark`

### `CmdKSearch` (`components/ui/CmdKSearch.tsx`)
- Global search modal triggered by Ctrl+K / Cmd+K or search icon
- Searches across products, pages, navigation

### `AnnouncementBar` (`components/ui/AnnouncementBar.tsx`)
- Link prop supports both `href` (renders `<a>`) and `onClick` (renders `<button>`)

### `Grainient` (`components/ui/Grainient.tsx`)
- WebGL gradient background using OGL
- **Known issues:**
  - `hexToRgb` only supports 6-char hex — MUST strip alpha from 8-char hex like `#ff5100ff`
  - Canvas sizing race condition: uses window dimensions as fallback + multiple retries
  - After `renderer.setSize()`, must force `canvas.style.width/height = '100%'`

---

## Homepage Structure (`pages/Home.tsx`)

Sections rendered in order:
1. `Hero` — Main hero with Grainient background, CTA opens DeployModal
2. `SectionDivider`
3. `HorizontalShowcase` — Product showcase with scroll-lock card swap
4. `SectionDivider`
5. `Benefits` — Feature benefits, CTA opens DeployModal
6. `SectionDivider`
7. `About` — About the company, CTA opens DeployModal
8. `SectionDivider`
9. `Testimonials` — Customer testimonials (with warm glow)
10. `SectionDivider`
11. `TeamSection` — Team members (with accent light)
12. `SectionDivider`
13. `HomeFAQ` — General FAQ (with subtle warm light)
14. `SectionDivider`
15. `CTASection` — Final call to action, CTA opens DeployModal

Each section is wrapped in `RevealSection` with different animations (`fadeUp`, `fadeScale`, `slideLeft`). Decorative gradient blobs (`bg-primary/[0.04]`, `bg-blue-400/[0.03]`, etc.) are positioned around sections.

---

## HorizontalShowcase (`components/sections/HorizontalShowcase.tsx`)

Scroll-lock product showcase section ("Nos solutions").

### Scroll-lock mechanism
- `IntersectionObserver` at threshold `0.5` triggers lock
- **Lock:** Instantly snaps to section top (no smooth scroll — avoids race conditions), stops Lenis, sets `overflow: hidden`, adds `forcePosition` scroll guard
- **Unlock:** After reaching first/last card, releases scroll, restarts Lenis
- Cooldown of 600ms between unlock and re-lock
- Handles both `wheel` and `touchmove` events for card swaps

### Responsive behavior
- **Desktop (lg+):** Full experience with CardSwap visual (left) + text content (right) in 2-column grid
- **Mobile (<lg):** CardSwap visual column hidden (`hidden lg:block`), but scroll-lock + card swap still active for the indicator rectangle and progress dots

---

## Onboarding System (`components/onboarding/OnboardingOverlay.tsx`)

**Nyx** — An AI chatbot overlay that recommends products based on user needs.

### Flow (5 phases)
1. **Welcome** → "Oui" / "Plus tard"
2. **Project type** → Site web, Application web, Serveur de jeu, API/Backend
3. **Detail** (varies by type) → Visitor count / Tech stack / Game name / API load
4. **Technical level** → Beginner, Intermediate, Expert
5. **Budget** → <5€, 5-15€, 15-30€, >30€/mois

### Trigger Logic
- Skips if `localStorage.getItem('lkl_onboarding_completed_v2')` exists
- Waits for cookie consent resolution (never shows simultaneously with cookie banner)
- After cookies resolved: waits for `lkl-loader-dismissed` event, then shows after 1750ms delay
- Stores completion at `lkl_onboarding_completed_v2`

---

## Cookie Consent

- Component: `components/ui/CookieConsent.tsx`
- Storage key: `lkl_cookie_consent`
- Dispatches `'lkl-cookies-resolved'` custom event when user accepts/refuses
- OnboardingOverlay listens for this event before showing

---

## Cinematic Loader (`index.html`)

Pure CSS + vanilla JS loader that runs before React hydration:
1. **Idle state:** Logo breathing animation + SVG orbital spinner (3 orbits + dot)
2. **Phase 1 (550ms):** Logo zooms to 12x scale and fades, spinner hides
3. **Phase 2 (650ms):** Curtain halves slide left/right off screen
4. **Cleanup:** Removes loader DOM, removes `body.loading`, dispatches `lkl-loader-dismissed`, content fades in via `content-reveal` animation
- Minimum display: 900ms
- Fallback: Force dismiss after 3500ms if `window.load` never fires
- Respects `prefers-reduced-motion`
- Registers service worker at `/sw.js`

---

## SEO (`index.html` + `public/`)

### index.html
- Title: "LKLCloud — Votre nouvel hébergeur français, haute performance"
- Full OpenGraph + Twitter Card meta tags
- JSON-LD structured data: Organization (with founders), WebSite, ItemList (product offerings)
- Geo targeting (FR), theme color `#FF6A30`

### public/sitemap.xml
- 19 URLs with priorities: homepage (1.0), active products (0.9), coming-soon (0.5), case studies (0.7), legal (0.3)

### public/robots.txt
- Allow all except `/coming-soon`, references sitemap
- Blocked bots: AhrefsBot, SemrushBot, MJ12bot

### public/.htaccess
- HTTPS force, www→non-www redirect, SPA fallback
- Security headers: X-Content-Type-Options, X-Frame-Options, HSTS, CSP, Referrer-Policy
- Gzip compression, browser caching (1 year for hashed assets)

---

## Footer (`components/layout/Footer.tsx`)

4-column grid layout:
1. **Brand** — Logo + tagline + social links (Instagram, Discord, LinkedIn)
2. **Produits** — Web Plesk, VPS KVM Linux, VPS Windows, VPS Game, Python, Node.js
3. **Jeux** — FiveM, Minecraft, Garry's Mod, ARK, Rust, Hytale
4. **Légal & Support** — Legal pages + Newsletter signup form

---

## Team (`data/team.ts`)

| Name | Role |
|---|---|
| Kylian T. | Président |
| Lorenzo S. | Vice-Président |
| Maxime C. | Responsable Global |
| Loeiz D. | Responsable Infrastructure |

Avatars loaded from `https://lklcloud.fr/images/team/` (kylian.jpeg, lorenzo.jpeg, maxime.jpeg, loeiz.jpg).

---

## Tech Logos (`Hero.tsx`)

All logos self-hosted in `public/images/logos/` and displayed with `brightness-0 opacity-60` (grayscale):
- proxmox.svg, intel.svg, cloudflare.svg, plesk.svg, debian.svg, ubuntu.svg, windows.svg, wisp.png

---

## External Links

| Destination | URL |
|---|---|
| Client Area (login) | `https://client.lklcloud.fr/clientarea.php` |
| Register | `https://client.lklcloud.fr/register.php` |
| Store (orders) | `https://client.lklcloud.fr/index.php?rp=/store/{category}/{plan}` |
| Contact email | `support@lklcloud.fr` |
| Instagram | `https://instagram.com/lklcloud` |
| Discord | `https://discord.gg/lklcloud` |
| LinkedIn | `https://linkedin.com/company/lklcloud` |

---

## Important Conventions

### Imports
- Use `@/` path alias for all src imports
- Framer Motion: `import { motion } from 'framer-motion'` (NOT `motion/react` — only `framer-motion` package is installed)
- Use `import type` for type-only imports (required by `verbatimModuleSyntax`)

### Styling
- Tailwind v4: theme is in `@theme` block in CSS, NOT in a config file
- Use `.glass` and `.glass-strong` for frosted glass effects
- Primary gradient for CTAs: `bg-gradient-to-r from-primary to-primary-dark`
- All text uses `text-neutral-dark` (headings) or `text-neutral-medium` (body/secondary)
- No dark mode classes — light mode only

### Lenis Scroll Control
- Access via `window.__lenis` (typed as `{ stop, start, scrollTo }`)
- **Any modal/overlay** that blocks scroll MUST call `lenis.stop()` on open and `lenis.start()` on close
- `document.body.style.overflow = 'hidden'` alone is NOT enough (Lenis bypasses it)

### Components
- Prefer editing existing components over creating new ones
- All pages are lazy-loaded via `React.lazy()`
- FAQ answers support HTML content (rendered via `dangerouslySetInnerHTML`)
- `comingSoon` items show badges in nav and redirect to `/coming-soon` on product pages
- All CTA "discover" buttons open `DeployModal` instead of linking directly

### Locale
- All user-facing text is in French
- Currency: Euro (€), formatted with `toLocaleString('fr-FR')`
- Period: "mois" (month) or "an" (year)

### File Organization
- Layout components → `components/layout/`
- Reusable UI → `components/ui/`
- Homepage sections → `components/sections/`
- Product-specific → `components/product/`
- Page components → `pages/`
- Static data → `data/`
- TypeScript types → `types/index.ts`
- React contexts → `contexts/`
- Custom hooks → `hooks/`
