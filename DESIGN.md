# Design System Specification: Modern Traditionalism

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Illuminated Legacy."**

We are not merely building a school website; we are crafting a digital sanctuary that bridges the timeless weight of Islamic scholarship with the precision of modern academia. This system rejects the "template" look of modern education portals. Instead, it draws inspiration from classical manuscript illumination—where white space is intentional, gold accents signify value, and geometric precision provides structure.

To achieve this, we break the rigid grid. We use intentional asymmetry, overlapping "ogee" arch containers, and high-contrast typography scales. The goal is an editorial experience that feels curated, authoritative, and deeply rooted in heritage.

---

## 2. Colors & Visual Soul
The palette is anchored in **Deep Emerald (#064E3B)** and **Metallic Gold (#D4AF37)**, set against a tactile background of **Warm Paper White (#F9F9F9)**.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are strictly prohibited** for sectioning or containment. Structural boundaries must be defined through:
- **Tonal Shifts:** Placing a `surface-container-low` section against a `surface` background.
- **Negative Space:** Using the 4px-base spacing scale to create clear mental models of grouping.

### Surface Hierarchy & Nesting
Treat the UI as a physical desk of layered fine paper.
- Use `surface-container-lowest` (#ffffff) for the most prominent interactive elements (like a focused card).
- Use `surface-container` (#edeee8) for grouping secondary content.
- Use `surface-container-high` (#e8e9e3) for global navigation or utility bars.

### The "Glass & Gold" Rule
For floating elements (modals, dropdowns, or sticky headers), utilize **Glassmorphism**. Apply a semi-transparent `surface` color with a 12px-20px `backdrop-blur`. This allows the intricate Girih geometric patterns in the background to bleed through, creating a sense of depth and integration.

### Signature Textures
Apply **Girih geometric patterns** at 3-8% opacity to `primary-container` or `surface-variant` backgrounds. This subtle texture prevents large color blocks from feeling "flat" and adds a layer of cultural sophistication.

---

## 3. Typography
The typographic system is a dialogue between the classical and the contemporary.

- **Display (Amiri):** Used exclusively for hero statements, pull-quotes, or high-level philosophical headers. It carries the weight of history.
- **Headings (Reem Kufi):** The "Modern Traditionalist" workhorse. Use this for page titles and section headers to provide an unmistakable Arabic-heritage silhouette.
- **Body & Labels (Inter):** The functional layer. This clean sans-serif ensures that complex educational information remains legible and accessible.

**Hierarchy Strategy:**
Maintain a high contrast ratio between `display-lg` (3.5rem) and `body-md` (0.875rem). The dramatic size difference creates an "Editorial Modernist" look common in high-end journals.

---

## 4. Elevation & Depth
We eschew traditional Material Design "floating" shadows in favor of **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by "stacking" the surface tiers. A `surface-container-lowest` element sitting on a `surface-container-low` background creates a natural, soft lift.
- **Ambient Shadows:** If a shadow is required for a floating CTA or modal, use a "Tinted Ambient" approach. The shadow must use a 4% opacity of the `on-surface` color with a 40px blur—never use pure black or high-contrast shadows.
- **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use the `outline-variant` token at **15% opacity**. It should be a suggestion of a line, not a hard boundary.
- **Ogee Containers:** Use the "Islamic Arch" shape for hero images or featured cards. The top of the container should be a pointed or ogee curve, while the bottom remains flat, anchoring the element to the grid.

---

## 5. Components

### Buttons
- **Primary:** `primary` (#003527) background with `on-primary` text. Use a `md` (0.375rem) corner radius. For a signature touch, add a 1px `secondary` (Gold) bottom-border to the button to signify "illumination."
- **Secondary:** Transparent background with an `outline` and `primary` text.
- **Tertiary:** No background. Use `primary` text with an "ogee" icon flourish on hover.

### Cards & Lists
**Forbid the use of divider lines.**
- Separate list items using `8` (2rem) units of vertical space.
- For cards, use a `surface-container-low` background.
- Feature cards should utilize the Girih pattern at 5% opacity in the background to distinguish them from standard informational cards.

### Input Fields
- Use "Warm Paper White" (`surface-container-lowest`) for the field background.
- Instead of a full border, use a 2px bottom-stroke of `outline-variant`. On focus, transition the bottom-stroke to `secondary` (Gold).

### Signature Component: The "Illuminated Badge"
For status indicators (e.g., "Enrolling Now"), use a `secondary-container` (Gold) background with a subtle ogee-curved left edge. This breaks the standard pill-shape and reinforces the brand's architectural heritage.

---

## 6. Do's and Don'ts

### Do
- **DO** use generous white space. An editorial feel requires "room to breathe."
- **DO** overlap elements. Allow a heading in `Reem Kufi` to slightly overlap a hero image contained in an arch shape.
- **DO** use the Gold accent (`secondary`) sparingly to highlight excellence—scholarships, honors, or key call-to-actions.

### Don't
- **DON'T** use 100% opaque black. Always use `near-black` (#1C1C1C) for text to maintain a soft, paper-like contrast.
- **DON'T** use standard circular "pills" for everything. Lean into the `xl` (0.75rem) or `md` (0.375rem) roundedness for a more architectural feel.
- **DON'T** use generic iconography. Icons should be thin-stroke (1.5px) and match the `primary` color.
- **DON'T** clutter the Girih patterns. If text sits on a pattern, ensure the pattern opacity does not exceed 4%.