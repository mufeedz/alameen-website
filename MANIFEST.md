# Al-Ameen School Redesign Manifest (Astro Migration)

This document outlines the brand guidelines, design system, color tokens, and proposed component architecture for migrating the Al-Ameen School website to [Astro](https://astro.build/).

## 1. Design System & Brand Guidelines

### 1.0 Visual Philosophy: Modern Traditionalism

The design language bridges classical Islamic heritage with contemporary educational aesthetics. Every visual decision should feel **timeless yet approachable** — rooted in tradition, optimized for today's screens.

**Core principles:**
- Use Girih (Islamic geometric tiling) patterns as low-opacity (`3–8%`) SVG backgrounds on section containers, never as foreground decoration.
- Reserve ornamentation for structural elements: section headers, hero overlays, dividers.
- Maintain generous whitespace; do not let patterns compete with content.
- All decorative elements must degrade gracefully at small viewport sizes.

---

### 1.1 Color Palette

> **Token format for Astro:** Define all tokens in `src/styles/tokens.css` under `:root {}`.

**Core Brand**
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#064E3B` | Deep Emerald — primary brand color, nav, headers |
| `--color-primary-dark` | `#043D2E` | Darker emerald for hover states & pressed buttons |
| `--color-primary-light` | `#065F46` | Slightly lighter for gradients |
| `--color-accent` | `#D4AF37` | Metallic Gold — CTAs, badges, highlights, borders |
| `--color-accent-light` | `#E8D07A` | Soft gold for backgrounds and hover fills |
| `--color-accent-dark` | `#B8960C` | Deep gold for active/pressed states |

**Backgrounds & Surfaces**
| Token | Value | Usage |
|---|---|---|
| `--color-base` | `#F9F9F9` | Warm Paper White — page background |
| `--color-surface` | `#FFFFFF` | Pure white — card and modal surfaces |
| `--color-surface-alt` | `#F3F4EE` | Warm off-white — alternating section backgrounds |
| `--color-separator` | `#E4E4D8` | Warm gray — dividers and borders |

**Text**
| Token | Value | Usage |
|---|---|---|
| `--color-text` | `#1C1C1C` | Near-black — primary body text |
| `--color-text-muted` | `#5A5A5A` | Medium gray — secondary/helper text |
| `--color-text-on-dark` | `#F9F9F9` | Light text on emerald/dark surfaces |

**Status & Utility**
| Token | Value | Usage |
|---|---|---|
| `--color-alert` | `#C0392B` | Error/urgent notices |
| `--color-success` | `#1A7F4B` | Confirmation states |

---

### 1.2 Typography

The type system pairs a traditional Arabic-heritage serif for headings with a clean, highly-legible Latin sans-serif for body text and UI.

**Google Fonts import (in `BaseLayout.astro`):**
```html
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Reem+Kufi:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Type Scale**
| Token | Font Family | Size (clamp) | Weight | Usage |
|---|---|---|---|---|
| `--font-heading` | `'Reem Kufi', serif` | — | 600–700 | Page titles, section headings |
| `--font-display` | `'Amiri', serif` | — | 400–700 | Hero display text, pull quotes |
| `--font-body` | `'Inter', sans-serif` | — | 300–600 | All body copy, nav, UI labels |
| `--font-size-h1` | — | `clamp(1.75rem, 5vw, 3rem)` | — | Hero / page title |
| `--font-size-h2` | — | `clamp(1.4rem, 3.5vw, 2.25rem)` | — | Section headings |
| `--font-size-h3` | — | `clamp(1.15rem, 2.5vw, 1.6rem)` | — | Card/subsection titles |
| `--font-size-body` | — | `clamp(0.9375rem, 2vw, 1.0625rem)` | — | Paragraphs |
| `--font-size-small` | — | `0.8125rem` | — | Labels, captions |

**Rendering note:** Amiri renders beautifully at large sizes but can appear heavy at small sizes — use it exclusively at h1/hero/display sizes. Default all h2–h4 to Reem Kufi.

---

### 1.3 Spacing & Layout

A consistent 4px-base unit scale.

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

**Section rhythm:**
* Desktop section padding Y: `--space-16` (64px)
* Mobile section padding Y: `--space-12` (48px)
* Card internal padding: `--space-6` (24px)
* Card gap in grids: `--space-6` (24px)

**Border Radius:**
* `--radius-sm: 4px` — inputs, small badges
* `--radius-md: 10px` — cards, buttons
* `--radius-lg: 20px` — modals, feature containers
* `--radius-arch: 50% 50% 0 0 / 60% 60% 0 0` — Islamic arch shape (see §1.5)

**Shadows** (warm-tinted for the paper-white surface):
```css
--shadow-sm: 0 1px 3px rgba(6, 78, 59, 0.06);
--shadow-md: 0 4px 12px rgba(6, 78, 59, 0.08), 0 1px 4px rgba(6, 78, 59, 0.04);
--shadow-lg: 0 12px 30px rgba(6, 78, 59, 0.12), 0 4px 8px rgba(6, 78, 59, 0.06);
```

---

### 1.4 Mobile-First Performance Guidelines

> **Target device:** Mid-range Android (e.g., Motorola Edge) — ~4GB RAM, 60Hz display, variable network (4G/LTE).

**Breakpoints (mobile-first):**
```css
/* Default: 0–479px (small phones) */
/* sm:  480px  — larger phones */
/* md:  768px  — tablets / landscape phones */
/* lg:  1024px — small laptops */
/* xl:  1280px — desktops */
```

**Performance targets:**
* **LCP (Largest Contentful Paint):** < 2.5s on 4G
* **CLS (Cumulative Layout Shift):** < 0.1
* **Total page JS (initial load):** < 80KB gzipped
* **Hero image:** Serve WebP ≤ 200KB at mobile widths using Astro's `<Image>` with `widths={[480, 768, 1280]}` and `sizes` attribute.
* **Fonts:** Use `display=swap` + `<link rel="preload">` for Inter and Reem Kufi. Amiri is display-only — load with `font-display: optional` to prevent CLS.
* **Girih SVG patterns:** Inline as `<svg>` data URIs in CSS `background-image` — no additional network requests.
* **No Swiper on mobile home below the fold:** Defer hero slider JS with `client:visible` in Astro.

**Touch targets:** All interactive elements minimum `44×44px` to satisfy WCAG 2.1 AA and improve tap accuracy on glass screens.

---

### 1.5 Decorative Motifs

#### Girih Geometric Patterns
Use SVG-based Girih tiling as CSS backgrounds. Keep opacity between `3%–8%` depending on surface color.

```css
/* Example — section with Girih background */
.section-girih {
  background-color: var(--color-surface-alt);
  background-image: url("data:image/svg+xml,..."); /* Inline Girih SVG */
  background-size: 120px 120px;
  background-repeat: repeat;
  opacity: 1; /* pattern opacity controlled inside SVG fill */
}
```

Create a reusable `<GirihPattern />` Astro component that renders the inline SVG and accepts `opacity` and `color` props.

#### Islamic Arch Motifs (Hero & Gallery)
Use CSS `clip-path` and `border-radius` to create pointed-arch (ogee) image containers — no extra markup required.

```css
/* Approach A — CSS border-radius arch (subtle, widely supported) */
.arch-container {
  border-radius: 50% 50% 0 0 / 60% 60% 0 0;
  overflow: hidden;
}

/* Approach B — CSS clip-path pointed arch (sharp, decorative) */
.arch-clip {
  clip-path: polygon(
    0% 100%, 0% 35%, 50% 0%, 100% 35%, 100% 100%
  );
}

/* Approach C — SVG mask for complex ogee arch */
.arch-mask {
  -webkit-mask-image: url('/masks/ogee-arch.svg');
  mask-image: url('/masks/ogee-arch.svg');
  -webkit-mask-size: cover;
  mask-size: cover;
}
```

**Recommendation:**
* **Hero section:** Use **Approach A** (border-radius arch) on hero image containers — high GPU-composited performance, no paint jank on mid-range Android.
* **Gallery grid:** Use **Approach C** (SVG mask) for featured large images; regular grid thumbnails use standard `border-radius: var(--radius-md)`.
* **Store SVG masks** in `public/masks/` as static assets — Astro passes them through verbatim.

**Astro component API:**
```astro
<!-- Usage -->
<ArchImage src={heroImage} alt="School campus" variant="hero" />
<ArchImage src={galleryImage} alt="Students" variant="gallery" />
```

---

## 2. Astro Component Architecture

Migrating to Astro allows us to heavily componentize the UI and drastically improve loading performance using partial hydration (`client:load`, `client:idle`).

### 2.1 Layouts (`src/layouts/`)
* **`BaseLayout.astro`**: Main shell including `<head>`, SEO metadata, global fonts, Header, and Footer.
* **`ContentLayout.astro`**: Wrapper for markdown/MDX pages (e.g., policy pages).

### 2.2 Core UI Components (`src/components/ui/`)
These represent the atomic design system.
* **`Button.astro`**: Accepts `variant="primary" | "accent" | "outline"` and `size="sm" | "lg"`.
* **`Card.astro`**: Interactive container with hover effects.
* **`Typography.astro`**: Standardized headings and lead text.
* **`GeometricDivider.astro`**: SVG-based Islamic motifs and standard wave dividers.
* **`Badge.astro`**: For "Co-ed", "Girls Only", "New", etc.

### 2.3 Feature Components (`src/components/`)
* **`layout/Header.astro`**: Global navigation (migrated from `header.html`).
* **`layout/Footer.astro`**: Global footer (migrated from `footer.html`).
* **`home/HeroSlider.astro`**: Swiper integration (uses `client:load` for interactivity).
* **`home/StatsCounter.astro`**: Animated stat counts on scroll (`client:visible`).
* **`home/CampusHighlights.astro`**: Grid cards for Karungalpalayam & Ellapalayam campuses.
* **`events/EventList.astro`**: Extracts the current JS-based event logic into an API-driven or statically mapped list.
* **`ProcessFlow.astro`**: The step-by-step admissions or generic process UI.

### 2.4 Page Structure (`src/pages/`)
Each `.html` file maps to an Astro page:
* `index.astro`
* `about.astro`
* `academics.astro`
* `admissions.astro`
* `campuses.astro`
* `events.astro`
* `gallery.astro`
* `contact.astro`

### 2.5 State & Script Management
* **Global CSS:** Move `variables.css`, `design-system.css`, and `main.css` to `src/styles/global.css`.
* **Interactivity:** Component-level `<script>` tags in Astro for isolated behaviors (like Swiper initialization).
* **Optimization:** Use Astro's built-in `<Image />` component for automatic localized image optimization (WebP/AVIF output) to manage `assets/images/`.

---

## 3. Migration Strategy

1. **Setup:** Initialize an Astro project matching this manifest.
2. **Global Assets:** Copy fonts, icons, CSS variables, and core styles into Astro.
3. **Layout Generation:** Translate `partials/header.html` and `partials/footer.html` into Astro components within `BaseLayout.astro`.
4. **Page by Page Translation:**
   - Componentize repeatable elements (Hero, Cards, Dividers).
   - Migrate `index.html` first.
   - Refactor JavaScript functionality (Swiper, Stats) into framework-agnostic component script tags.
5. **Optimization:** Replace `<img>` tags with Astro's `<Image>` for performance.
