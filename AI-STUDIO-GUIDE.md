# Al-Ameen Website Rebuild — AI Studio Guide

Complete step-by-step prompts for rebuilding the website from scratch using Google AI Studio,
then integrating the output into this Astro repo.

---

## Overview

```
AI Studio → generate design + pages → paste here → VS Code integrates → push to GitHub → Vercel deploys
```

**AI Studio** handles creative work (design system, layout, pages).  
**VS Code + Copilot** handles Astro wiring, build fixes, verification.  
**GitHub web editor / Codespaces** handles quick edits from mobile/anywhere.

---

## Phase 1 — Design System

**Where:** Google AI Studio (aistudio.google.com) → New Prompt → Gemini 2.5 Pro  
**Goal:** Generate `tokens.css` — all design tokens, color palette, typography, spacing.

### Prompt 1.1 — Design Tokens

```
You are a senior UI designer and frontend engineer.

Design and build a complete design system for an Islamic school website.

SCHOOL: Al-Ameen Matriculation Higher Secondary School, Erode, Tamil Nadu, India
Founded: 1983 | Students: ~1,500 | Two campuses

AESTHETIC DIRECTION:
- Clean, modern, light — white/warm-ivory backgrounds
- Islamic geometric identity — subtle Girih tile patterns, pointed arch motifs
- Feels like a premium academic institution, not a generic school template
- Inspired by: Islamic manuscript illumination, modern Scandinavian editorial design
- NOT dark, NOT flashy, NOT template-like

PALETTE: Choose one cohesive set:
- Primary (dark, strong): used for nav, headings, primary buttons
- Accent (gold/amber): used sparingly — CTAs, highlights, borders
- Background: warm white or ivory
- Surface tiers: 4 tonal levels from white → light gray-green for depth
- Text: near-black (never pure #000000)

TYPOGRAPHY:
- Reem Kufi (Google Font) → headings, nav
- Amiri (Google Font) → hero display text, pull quotes
- Inter (Google Font) → body, labels, UI

RULES:
- No 1px solid borders for card containment → use background tonal shifts
- No emoji anywhere → thin-stroke SVG icons only (stroke-width: 1.5)
- Buttons: solid background + subtle gold bottom-border stroke (2px)
- Cards: lift via box-shadow only, no borders
- Girih pattern: max 5% opacity when text sits on it, max 8% on dark backgrounds

DELIVER a CSS file with:
1. All :root custom properties (colors, fonts, spacing, radius, shadows, motion)
2. A complete @theme block for Tailwind v4
3. Utility classes: .girih-bg, .arch-container, .gradient-text, .section-spacing
4. Base resets for html, body, h1-h4, p, a, img

Output as a single ```css code block.
```

**What you get:** A complete CSS file. Save the output.

---

## Phase 2 — Layout Shell

**Goal:** Generate `BaseLayout.astro` — the header, footer, and page wrapper.

### Prompt 2.1 — BaseLayout Component

```
Now build the full HTML layout shell using those design tokens.

This is an Astro component (BaseLayout.astro) — use Astro JSX syntax.

HEADER requirements:
- Sticky, semi-transparent with backdrop-blur (clean blur, not frosted glass)
- Left: circular emerald badge with Arabic letter "ع" + school name in Reem Kufi
- Center: nav links — Home, About, Academics, Admissions, Campuses, Gallery, Events, Contact
- Right: "Apply Now" gold button with gold bottom-border illumination stroke (border-b-2)
- Mobile: hamburger menu, full-width dropdown panel
- Active page indicator: bottom border underline in accent gold
- Active nav item uses activePage prop to highlight

FOOTER requirements:
- Dark primary background (emerald/navy/teal — matching primary color)
- Subtle Girih pattern at 4% opacity as background texture
- 3 columns: Brand+Address | Social+Bismillah | Quick Links
- Address with thin-stroke SVG icons (map pin, phone, mail) — stroke-width 1.5, no emoji
- Social icons: Facebook, Instagram, WhatsApp, YouTube — thin SVG icons, no emoji
- Bismillah in Arabic: بسم الله الرحمن الرحيم in Amiri font, gold color
- Bottom bar: "© 2025 Al-Ameen School. All rights reserved."

CONTACT DETAILS FOR FOOTER:
Address: No 180/6, Cauvery Road, Karungalpalayam–638003
Phone: +91-8015053189
Email: info@alameen.edu
Social links: all href="#" for now

The component receives these Props:
- title?: string
- description?: string
- ogImage?: string
- activePage?: 'home' | 'about' | 'academics' | 'admissions' | 'campuses' | 'gallery' | 'events' | 'contact'

navLinks array is defined in the frontmatter.
Include mobile menu toggle JS script and back-to-top button script.

Output as a single ```astro code block labeled BaseLayout.astro.
```

**What you get:** Complete BaseLayout.astro. Save the output.

---

## Phase 3 — Homepage

**Goal:** Generate `index.astro` — the full homepage with all sections.

### Prompt 3.1 — Homepage

```
Now build the full homepage (index.astro) using the design system and BaseLayout.

Use the EXACT content below — do not rewrite or summarize any text.

--- HERO SLIDER ---
Full-width slider, 3 slides. Style: full-bleed image with emerald gradient overlay
+ Girih texture at 4% opacity. Left side: arch-shaped (Islamic pointed arch) image frame.
Right side: text content. Dot + prev/next arrow controls. JS slider at bottom of file.

Slide 1: Title "Al Ameen School, Erode" | Sub "Empowering Knowledge, Inspiring Faith" | CTA → /admissions "Admissions"
Slide 2: Title "A Tradition of Excellence" | Sub "Discover our vibrant learning community" | CTA → /academics "Our Programs"
Slide 3: Title "Rooted in Values" | Sub "Academic achievement with strong character" | CTA → /about "About Us"

Image paths: /images/slider-1.webp, /images/slider-2.webp, /images/slider-3.webp

After hero: gold gradient divider line (primary → accent → primary).

--- ABOUT SECTION ---
Background: surface-alt with Girih at 5%. Two-column layout.
Left (text):
  Eyebrow: "Est. 1983 · Erode, Tamil Nadu"
  Heading: "About Al-Ameen"
  Body: "Al-Ameen Matriculation Higher Secondary School is dedicated to nurturing young minds
  with a blend of academic excellence, Islamic values, and holistic development. Our vibrant
  campus, experienced faculty, and inclusive environment empower every student to thrive."
  Sub-body: "Founded on principles of educational excellence and character development, we
  provide a supportive environment where students can grow intellectually, spiritually, and
  socially."
  CTA: "Learn More" → /about (primary button, gold bottom-border)
Right (image): arch-masked image using /images/slider-1.webp with decorative gold ring

--- WHY CHOOSE US ---
Section background: surface-container-low (one tonal step darker than white).
Cards sit on white surface for tonal lift. No card borders — shadow lift only.
Each card has Girih texture at 5% inside.

4 cards:
1. "Excellence in Education" — "Consistently achieving top academic results with innovative teaching methodologies." — SVG: trophy/award icon
2. "Experienced Faculty" — "Dedicated teachers with years of experience in nurturing young minds." — SVG: open book icon
3. "Modern Facilities" — "State-of-the-art infrastructure and learning resources for comprehensive education." — SVG: building/school icon
4. "Holistic Development" — "Focus on character building, moral values, and overall personality development." — SVG: clock/growth icon

Each card: SVG icon in circular bg + gold underline bar + heading + body text.
Use inline SVG, stroke-width 1.5, primary color. No emoji.

--- STATS BAR ---
Full-width primary (emerald) background. 4 stat items centered.
1,500+ Active Students | 150+ Expert Educators | 42+ Years of Excellence | 100% Success Rate
Stat number in accent gold (Amiri font), label in on-dark/60 (Reem Kufi, small caps).

--- ADMISSIONS CTA BANNER ---
Background: emerald gradient + Girih at 8%. Centered text layout.
Eyebrow: "2025–2026 Academic Year"
Heading: "Admissions Now Open"
Body: "Limited seats available for all grades. Apply today to secure your child's future at Al-Ameen."
Primary CTA: "Apply Now →" → /admissions (accent gold button + gold bottom-border)
Secondary CTA: "↓ Download Form" → /forms/admission-form.pdf download (transparent border button)

--- UPCOMING EVENTS ---
3 event cards. Section background: base/page color.
Card style: date badge (emerald box, gold month label, white day number) + tag chip + title + venue with map-pin SVG.

Event 1: Date "Apr 10" | Month "APR" | Tag "Sports" | Title "Annual Sports Day" | Venue "Main Campus Ground"
Event 2: Date "Apr 18" | Month "APR" | Tag "Academic" | Title "Science Exhibition" | Venue "Ellapalayam Campus Hall"
Event 3: Date "May 2" | Month "MAY" | Tag "Community" | Title "Parent–Teacher Meet" | Venue "All Campuses"

--- OUR CAMPUSES ---
2 campus cards. Section background: surface-alt.
Card: emerald gradient header bar with SVG building icon + name + location (map-pin SVG).
Body: type badge + fact list with gold checkmark SVG bullets.

Campus 1: "Karungalpalayam Campus" | Cauvery Road | Co-ed (up to 5th) · Girls Only (6th–12th)
Facts: "Established 1983 — 42 years of excellence" | "0.54-acre campus with modern facilities" | "Co-educational up to Grade 5, all-girls from Grade 6"
Link: /campuses#main-campus

Campus 2: "Ellapalayam Campus" | Villarasampatti | Co-ed (All Grades 1–12)
Facts: "Established 1992 — 33 years of excellence" | "1.5-acre campus with latest technology" | "Co-educational, all grades"
Link: /campuses#annex-campus

--- FINAL CTA ---
Section background: white. Centered.
Heading: "Ready to Join Al-Ameen?"
Body: "Download our admission form and start your journey today."
CTA: "↓ Download Admission Form" → /forms/admission-form.pdf download (primary button, gold bottom-border)

Output as a single ```astro code block labeled index.astro.
```

**What you get:** Complete index.astro. Save the output.

---

## Phase 4 — Inner Pages

**Goal:** Generate each of the 7 inner pages.  
**Where:** Continue the same AI Studio chat, or start a new chat pasting tokens + BaseLayout as context.

For each page, use this template prompt, filling in the page-specific details:

### Template Prompt — Inner Page

```
Build the [PAGE NAME] page ([filename].astro) using the same design system and BaseLayout.

activePage prop value: "[key]"

Page heading: "[Page Title]"
Page subheading: "[subtitle or description]"

SECTIONS:
[describe each section with its exact content]

Use the same card/section patterns established in index.astro.
No emoji. Thin-stroke SVG icons. Tonal surface contrast instead of borders.
Primary buttons get gold bottom-border stroke.

Output as a single ```astro code block labeled [filename].astro.
```

### Page 4.1 — About

```
Build the About page (about.astro) using the same design system and BaseLayout.
activePage prop: "about"

SECTION 1 — Page Header (hero banner, emerald bg, Girih at 6%):
Title: "About Al-Ameen"
Subtitle: "Four decades of nurturing excellence, faith, and character"

SECTION 2 — Our Story (2-column: text left, arch image right):
Heading: "Our Story"
Body: "Al-Ameen Matriculation Higher Secondary School was founded in 1983 with a singular
vision: to provide quality education that seamlessly integrates academic excellence with
Islamic values. What began as a humble institution in Karungalpalayam has grown into a
cornerstone of educational excellence in Erode, Tamil Nadu."
Body 2: "For over four decades, we have been committed to nurturing well-rounded individuals
who excel academically, grow spiritually, and contribute meaningfully to society."
Image: /images/slider-1.webp (arch-masked)

SECTION 3 — Mission & Vision (2 cards, emerald bg):
Card 1 — Mission: "To provide holistic education that combines academic excellence with
Islamic values, nurturing students to become knowledgeable, ethical, and compassionate
members of society."
Card 2 — Vision: "To be a leading educational institution that produces well-rounded
individuals who excel in their chosen fields while upholding the highest moral and
ethical standards."

SECTION 4 — Core Values (4 icon cards, same style as Why Choose Us):
1. "Academic Excellence" — "Maintaining the highest standards in education and learning outcomes."
2. "Islamic Values" — "Integrating faith, ethics, and moral principles in all aspects of education."
3. "Holistic Development" — "Nurturing intellectual, physical, social, and spiritual growth."
4. "Community Service" — "Encouraging students to give back and contribute to society."

SECTION 5 — Stats (same emerald stats bar as homepage):
42+ Years | 2 Campuses | 1,500+ Students | 150+ Educators

SECTION 6 — Leadership Message (card with quote styling):
Heading: "Message from the Principal"
Quote: "At Al-Ameen, we believe every child has unique potential. Our dedicated faculty
and supportive environment help students discover their strengths while building character
and values that will guide them throughout life."
Attribution: "— The Principal, Al-Ameen School"

Output as a single ```astro code block labeled about.astro.
```

### Page 4.2 — Academics

```
Build the Academics page (academics.astro) using the same design system and BaseLayout.
activePage prop: "academics"

SECTION 1 — Page Header:
Title: "Academics"
Subtitle: "A comprehensive curriculum designed for excellence"

SECTION 2 — Curriculum Overview (text + 3 program cards):
Intro: "Our academic programs are designed to provide students with a strong foundation
in core subjects while encouraging critical thinking, creativity, and a love for learning."

Programs:
Card 1 — "Primary School (Grades 1–5)": "Building strong foundations in literacy, numeracy,
and scientific thinking through engaging, activity-based learning."
Card 2 — "Middle School (Grades 6–8)": "Deepening subject knowledge with introduction to
specialized topics, laboratory work, and project-based assessments."
Card 3 — "High School (Grades 9–12)": "Rigorous academic preparation for board examinations
with focus on both Science and Commerce streams."

SECTION 3 — Subject Areas (icon grid, 6 subjects):
Mathematics | Science | Languages (Tamil, English, Arabic) | Social Studies | Computer Science | Physical Education

SECTION 4 — Academic Achievements (stats/highlights):
"Board Exam Pass Rate: 100%" | "State Rank Holders: 15+ students" | "Science Fair Winners: Regional Champions" | "Sports Champions: Inter-school Trophy 3 years"

SECTION 5 — Teaching Methodology (3 pillars):
1. "Activity-Based Learning" — Hands-on experiments and projects that make concepts tangible.
2. "Values Integration" — Every subject connects to broader ethical and life lessons.
3. "Technology-Enhanced" — Smart classrooms and digital resources support modern learning.

Output as a single ```astro code block labeled academics.astro.
```

### Page 4.3 — Admissions

```
Build the Admissions page (admissions.astro) using the same design system and BaseLayout.
activePage prop: "admissions"

SECTION 1 — Page Header:
Title: "Admissions"
Subtitle: "Begin your child's journey of excellence — 2025–2026 now open"

SECTION 2 — Admission Process (numbered steps):
Step 1: "Collect Application Form" — Visit either campus or download the form from this page.
Step 2: "Submit Documents" — Completed form + birth certificate + previous year report card + 2 passport photos.
Step 3: "Entrance Assessment" — Age-appropriate assessment for Grades 3 and above.
Step 4: "Interview" — Brief interaction with the student and parents.
Step 5: "Confirmation" — Fee payment and enrollment confirmation.

SECTION 3 — Download CTA (emerald bg, Girih):
Heading: "Download Admission Form"
Body: "Get our official admission form and begin the application process today."
CTA: "↓ Download Form" → /forms/admission-form.pdf (download, gold button)

SECTION 4 — Eligibility (2 columns):
Left — Age Criteria:
Grade 1: Age 5–6 years | Grade 2: Age 6–7 years | Grade 3–5: Age-appropriate | Grades 6–12: Based on previous class completion

Right — Required Documents:
- Completed application form
- Original birth certificate
- Previous year's report card (Grades 2 and above)
- 2 recent passport-size photographs
- Transfer certificate (if from another school)
- Aadhar card copy

SECTION 5 — Contact for Admissions:
Heading: "Have Questions?"
Body: "Our admissions team is here to help. Reach out to us."
Phone: +91-8015053189 | Email: info@alameen.edu
Office hours: Monday–Saturday, 9:00 AM – 4:00 PM

Output as a single ```astro code block labeled admissions.astro.
```

### Page 4.4 — Campuses

```
Build the Campuses page (campuses.astro) using the same design system and BaseLayout.
activePage prop: "campuses"

SECTION 1 — Page Header:
Title: "Our Campuses"
Subtitle: "Two purpose-built learning environments across Erode"

SECTION 2 — Campus detail (id="main-campus"), 2-column layout:
Name: "Karungalpalayam Campus"
Location: "No 180/6, Cauvery Road, Karungalpalayam–638003"
Type: "Co-educational up to Grade 5 · All-Girls from Grade 6"
Established: 1983 | Area: 0.54 acres
Description: "The founding campus of Al-Ameen, located in the heart of Karungalpalayam.
This campus houses our primary school and girls-only secondary sections, with dedicated
science labs, computer rooms, and a spacious library."
Facilities: Science Laboratory | Computer Lab | Library | Prayer Hall | Sports Ground | Canteen
Image: /images/slider-1.webp (arch-masked)

SECTION 3 — Campus detail (id="annex-campus"), 2-column layout (reversed):
Name: "Ellapalayam Campus"
Location: "Villarasampatti, Ellapalayam, Erode"
Type: "Co-educational — All Grades 1–12"
Established: 1992 | Area: 1.5 acres
Description: "Our larger, co-educational campus established in 1992. With 1.5 acres of space,
this campus features modern infrastructure including smart classrooms, an expanded sports
complex, and dedicated spaces for extracurricular activities."
Facilities: Smart Classrooms | Science Block | Sports Complex | Prayer Hall | Auditorium | Canteen
Image: /images/slider-3.webp (arch-masked)

SECTION 4 — Compare campuses (simple 2-column comparison table, no hard borders):
Features: Grades | Gender | Area | Est. Year | Smart Classrooms | Sports Facilities
(fill from data above)

Output as a single ```astro code block labeled campuses.astro.
```

### Page 4.5 — Events

```
Build the Events page (events.astro) using the same design system and BaseLayout.
activePage prop: "events"

SECTION 1 — Page Header:
Title: "Events & News"
Subtitle: "Celebrating achievements, building community"

SECTION 2 — Featured Event (large card, emerald bg):
Title: "Annual Day Celebration 2025"
Date: "March 15, 2025"
Body: "Our Annual Day was a grand celebration of student talent, academic achievement,
and cultural heritage. Students performed classical dances, recitations, and a spectacular
variety show attended by parents and dignitaries."
Tag: "Annual Event"

SECTION 3 — Events grid (6 cards, same date-badge card style as homepage):
1. Apr 10 | Sports | "Annual Sports Day" | Main Campus Ground
2. Apr 18 | Academic | "Science Exhibition" | Ellapalayam Campus Hall
3. May 2 | Community | "Parent–Teacher Meet" | All Campuses
4. Jun 15 | Academic | "Board Results Celebration" | Main Campus
5. Jul 4 | Cultural | "Independence Day" | Both Campuses
6. Aug 20 | Academic | "New Academic Year Inauguration" | Main Campus

SECTION 4 — Achievements highlight (3 cards):
1. "Academic Excellence": "Our students secured 100% pass rate in board examinations for the 8th consecutive year."
2. "Sports Champions": "Al-Ameen won the Overall Trophy at the District Inter-School Sports Meet 2025."
3. "Science Fair": "Our science team won 1st place at the Regional Science Fair organized by the District Education Office."

Output as a single ```astro code block labeled events.astro.
```

### Page 4.6 — Gallery

```
Build the Gallery page (gallery.astro) using the same design system and BaseLayout.
activePage prop: "gallery"

SECTION 1 — Page Header:
Title: "Gallery"
Subtitle: "Moments from our vibrant school life"

SECTION 2 — Category filter tabs (client-side JS filter):
Categories: All | Academics | Sports | Cultural | Campus | Community

SECTION 3 — Photo grid (masonry-style or uniform grid, 12 items):
Use these image paths and captions:
/images/gallery/academics-1.webp — "Classroom Learning"
/images/gallery/academics-2.webp — "Science Lab Session"
/images/gallery/sports-1.webp — "Sports Day 2025"
/images/gallery/sports-2.webp — "Athletics Training"
/images/gallery/events-1.webp — "Annual Day Performance"
/images/gallery/events-2.webp — "Prize Distribution"
/images/slider-1.webp — "Karungalpalayam Campus"
/images/slider-2.webp — "Classroom Engagement"
/images/slider-3.webp — "Ellapalayam Campus"
/images/gallery/academics-1.webp — "Library Reading"
/images/gallery/sports-1.webp — "Team Victory"
/images/gallery/events-1.webp — "Science Exhibition"

Each image: rounded corners, hover zoom (scale-105), category data attribute for filtering.
Lightbox on click (pure CSS/JS, no external library).

Output as a single ```astro code block labeled gallery.astro.
```

### Page 4.7 — Contact

```
Build the Contact page (contact.astro) using the same design system and BaseLayout.
activePage prop: "contact"

SECTION 1 — Page Header:
Title: "Contact Us"
Subtitle: "We'd love to hear from you"

SECTION 2 — Contact grid (2 columns: form left, info right):

LEFT — Contact form:
Fields: Full Name | Email Address | Phone Number | Subject (dropdown: General Inquiry / Admissions / Academics / Other) | Message (textarea)
Submit button: "Send Message →" (primary gold button, gold bottom-border)
Note below form: "We respond within 1 business day."

RIGHT — Contact information:
Main Campus:
  Address: No 180/6, Cauvery Road, Karungalpalayam–638003
  Phone: +91-8015053189
  Hours: Mon–Sat, 9:00 AM – 4:00 PM

Ellapalayam Campus:
  Address: Villarasampatti, Ellapalayam, Erode
  Phone: +91-XXXXXXXXXX
  Hours: Mon–Sat, 9:00 AM – 4:00 PM

Email: info@alameen.edu

Use thin-stroke SVG icons for map-pin, phone, mail, clock. No emoji.

SECTION 3 — Map placeholder (emerald bg placeholder box with text "Find Us Here"):
Embed a placeholder — note that a real Google Maps embed can be added later.

Output as a single ```astro code block labeled contact.astro.
```

---

## Phase 5 — Integration into Astro

**Where:** VS Code + GitHub Copilot (here)  
**Goal:** Wire all AI Studio output into the Astro project.

Once you have outputs for all phases, paste them into a chat here and say:

> "Integrate these AI Studio outputs into the Astro project"

Copilot will:
1. Write `tokens.css` with the new design tokens
2. Update `global.css` `@theme` block
3. Replace `BaseLayout.astro`
4. Replace all `src/pages/*.astro` files
5. Run `npm run build` and fix any errors
6. Start dev server for preview

---

## Phase 6 — Review & Iterate

After each page is integrated and visible in the dev server:

| Issue | What to do |
|---|---|
| Color feels off | Go to AI Studio: "Change primary to [color], update tokens" → paste here |
| Section looks wrong | AI Studio: "Redesign the [section] section" → paste updated section here |
| Text needs changing | Edit directly on github.com (works on mobile) |
| New section needed | AI Studio: "Add [section] after [other section] in [page].astro" → paste here |
| Layout bug | Fix here in VS Code |

---

## Phase 7 — Deploy

```bash
# When happy with a branch, merge to main:
git checkout main
git merge refine/new-theme
git push origin main
# Vercel auto-deploys on push to main
```

---

## Quick Reference

| Task | Tool |
|---|---|
| Generate new design / sections | AI Studio (aistudio.google.com) |
| Integrate code into Astro project | VS Code + Copilot |
| Quick text/content edits on mobile | github.com web editor |
| Full editing from mobile/browser | github.dev or GitHub Codespaces |
| Deploy | Vercel (auto on push to main) |
| Repo | github.com/mufeedz/alameen |
