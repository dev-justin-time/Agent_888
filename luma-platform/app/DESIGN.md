---
name: LumaNation Design System
colors:
  surface: '#061612'
  surface-dim: '#061612'
  surface-bright: '#2c3d37'
  surface-container-lowest: '#02110d'
  surface-container-low: '#0e1f1a'
  surface-container: '#12231e'
  surface-container-high: '#1d2d28'
  surface-container-highest: '#283833'
  on-surface: '#d4e7df'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#d4e7df'
  inverse-on-surface: '#23342f'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#b5cbc3'
  on-secondary: '#21342e'
  secondary-container: '#374b44'
  on-secondary-container: '#a4bab2'
  tertiary: '#a8cfbc'
  on-tertiary: '#113729'
  tertiary-container: '#84ab98'
  on-tertiary-container: '#1b3f31'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#d1e8df'
  secondary-fixed-dim: '#b5cbc3'
  on-secondary-fixed: '#0b1f1a'
  on-secondary-fixed-variant: '#374b44'
  tertiary-fixed: '#c3ecd7'
  tertiary-fixed-dim: '#a8cfbc'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#294e3f'
  background: '#061612'
  on-background: '#d4e7df'
  surface-variant: '#283833'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  section-gap: 48px
---

## Brand & Style

The design system is built to evoke a sense of **sanctuary**. It prioritizes emotional safety, empathy, and sensory grounding for users seeking guidance. The brand personality is calm, wise, and deeply rooted in nature, moving away from clinical aesthetics toward a "Digital Forest" experience.

The design style is a refined **Organic Glassmorphism**. It blends the depth of translucent, frosted layers with the stability of a dark, high-contrast palette. This creates a focused, immersive environment that reduces cognitive load through purposeful whitespace and soft, tactile elements. The goal is to make the interface feel less like a tool and more like a gentle presence.

## Colors

The palette is anchored in deep, nocturnal greens to promote eye comfort and psychological grounding.

- **Primary (Luma Green):** A vibrant emerald used sparingly for calls to action and highlights.
- **Surface/Neutral:** The foundation is a rich, near-black forest green (`#03120E`). 
- **Glass Layers:** Surfaces utilize semi-transparent overlays (White at 4-6% opacity) with a heavy background blur (20px-40px) to create depth without clutter.
- **Accents:** Mint and sage tones are used for success states and interactive "Luma" glows.
- **Text:** High-contrast pure white for readability in headers, and a muted 60% opacity white for secondary information to maintain a soft visual hierarchy.

## Typography

This design system utilizes **Manrope** for its core typography. Its geometric yet warm construction provides a stable, modern feel that remains approachable. 

- **Headers:** Set with tighter letter-spacing and medium-to-bold weights to feel grounded and authoritative.
- **Body:** Generous line-heights are employed to ensure "breathability" in long-form guidance content.
- **Labels:** **JetBrains Mono** is used for utility text (time stamps, tags, and small metadata) to provide a subtle technical "precision" contrast against the organic nature of the rest of the UI.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with intentional "Atmospheric Gaps." 

- **Grid:** A 12-column grid for desktop and a 4-column grid for mobile.
- **Margins:** Wide 24px side margins on mobile to prevent the UI from feeling cramped.
- **Rhythm:** An 8px linear scale. Vertical spacing between different content sections is intentionally large (48px+) to allow the user's eyes to rest, reinforcing the calming brand promise.
- **Alignment:** Content is generally center-aligned or staggered to mimic organic movement rather than a rigid, industrial table.

## Elevation & Depth

Depth is conveyed through **Physicality and Light**, rather than traditional drop shadows.

1.  **Backdrop Blurs:** All elevated containers (cards, navigation) use a `saturate(180%) blur(20px)` effect.
2.  **Inner Glows:** Instead of outer shadows, components use a 1px inner border (White at 10% opacity) on the top and left edges to simulate a gentle overhead light source.
3.  **Luma Gradients:** The deepest layer (background) features slow-moving, large-scale radial gradients in emerald and forest green to create a sense of infinite, breathing space.
4.  **Shadows:** When necessary for extreme focus (e.g., modals), use long, soft shadows with a green-tinted umbra (`rgba(3, 18, 14, 0.4)`).

## Shapes

The shape language is **Hyper-Rounded** to eliminate any sense of harshness or "sharp edges."

- **Standard Containers:** Use 16px (`rounded-lg`) to 24px (`rounded-xl`) radii. 
- **Interactive Elements:** Buttons and input fields should favor high-pill rounding to feel "soft" to the touch.
- **Organic Asymmetry:** For specific elements like chat bubbles or decorative image masks, use slightly asymmetrical radii (e.g., `24px 24px 24px 4px`) to mimic organic, non-uniform growth found in nature.

## Components

- **Buttons:** Primary buttons use a linear gradient (Luma Green to Deep Emerald). They should have a subtle scale-down effect on press (0.98) to provide tactile, "squishy" feedback.
- **Chat Bubbles:** These are the heart of the empathy experience. They use high-transparency glassmorphism with an organic, "pebble" shape. The user's bubbles are slightly more vibrant to distinguish them from the guide's bubbles.
- **Cards:** Resource cards feature a 1px border and a subtle "Luma Glow" on hover—a soft green outer bloom that makes the card feel alive.
- **Bottom Navigation:** A floating, pill-shaped bar that sits 16px away from the screen bottom. It uses a heavy backdrop blur and 60% opacity for inactive icons, scaling to 100% opacity with a small green dot indicator for active states.
- **Input Fields:** Minimalist design with only a bottom border that "glows" into a full container highlight when focused.
- **Chips/Tags:** Small, pill-shaped elements with a secondary green background at 15% opacity, used for categorizing emotional states or topics.