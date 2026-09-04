# Gablura — Logo Design Brief

## Brand Overview

**Name:** Gablura (Focus + Cura/Care)
**Industry:** Productivity & Wellness SaaS
**Tagline:** "Focus without burnout"
**Audience:** Remote workers, teams, project managers, wellness-conscious professionals

---

## Current Brand Identity

| Element | Value |
|---|---|
| Primary Color | `#667eea` (indigo/purple) |
| Secondary Gradient | `#764ba2` (deeper purple) |
| Dark Mode Primary | `#818cf8` (lighter indigo) |
| Design Style | Modern, rounded, gradient-rich, smooth transitions |
| Typography | Clean sans-serif (likely Inter or similar) |
| UI Pattern | Cards with `rounded-xl`/`rounded-2xl`, subtle borders, hover shadows |

---

## Logo Requirements

### Must-Have
- [ ] Works on light background (`#ffffff`)
- [ ] Works on dark background (`#0a0a0a` / `#111827`)
- [ ] Recognizable at 16px (browser favicon)
- [ ] Recognizable at 32px (navbar)
- [ ] Looks good at 128px+ (marketing, login page)
- [ ] Scalable to any size (vector/SVG)
- [ ] Human-made feel — warm, approachable, not robotic

### Must-Avoid
- No literal eye/lens imagery (too common for "focus" brands)
- No robot/AI imagery
- No overly complex details that break at small sizes
- No thin strokes that disappear below 24px
- No more than 2 colors in the mark

---

## Concept Directions

### 1. Concentric Focus Rings (Current SVG Concept)
Three concentric circles radiating outward from a central point, with a stylized "F" embedded within. Represents:
- **Focus** — attention radiating from a center point
- **Clarity** — clean, ordered geometry
- **Calm** — smooth, balanced proportions

**Pros:** Scalable, works at all sizes, unique geometry
**Cons:** May look too similar to target/radar icons

### 2. Flowing "F" Letterform
An abstract "F" formed by two or three flowing, organic lines. No straight edges — everything curves gently. Represents:
- **Flow state** — the smooth, effortless focus Gablura enables
- **Human touch** — organic curves feel warm and approachable
- **Simplicity** — one letter, instantly recognizable

**Pros:** Highly unique, memorable, works as monogram
**Cons:** Harder to get right — needs a skilled designer

### 3. Overlapping Translucent Shapes
Two or three overlapping rounded shapes (circles or soft rectangles) with transparency where they intersect. The overlap creates a third color. Represents:
- **Integration** — focus + wellness + productivity merging
- **Depth** — multiple layers of insight
- **Transparency** — honest, clear approach

**Pros:** Modern, visually interesting, color-rich
**Cons:** May not work well at favicon size

### 4. Abstract Lens/Aperture
A simplified camera aperture or iris shape with 5-6 curved blades, slightly open. Not a literal eye — more geometric. Represents:
- **Focus** — the act of bringing something into clarity
- **Precision** — sharp, intentional design
- **Energy** — the opening suggests potential and movement

**Pros:** Instantly reads as "focus", professional feel
**Cons:** Common in photography/camera brands

---

## Color Specifications

### Primary Palette
```
Brand Purple:    #667eea  (rgb: 102, 126, 234)
Deep Purple:     #764ba2  (rgb: 118, 75, 162)
Light Indigo:    #818cf8  (rgb: 129, 140, 248)  — dark mode
Soft Violet:     #a78bfa  (rgb: 167, 139, 250)  — dark mode secondary
```

### Gradient
```
Light Mode:  linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Dark Mode:   linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)
```

### Background Usage
```
Light mode mark on:  #ffffff, #f8fafc, #f1f5f9
Dark mode mark on:   #0a0a0a, #111827, #1e293b
```

---

## File Deliverables

| File | Size | Use Case |
|---|---|---|
| `gablura-logo.svg` | Full mark | Marketing, login page, email |
| `gablura-logo-dark.svg` | Full mark (light colors) | Dark mode contexts |
| `gablura-favicon.svg` | Simplified mark | Browser favicon |
| `gablura-logo.png` | 512x512 | Social media, OG images |
| `gablura-logo-mark.svg` | Icon only (no text) | App icon, small contexts |
| `gablura-logo-horizontal.svg` | Icon + "Gablura" text | Navbar, header |
| `gablura-logo-vertical.svg` | Icon above "Gablura" text | Sidebar, mobile |

---

## Usage in Codebase

### Current Logo Location
```tsx
// components/Navbar/NavbarMain.tsx
<Image src="/gablura-logo-rounded.png" width={32} height={32} alt="logo" className="rounded-md" />
```

### Recommended Update Pattern
```tsx
// Light mode
<Image src="/gablura-logo.svg" width={32} height={32} alt="Gablura" />

// Dark mode (using next-themes or CSS)
<Image src="/gablura-logo-dark.svg" width={32} height={32} alt="Gablura" />

// Or use a single SVG with currentColor
<img src="/gablura-logo.svg" className="text-foreground" alt="Gablura" />
```

---

## Designer Prompt (for AI Tools)

### Midjourney
```
Minimal abstract logo mark for "Gablura", a focus and productivity app. 
Concentric circles with embedded letter F. Purple gradient (#667eea to #764ba2). 
Clean, modern, human-made feel. No robot, no eye, no literal imagery. 
Vector style, flat design, works on white and dark backgrounds. 
--style raw --no photorealistic, 3d, gradient mesh
```

### DALL-E 3
```
Create a minimal, modern logo mark for a productivity app called "Gablura". 
The mark should be an abstract geometric design suggesting focus and clarity — 
think concentric circles or flowing lines forming a subtle "F" shape. 
Use a purple gradient from #667eea to #764ba2. 
The style should be clean, vector-like, and feel human-made (not AI-generated). 
No literal eyes, lenses, or robot imagery. 
Works on both white and dark backgrounds.
```

---

## SVG Preview

The SVG files are in `/public/`:
- `gablura-logo.svg` — full mark (light mode)
- `gablura-logo-dark.svg` — full mark (dark mode)
- `gablura-favicon.svg` — simplified for small sizes

Open them in a browser to preview, or embed directly:
```html
<img src="/gablura-logo.svg" alt="Gablura" width="120" height="120" />
```
