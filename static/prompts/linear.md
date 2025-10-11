## Design System Brief — Principles & Patterns from Linear.app

**Purpose:**  
Provide a detailed, implementation-ready, brand-agnostic design system outline, distilled from the UI/UX patterns and best practices observed in the public reference (linear.app), focused on accessibility, scalability, and modern product usability.

---

### 1. **Typography**

#### Font Stacks
- **Sans-serif (primary):** Inter Variable or similar, with robust fallbacks (`-apple-system`, `Segoe UI`, `Roboto`, `sans-serif`).
- **Monospace (secondary):** Berkeley Mono or similar for code and technical text.

#### Hierarchy & Scale
- **Headings:** 
  - Weighted (medium/semibold, 510–590).
  - Tight letter-spacing (-0.012em to -0.022em).
  - Major heading ranges: 1.5–4.5rem, matching responsive needs.
- **Body:** 
  - Default size: ~0.9375rem.
  - Secondary, small, micro, mini sizes for UI chrome and labels.
- **Line heights:** 1.33–1.6 (adjust as required for readability).

#### Text Behavior
- Visibly hidden text for screen readers (`.utils-module__visuallyHidden`).
- Strong support for keyboard navigation and focus visibility.

---

### 2. **Color Palette & Theming**

#### Theming Support
- Light, dark, and "glass" (translucent dark) modes.
- Color variables for all roles; recommend providing:
  - **Backgrounds:** Primary, secondary, tertiary, quaternary, quinary.
  - **Text:** Primary, secondary, tertiary, quaternary.
  - **Borders:** Primary, secondary, translucent.
  - **Brand/accent:** For primary and interactive elements.
  - **Highlight/selection:** Customizable highlight and selection backgrounds and text.

#### Accessibility
- Use color contrast ratios to meet/exceed WCAG 2.1 AA.
- Ensure focus rings (e.g., indigo or semi-transparent black, 2px width) are highly visible on backgrounds.

#### Example Color Roles (pseudo-variables)
```css
--color-bg-primary
--color-text-primary
--color-border-primary
--color-brand-bg
--color-brand-text
--color-link-primary
--color-link-hover
```
---

### 3. **Spacing, Sizing & Layout**

#### Grid System
- 12-column (desktop), 8-column (tablet), 4-column (mobile), max width ~1024px.
- Responsive with breakpoints at 1280px (desktop), 1024px (laptop), 768px (tablet), 640px (mobile).
- Container padding: inline (24px), block (64px) desktop → reduced on smaller screens.

#### Spacing
- Use CSS variables and utility classes for space (`--gap-*`, `Spacer-module__*`).
- Consistent use of multiples (4/8/16/24/32px).

#### Border Radius & Elevation
- Standard radii: 4/6/8/12/16/24/32px, plus infinite ("rounded") for pills/circle elements.
- Shadow system for elevation: low/medium/high, plus glass overlays.

---

### 4. **UI Components**

#### Buttons
- **Variants:** Primary (solid), Secondary (outline/ghost), Tertiary (minimal), Invert, Glass, Inline.
- **Sizes:** Mini, Small, Default, Large; variable height, font size, padding per spec.
- **States:** `:hover`, `:active`, `:focus`, `:disabled`.
- **Accessibility:** Sufficient color contrast, visible focus, keyboard accessible, ARIA where needed.

#### Links
- Underline offset, transition on color/decoration, accessible focus states.
- Differentiate in-navigation vs. inline links (navigation links default inherit color, inline links use accent colors).

#### Navigation Bar
- Horizontal, responsive, collapsible (hamburger on mobile).
- Hide/show classes for device-specific visibility (`.hide-mobile`, `.show-mobile`, etc.).
- Skip nav accessibility link at the start.
- Logo left, actions right, menu links between.
- Active link indication.
- Support for keyboard navigation, logical tab order.

#### Flex & Grid Utilities
- Flex: direction, alignment, justification utility classes.
- Grid: area assignment, responsive template adaptation.

#### Modality & Accessibility
- **Skip links** for keyboard users.
- **Aria-live regions** for notifications.
- **Tab order** and *visually hidden* patterns for context and screen reader cues.

#### Form Elements
- Consistent style (radius, border, padding).
- Focused/active/disabled states.
- Accessible labels; ARIA attributes as appropriate.

---

### 5. **Animation & Interaction**

- Use reduced motion queries and respect OS settings.
- Subtle entrance animations (opacity, blur, vertical movement) for hero content/illustrations.
- Button click scale/brightness for pressed states.
- Navigation menus: slide/fade in; context menus: minor scale/opacity transitions.

---

### 6. **Assets & Media**

#### Icons
- SVG, currentColor fill, accessible (use `aria-hidden` unless conveying information).
- Logo SVGs: scalable, responsive.

#### Images
- Responsive (srcset/dpr), lazy-loaded, semantic alt text.
- Provide preconnect/preload for performance.

---

### 7. **Accessibility & Usability**

- All interactive elements: focusable via Tab, recognizable focus rings.
- Landmarks: `<nav>`, `<main>`, `<header>`, `<section>` with `aria-label` where needed.
- Headings for structure, use of screen reader-only text for context purpose.
- Keyboard navigation: visible focus, no keyboard traps, all dialogs accessible.
- Semantic HTML strictly followed.
- Reduced motion when requested via `prefers-reduced-motion`.

---

### 8. **Implementation Notes**

- Style layering: Use CSS logical layers (`@layer reset, fonts, base, utils`).
- Reset/base CSS for reliable cross-browser rendering and accessibility.
- CSS variables for color, font, sizing; consumable by CSS-in-JS or native CSS.
- Responsiveness via media queries and device-specific utility classes.

---

### 9. **Sample Design Tokens:**  
(in CSS Custom Properties/Design Tokens format for easy cross-framework use)
```css
:root {
  /* Colors */
  --color-bg-primary: #fff;
  --color-text-primary: #282a30;
  --color-border-primary: #e9e8ea;
  --color-brand-bg: #7070ff;
  --color-brand-text: #fff;
  /* Typography */
  --font-regular: 'Inter Variable', 'Segoe UI', Arial, sans-serif;
  --font-size-regular: 0.9375rem;
  --font-size-title1: 2.25rem;
  --font-weight-medium: 510;
  /* Radius */
  --radius-8: 8px;
  --radius-rounded: 9999px;
  /* Spacing */
  --space-4: 4px;
  --space-16: 16px;
  /* etc. */
}
```

---

## Summary Checklist

- [x] Responsive grid with utility classes.
- [x] Scalable color theming/token system.
- [x] Robust typography with clear hierarchy.
- [x] Full range of button/link variants with accessible states.
- [x] Navigation suitable for desktop & mobile, with skip links.
- [x] Layered component and utility classes for composability.
- [x] Flex/grid layouts everywhere, not floats or positioned elements.
- [x] Refined accessible/focus UX throughout.
- [x] Lightweight, performant, modern implementation (variable fonts, lazy images, preconnect, etc).

---

**Ready for implementation in any modern web stack or as design system documentation.**