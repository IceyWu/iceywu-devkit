# SVG Recipes

Copy-paste building blocks for hand-drawn, minimal, elegant logos.

## Hand-Drawn Filters

Apply one of these `<filter>` definitions inside `<defs>`, then reference it via `filter="url(#hand-drawn-light)"` on your shapes.

### Light (subtle wobble)

```xml
<filter id="hand-drawn-light" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
</filter>
```

### Medium (visible sketch feel)

```xml
<filter id="hand-drawn-medium" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
</filter>
```

### Bold (rough / expressive)

```xml
<filter id="hand-drawn-bold" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="5" result="noise" />
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
</filter>
```

## Geometric Primitives

All shapes assume `viewBox="0 0 72 72"`. Adjust `cx`/`cy`/`r`/`d` to reposition.

### Circle

```xml
<circle cx="36" cy="36" r="20" fill="none" stroke="currentColor" stroke-width="2" />
```

### Rounded Square / Diamond

```xml
<rect x="16" y="16" width="40" height="40" rx="6" fill="none" stroke="currentColor" stroke-width="2" />
```

### Hexagon

```xml
<polygon points="36,10 60,24 60,48 36,62 12,48 12,24"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
```

### Triangle (upward)

```xml
<polygon points="36,12 62,56 10,56"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
```

### Star (5-point)

```xml
<polygon points="36,8 42,28 62,28 46,40 52,60 36,48 20,60 26,40 10,28 30,28"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
```

### Arc / Semicircle

```xml
<path d="M 16 36 A 20 20 0 0 1 56 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
```

### Spiral

```xml
<path d="M 36 36 Q 40 30 46 32 T 52 40 T 44 50 T 32 50 T 26 38 T 32 26 T 44 22"
  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
```

## Continuous-Line Letterforms

For elegant, artistic monograms — flowing Bézier curves that form recognizable letters in a single stroke. All use `stroke-linecap="round"` and thin `stroke-width="1.5"`.

### M (single continuous stroke)

```xml
<path d="M12 56 C12 14 26 10 30 22 C32 28 28 34 22 36 C16 38 12 44 12 48
         M12 48 C28 48 38 36 42 22 C44 14 50 8 60 8"
  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
```

### H (two verticals + bridge)

```xml
<path d="M16 56 L16 14 C16 14 30 10 32 22 C34 34 32 42 24 40 C18 38 16 32 16 32
         M16 32 L16 56
         M16 32 L46 32 L46 56"
  fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
```

### Tips for Bézier letterforms

- Start from a reference italic serif M/H and trace the key strokes as curves.
- Keep the path readable as a letter — don't sacrifice legibility for flourish.
- Thin strokes (1.3–1.8px) feel editorial and sophisticated.
- `stroke-linecap="round"` softens the terminals without a filter.
- Test at the actual rendering size (140×140px) — what looks elegant at 400px may become a hairline at logo size.

## Color Palettes

Use `currentColor` as the primary stroke so cards can share one filter definition, and set color via CSS `color` on the `.mark` container.

### Monochrome Ink

`#1a1a1a` (primary) — black ink on white.

### Warm Stone

`#5c4b3e` (primary), `#c4a882` (accent), `#f5f0e8` (background fill).

### Cool Slate

`#2c3e50` (primary), `#7fa8c9` (accent), `#ecf3f8` (background fill).

### Earth Moss

`#3d4f3c` (primary), `#8b9d6b` (accent), `#f4f6ef` (background fill).

### Muted Rose

`#5c3a4a` (primary), `#c49aa0` (accent), `#faf3f5` (background fill).

### Dark Elegance (inverted)

`#f0ebe3` (mark), `#1e1e24` (background).

Apply in CSS:

```css
.card.dark { background: #1e1e24; }
.card.dark .label { color: #f0ebe3; }
.card.dark .mark { color: #f0ebe3; }
```

## Typographic Marks

### Single Letter

```xml
<text x="36" y="48" text-anchor="middle" font-family="serif" font-size="42"
  font-weight="700" fill="none" stroke="currentColor" stroke-width="2">A</text>
```

### Two-Letter Ligature

```xml
<text x="36" y="46" text-anchor="middle" font-family="serif" font-size="36"
  font-weight="600" fill="none" stroke="currentColor" stroke-width="1.8"
  letter-spacing="-2">Ab</text>
```

### Monogram (stacked)

```xml
<text x="36" y="30" text-anchor="middle" font-family="serif" font-size="22"
  font-weight="700" fill="currentColor">A</text>
<text x="36" y="52" text-anchor="middle" font-family="serif" font-size="22"
  font-weight="700" fill="currentColor">B</text>
```

## Combining Pattern

Put a filter in `<defs>`, draw a shape with that filter, and layer a text mark:

```xml
<svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="hd" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
  <circle cx="36" cy="36" r="22" fill="none" stroke="currentColor" stroke-width="2" filter="url(#hd)"/>
  <text x="36" y="44" text-anchor="middle" font-family="serif" font-size="20"
    font-weight="600" fill="currentColor">A</text>
</svg>
```
