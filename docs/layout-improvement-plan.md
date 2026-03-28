# Al-Ameen School Website — Layout, Performance & Structure Improvement Plan

**Branch:** `docs/layout-improvement-plan`
**Date:** 2026-03-28
**Scope:** Full audit of mobile layout gaps, performance, and structural issues

---

## Executive Summary

The codebase has three primary problem categories:

1. **Mobile layout gaps** — caused by divider `scaleY` transforms conflicting with contain, mixed spacing systems (`section` vs `section-system`), and Bootstrap `py-5` doubling up on custom section padding.
2. **Performance** — ~12.2 MB of unoptimized images on a static school website, duplicate font loading, three un-throttled scroll listeners, and JS-injected navigation causing FOUC.
3. **Structural / content issues** — broken logo image, wrong map coordinates, missing CSS classes, sections floating outside their parent tags, and duplicated inline styles.

---

## Phase 1 — Critical Fixes (Mobile Gaps & Layout)

These are the highest-impact changes for the reported symptom of extra spaces on mobile.

### 1.1 Fix Divider scaleY / contain Mismatch

**Problem:** Every section divider uses `transform: scaleY(0.75)` on mobile combined with `contain: layout style`. The element's layout box stays at full CSS height (e.g. 24px for `section-divider-alt`) but the visual content shrinks to 18px, leaving 6px of transparent dead space below — this registers as a visible gap between sections.

**Root cause file:** `assets/css/dividers.css`

**Fix:** Instead of using `transform: scaleY()` to resize dividers, use actual CSS height changes per breakpoint. Remove `transform` and `contain` from dividers entirely; replace with responsive height values.

```css
/* BEFORE */
.section-divider, .section-divider-alt, .gradient-divider {
  transform: scaleY(var(--divider-scale-base));
  contain: layout style;
}

/* AFTER — set height directly via variables, no transform needed */
.section-divider { height: var(--divider-height-base); }
.section-divider-alt { height: var(--divider-height-alt); }
.gradient-divider { height: var(--gradient-divider-height); }
```

In the mobile media query (`max-width: 768px`), simply reduce `--divider-height-base`, `--divider-height-alt`, and `--gradient-divider-height`. Remove `--divider-scale-base` entirely.

Remove the `width: 100vw; margin-left: calc(-50vw + 50%)` full-bleed trick from dividers — it is only needed for visual fills that should span the full viewport, and the `section-divider-alt` (a plain gold line) and `gradient-divider` (a 6px bar) do not need to bleed outside the container. Only `section-divider` (the SVG geometric shape) benefits from full-bleed and should retain it.

### 1.2 Unify Section Padding on Mobile

**Problem:** Two distinct padding systems are in use:
- `section` HTML element selector → `padding: 0.75rem 0 1rem` on mobile
- `.section-system` class → `padding: 3rem 0` on mobile

This creates a 3–4× visual height difference between Admissions sections (3rem) and Home/About sections (0.75rem), making the layout feel inconsistent.

**Fix:** Adopt a single shared mobile section padding token and apply it consistently.

```css
/* In variables.css */
--section-padding-mobile: 2rem;

/* In dividers.css @media (max-width: 768px) */
section { padding: var(--section-padding-mobile) 0; }

/* In design-system.css @media (max-width: 768px) */
:root { --section-padding-y: var(--section-padding-mobile); }
```

This makes all sections use 2rem top+bottom padding on mobile regardless of whether they use `section` or `.section-system`.

### 1.3 Remove Double Padding from Bootstrap py-5 + section Rule

**Problem:** Sections using both the custom `section` CSS rule and Bootstrap's `py-5` class get no clash on desktop (Bootstrap `py-5` = 3rem wins over custom 1.25rem), but on mobile the `section` CSS override at 0.75rem conflicts with Bootstrap's `py-3` (1rem). The result is unpredictable spacing depending on specificity order.

**Affected elements:** `.why-choose-section.py-5`, `.campus-nav.py-5`, `.cta-banner.py-5`, `.mission-grid.py-4`, `.about-preview.section` (no py-X), `curriculum-overview.section.py-5`

**Fix:** Remove `py-4`/`py-5` Bootstrap utility classes from all `<section>` elements that already have custom padding controlled by the CSS `section` rule or a `.section-system` class. Let the CSS system own all section spacing.

```html
<!-- BEFORE -->
<section class="why-choose-section py-5 bg-light">

<!-- AFTER -->
<section class="why-choose-section bg-light">
```

Do this for all sections in: `index.html`, `about.html`, `academics.html`, `admissions.html`, `campuses.html`, `contact.html`, `events.html`, `gallery.html`.

### 1.4 Fix campuses.html Negative Margin on Footer

**Problem:** `<div id="footer-include" class="mt-n3">` pulls the footer up by 1rem, potentially overlapping the last `section-divider-alt` on the Campuses page.

**Fix:** Remove `mt-n3` class, and instead ensure the last `section-divider-alt` has `margin-bottom: 0`.

```html
<!-- BEFORE -->
<div id="footer-include" class="mt-n3">

<!-- AFTER -->
<div id="footer-include">
```

### 1.5 Add bg-neutral Utility Class

**Problem:** Multiple HTML elements use `class="... bg-neutral"` but no `.bg-neutral` CSS utility class exists. The class name refers to `--color-neutral: #f6f9fc` but that variable is never applied via a class.

**Fix:** Add to `assets/css/utilities.css`:
```css
.bg-neutral { background-color: var(--color-neutral); }
```

---

## Phase 2 — Performance Improvements

### 2.1 Convert Hero Slider Images to WebP with srcset

**Problem:** Three hero slider PNGs at ~1.1 MB each = ~3.3 MB total loaded eagerly on every home page visit (and campuses page). On mobile with a slower connection this adds 3–10+ seconds to first meaningful paint.

**Fix:**
- Convert `slider-1.png`, `slider-2.png`, `slider-3.png` to WebP at 1920px width (~80–150 KB each target) and a 768px mobile variant (~40–60 KB each).
- Use `<picture>` elements with `srcset` for responsive delivery.
- Keep PNG fallback for older browsers.

```html
<!-- BEFORE -->
<img src="assets/images/slider-1.png" class="d-block w-100" alt="...">

<!-- AFTER -->
<picture>
  <source srcset="assets/images/slider-1-mobile.webp" media="(max-width: 768px)" type="image/webp">
  <source srcset="assets/images/slider-1.webp" type="image/webp">
  <img src="assets/images/slider-1.png" class="d-block w-100" alt="..." loading="eager" fetchpriority="high">
</picture>
```

Only the first slide (slider-1) needs `fetchpriority="high"`. Slides 2 and 3 can use `loading="lazy"`.

**Estimated savings:** ~3.0 MB → ~0.3 MB (90% reduction) for hero images.

### 2.2 Convert Gallery Images to WebP with Lazy Loading

**Problem:** Eight gallery JPGs at ~1.1–1.2 MB each = ~8.9 MB total. Even with `loading="lazy"`, these are delivered as unoptimized JPEGs.

**Fix:**
- Convert to WebP at 800px width (~30–60 KB each target).
- `loading="lazy"` is already set — keep it.
- Add explicit `width` and `height` attributes to prevent layout shift (CLS).

**Estimated savings:** ~8.9 MB → ~0.4 MB (95% reduction).

### 2.3 Remove Duplicate Google Fonts Loading

**Problem:** Both `variables.css` (via `@import`) and every HTML `<head>` (via `<link>`) load Google Fonts. The CSS `@import` blocks rendering and loads Outfit + Noto Kufi Arabic. The HTML `<link>` loads Amiri + Noto Naskh Arabic. The result is 4 separate font families loaded across 2 mechanisms, with some duplication in requests due to browser caching behavior differences between `@import` and `<link>`.

**Fix:**
1. Remove the `@import` from `variables.css` entirely.
2. Consolidate all font families into a single `<link rel="preconnect">` + `<link rel="stylesheet">` in a shared HTML template (or the partials/header.html via JS injection).
3. Use `font-display: swap` (already in the Google Fonts URL — verify it's in the query string).

```html
<!-- Single consolidated font link in partials/header.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Outfit:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@400;700&display=swap">
```

Remove the individual `<link>` font tags from each HTML file's `<head>` and let the header partial handle it.

### 2.4 Throttle Scroll Event Listeners

**Problem:** Three files register `window.addEventListener('scroll', handler)` with no debouncing or `requestAnimationFrame` throttling:
- `scroll-reveal.js` — runs class additions on every scroll tick
- `stats-counter.js` — checks element visibility on every scroll tick
- `main.js` — back-to-top button visibility on every scroll tick

On mobile, scroll events fire at 60fps+, causing 3 callbacks per frame minimum. This can cause janky scrolling particularly on mid-range devices.

**Fix:** Wrap all scroll handlers in a shared `requestAnimationFrame` throttle utility:

```js
// In main.js — add utility function
function onScrollRAF(handler) {
  let ticking = false;
  return function () {
    if (!ticking) {
      requestAnimationFrame(function () { handler(); ticking = false; });
      ticking = true;
    }
  };
}
// Usage:
window.addEventListener('scroll', onScrollRAF(handleBackToTop));
```

Apply the same pattern in `scroll-reveal.js` and `stats-counter.js`.

Better long-term: replace the scroll-reveal pattern with `IntersectionObserver` (already partially done for stats-counter but scroll fallback is still there).

### 2.5 Migrate scroll-reveal.js to IntersectionObserver

**Problem:** `scroll-reveal.js` adds `reveal-section` / `reveal-title` / `reveal-item` classes (which set `opacity: 0`) to all sections, then checks visibility on scroll. If JS loads slowly or the user has it disabled, all page content is invisible.

**Fix:**
1. Rewrite `scroll-reveal.js` to use `IntersectionObserver` instead of scroll events.
2. Add `<noscript>` CSS to make all sections visible when JS is disabled:

```html
<!-- In each HTML <head> or in partials/header.html -->
<noscript>
  <style>
    .reveal-section, .reveal-title, .reveal-item { opacity: 1 !important; transform: none !important; }
  </style>
</noscript>
```

```js
// New scroll-reveal.js using IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-section, .reveal-title, .reveal-item')
  .forEach(el => observer.observe(el));
```

### 2.6 Remove float-animation from Cards

**Problem:** `main.js` `initializeEnhancedUI()` adds `float-animation` (infinite CSS keyframe animation causing continuous `translateY` movement) to every odd-indexed card on every page. This forces the GPU to continuously composite those layers even when they're off-screen.

**Fix:** Remove the `float-animation` class application from `initializeEnhancedUI()`. A subtle hover `translateY(-3px)` transition (already present via `hover-lift`) is sufficient and only activates on user interaction.

---

## Phase 3 — Structural & Content Fixes

### 3.1 Add (or Reference) the Logo File

**Problem:** `partials/header.html` references `assets/images/logo-placeholder.png` which does not exist in the repository. Every page shows a broken image where the logo should be.

**Fix:**
- Add the actual school logo file to `assets/images/` as `logo.png` (or `logo.svg`).
- Update the `<img>` src in `partials/header.html` to the correct filename.
- Add `width` and `height` attributes to prevent layout shift.
- If no logo is available yet, use an inline SVG placeholder or text fallback so the header does not show a broken image icon.

### 3.2 Fix Google Maps Coordinates in contact.html

**Problem:** Both Google Maps iframes in `contact.html` show New York City locations (Empire State Building, Hudson Yards) instead of the actual school campuses in Erode, Tamil Nadu, India.

**Fix:** Replace the iframe `src` values with the correct Erode locations. The iframes use `maps.google.com/maps?q=...` format — update to the correct addresses:

```html
<!-- Karungalpalayam campus -->
<iframe src="https://maps.google.com/maps?q=Karungalpalayam,+Erode,+Tamil+Nadu,+India&output=embed" ...>

<!-- Ellapalayam campus -->
<iframe src="https://maps.google.com/maps?q=Ellapalayam,+Erode,+Tamil+Nadu,+India&output=embed" ...>
```

Use exact coordinates or a verified Google Maps embed URL once the precise addresses are confirmed.

### 3.3 Fix campuses.html Section Structure

**Problem:** The `mission-grid` sections (campus info boxes) appear AFTER the closing `</section>` tag of their parent campus section, making them sibling elements instead of children. This means they are not semantically associated with the campus they belong to, and any CSS rules targeting children of `.main-campus` or `.annex-campus` will not apply.

**Fix:** Move the `</section>` closing tag for each campus section to after its corresponding `mission-grid` section.

```html
<!-- BEFORE -->
<section id="main-campus" class="section py-4">
  <div class="container-xl"> ... </div>
</section>   <!-- closes too early -->
<section class="mission-grid py-4 mb-3"> ... </section>

<!-- AFTER -->
<section id="main-campus" class="section py-4">
  <div class="container-xl"> ... </div>
  <section class="mission-grid py-4 mb-3"> ... </section>
</section>
```

### 3.4 Remove Inline Style Block from events.html

**Problem:** `events.html` contains a `<style>` block at lines 32–133 (100+ lines) that duplicates styles already present in `event-styles.css` and `utilities.css`. This creates style duplication and potential specificity conflicts.

**Fix:**
1. Audit which styles in the events.html `<style>` block are already in the CSS files (most of them are).
2. Move any genuinely unique styles to `event-styles.css`.
3. Remove the entire inline `<style>` block from `events.html`.

### 3.5 Fix about.html Stats Initial Values

**Problem:** The stats section shows `0+` and `0%` as initial values rendered in HTML, with `data-countup` attributes for JS animation. If JS fails or loads slowly, users see incorrect zero values.

**Fix:** Use the actual stat values as the rendered HTML content. The JS counter should read the final value from a `data-target` attribute and animate from 0 to that target — not replace the displayed content with a zero placeholder.

```html
<!-- BEFORE -->
<span class="stat-number" data-countup data-target="1500">0</span>+

<!-- AFTER -->
<span class="stat-number" data-countup data-target="1500">1500</span>+
```

The JS then animates from 0 up to the `data-target` value, replacing `1500` with the animated counter. The fallback is the correct final number, not zero.

---

## Phase 4 — Code Quality & Maintenance

### 4.1 Consolidate Font Loading into Header Partial

Move all Google Fonts `<link>` tags from individual HTML file `<head>` sections into the header partial injection in `main.js`, and remove the `@import` from `variables.css`. This ensures fonts are loaded once with a single network handshake.

### 4.2 Standardize Section Structure HTML Pattern

Create a documented standard for section markup and apply it consistently across all pages:

```html
<!-- Standard section pattern -->
<section class="[page]-[name] section-system [bg-modifier]" aria-labelledby="[id]-heading">
  <div class="container-xl">
    <h2 class="section__title" id="[id]-heading">...</h2>
    <!-- content -->
  </div>
</section>
<div class="section-divider-alt" role="presentation" aria-hidden="true"></div>
```

Rules:
- Use `section-system` (not `py-4`/`py-5`) for all page sections
- Never mix Bootstrap spacing utilities (`py-X`) with custom section padding
- Always use `aria-labelledby` pointing to the section's heading
- Dividers must have `role="presentation" aria-hidden="true"`

### 4.3 Remove Dead/Commented-Out Code

Large blocks of commented-out HTML exist in: `academics.html` (special programs, evaluation, achievements, resources sections), `campuses.html` (comparison table, virtual tour CTA), `contact.html` (department contacts), `admissions.html` (inline JS). These were likely content planned but not written yet.

Options:
- If planned: extract to separate stub files or a `_drafts/` folder
- If abandoned: delete entirely to reduce file sizes and cognitive load

### 4.4 Move campuses.html Inline Script to Page Module

The campuses page has 90+ lines of inline `<script>` for Swiper initialization and stats counter animation that duplicates logic in `main.js`. Move this to a new `assets/js/campuses.js` file loaded as a `<script defer>` at the page bottom.

---

## Implementation Order (Recommended)

| Priority | Phase | Task | Impact | Effort |
|---|---|---|---|---|
| 1 | 1.1 | Fix divider scaleY → direct height | High (closes gap bug) | Low |
| 2 | 1.2 | Unify mobile section padding | High (visual consistency) | Low |
| 3 | 1.3 | Remove py-4/py-5 from sections | High (prevents double padding) | Low |
| 4 | 1.5 | Add .bg-neutral utility class | Medium | Very Low |
| 5 | 3.1 | Fix broken logo image | High (every page) | Low |
| 6 | 3.2 | Fix map coordinates | Medium (correctness) | Very Low |
| 7 | 2.1 | Convert hero images to WebP | High (performance) | Medium |
| 8 | 2.2 | Convert gallery images to WebP | High (performance) | Medium |
| 9 | 2.3 | Remove duplicate font loading | Medium (performance) | Low |
| 10 | 2.4 | Throttle scroll listeners | Medium (mobile scroll jank) | Low |
| 11 | 2.5 | Migrate to IntersectionObserver | Medium (reliability) | Medium |
| 12 | 1.4 | Fix footer negative margin | Low | Very Low |
| 13 | 3.3 | Fix campuses.html section structure | Low (semantic) | Low |
| 14 | 3.4 | Remove events.html inline style block | Low (maintenance) | Low |
| 15 | 3.5 | Fix stats initial values (0 fallback) | Low | Very Low |
| 16 | 2.6 | Remove float-animation from cards | Low (GPU) | Very Low |
| 17 | 4.x | Code quality / standardization | Low | High |

---

## Expected Outcomes After Phase 1

- Visible gaps between sections on mobile eliminated or significantly reduced
- Consistent vertical rhythm across all pages on mobile
- No unexpected whitespace from divider layout/visual size mismatch

## Expected Outcomes After Phase 2

- Page weight reduced from ~12.2 MB → ~0.7 MB (94% reduction) for images
- Scroll performance improved on mid-range mobile devices
- Time to first meaningful paint improved for hero slider

## Expected Outcomes After Phase 3 + 4

- No broken images on any page
- Correct map locations displayed
- Semantically valid HTML structure
- Reduced CSS specificity conflicts
- Easier long-term maintenance with standardized patterns

---

## Files to Modify Summary

| File | Changes |
|---|---|
| `assets/css/dividers.css` | Remove scaleY transform + contain; use direct height vars |
| `assets/css/variables.css` | Remove `@import` fonts; add `--section-padding-mobile` |
| `assets/css/utilities.css` | Add `.bg-neutral` class |
| `assets/css/design-system.css` | Sync `--section-padding-y` mobile value with new token |
| `assets/js/scroll-reveal.js` | Migrate to IntersectionObserver; add noscript fallback |
| `assets/js/stats-counter.js` | Throttle scroll listener with rAF |
| `assets/js/main.js` | Throttle scroll listener; remove float-animation; add rAF utility |
| `partials/header.html` | Fix logo src; consolidate font link |
| `index.html` | Remove py-X from sections; use Picture for hero images |
| `about.html` | Fix stats initial values; remove py-X from sections |
| `academics.html` | Remove py-X from sections |
| `admissions.html` | Remove py-X from sections |
| `campuses.html` | Fix section structure; remove mt-n3; remove py-X |
| `contact.html` | Fix map coordinates |
| `events.html` | Remove inline style block |
| `gallery.html` | Update gallery img tags for WebP |
| `assets/images/` | Add WebP variants for all slider + gallery images |
