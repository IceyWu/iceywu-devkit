---
name: logo-generation
description: Use when designing logos or brand marks with pure HTML + SVG — rapid ideation, side-by-side comparison, iteration, and final export to SVG/favicon without Figma or Illustrator.
metadata:
  author: IceyWu
  version: "2026.07.02"
---

# logo-generation

Design logos entirely in code — no design tools required. Put multiple SVG concepts on one HTML page, compare side-by-side in the browser, iterate fast, and export final assets.

## What You Get

- A repeatable 4-phase workflow from ideation to final SVG export.
- An HTML preview template for side-by-side concept comparison.
- Reusable SVG recipes for hand-drawn filters, geometric shapes, and curated palettes.
- A quality checklist to ensure every exported asset is production-ready.

## Style Defaults

Unless the user specifies otherwise, default to:

- **Editorial monogram** — italic serif (`Georgia, serif`, `font-style="italic"`) in pure black on white. Feels like a luxury fashion label or design magazine masthead. This is the highest-confidence starting point.
- **Monochrome first** — black `#1a1a1a` on white. Introduce color only when the user asks for a specific mood.
- **Continuous-line curves** — for pure graphic marks, prefer flowing Bézier paths (`C` / `Q` commands) over angular polylines. A single stroke that forms the letter shape. Keep stroke weight thin (1.3–2px).
- **Recognizable, not abstract** — the mark must still clearly read as the intended letter(s). If you can't tell it's an "M" at a glance, simplify until you can.

### Style Directions

When the user gives mood feedback, pivot to one of these directions (shown as before/after):

| User says           | Direction          | Key changes                                                                                                                   |
| ------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| "可爱一点" / cute   | Soft & playful     | Warm coral/peach palette, thicker strokes (2.5–3px), `rx` everywhere, smile-like curves, lower filter intensity (scale 0.8–1) |
| "正式一点" / formal | Editorial monogram | Black serif italic, thin strokes (1.3–1.8px), generous whitespace, no filter                                                  |
| "科技感" / tech     | Geometric minimal  | Sans-serif, sharp angles, monospace spacing, cool slate `#2c3e50`                                                             |
| "艺术感" / artistic | Continuous-line    | Flowing Bézier curves, one continuous path per letter, hand-crafted feel, variable stroke thickness                           |

## Prompt Templates

Use these prompts directly, or adapt to the user's request.

### New Logo from Scratch

```
Use the logo-generation skill. I need a logo for [project name / description].
Start with 6-8 concepts covering pure text, pure graphic, and combination marks.
```

### Refine an Existing Direction

```
Use the logo-generation skill. Take concept [N] from [v1.html] and refine it.
Create v2.html with 3-4 variations exploring [proportion / stroke weight / palette / ...].
```

### Export Final Assets

```
Use the logo-generation skill. Export the final logo from [v2.html] concept [N]:
primary SVG, favicon SVG, and an inverted dark-background version.
```

## Workflow

### Phase 1: Divergent Ideation

Generate a single HTML file with **6–8 distinct concepts** in card layout.

**If the user provides a reference image**, anchor ALL concepts to the reference's typology. A reference showing a fused M+H monogram means every concept should be a fused M+H monogram — different ways to combine the same letters, not separate pure text / pure graphic / combination categories. The reference defines the format; your job is to explore variations within that format.

**If no reference image is given**, cover all three typology categories — at least 2 concepts per category.

**Brand integrity rule**: never split a brand's name or initials into isolated standalone letters. If the brand is "mcp-hub", the initials "MH" always appear together — as a fused monogram, ligature, or paired mark. A single "M" card or single "H" card is not a valid concept. The same applies to any multi-letter brand.

**Brand-owner extraction**: when a brand follows the "owner-descriptor" pattern (e.g. "iceywu-utils", "acme-core"), the logo mark should represent the brand _owner_ ("iceywu" → "i"), not extract initials from the full hyphenated name. The descriptor is secondary text, not part of the mark's identity.

**Semantic styling, not replacement**: if a brand name contains a semantic element (e.g. "ice" in "iceywu"), use it to inform the mark's _style_ — not to replace the mark entirely. An "ice" brand might use angular crystalline geometry to render an "i" letterform, but should not become a generic snowflake. The brand's core identity signal (the letter) must remain recognizable; the semantic element provides aesthetic direction.

| Category         | Definition                            | Examples                                             |
| ---------------- | ------------------------------------- | ---------------------------------------------------- |
| **Pure text**    | Letters only, no icon                 | wordmarks, letter marks, ligatures, monograms        |
| **Pure graphic** | Icon/mark only, no text in the SVG    | abstract geometry, symbols, stylized icons           |
| **Combination**  | Icon + brand name together in one SVG | icon above text, icon beside text, integrated lockup |

**Critical visual distinction — the three categories must look different at a glance:**

- **Pure text**: use `fill="currentColor"` (filled, not stroked), **no hand-drawn filter**. Clean typography reads as "text", not "graphic". If you apply `feDisplacementMap` to stroked text, it looks like a drawn icon and the category distinction collapses.
- **Pure graphic**: shapes only (`<path>`, `<circle>`, `<polygon>` etc.), hand-drawn filter encouraged.
- **Combination**: icon uses hand-drawn filter, text uses clean fill (no filter), so both elements remain individually legible. **The text in combination marks is a design element itself** — never default to small plain text. Vary across concepts: italic serif, sans-serif light, mixed font families, decorative divider lines, uppercase/lowercase contrast.

Within each category, vary across multiple dimensions to ensure genuine diversity. Every concept should differ from others on at least 2 of these axes:

| Dimension                        | Range                                                                                     | Example                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Filter intensity**             | light (scale 0.8) → medium (1.0–1.4) → bold/rough (1.8–2.0)                               | Subtle wobble vs visible sketch feel                          |
| **Terminal style**               | `stroke-linecap="round"` vs `"square"`                                                    | Soft friendly vs sharp editorial                              |
| **Stroke weight**                | thin 1.6px / medium 2.2–2.5px / bold 2.8–3px                                              | Delicate vs confident vs chunky                               |
| **Proportion**                   | wide M + narrow H / narrow M + wide H / balanced                                          | Asymmetric tension vs symmetry                                |
| **Background**                   | white card / dark card (`class="dark"`)                                                   | Light mode vs inverted                                        |
| **Typography** (text/combo only) | single-line / stacked two-line / ligature / uppercase / mixed fonts / decorative dividers | italic serif + small sans-serif / thin line divider + "UTILS" |

Use the template in [references/html-template.md](references/html-template.md) as the base. Keep a consistent `viewBox="0 0 72 72"` across all concepts. For text and combination marks that need more horizontal space, widen the card to 300px with `style="width:300px"`.

### Phase 2: Comparison

Open the HTML file in a browser → screenshot → share for review. Side-by-side card layout with section headers makes category comparison intuitive.

**Do not add `.label` text below cards** — the SVG content speaks for itself. Section headers already tell the category. Labels would put text under pure graphic cards, defeating the purpose.

### Phase 3: Convergent Refinement

Based on feedback, focus on 1–2 directions. Create a new file (e.g. `v2.html`) and tune across the same variation dimensions:

- **Filter intensity** — tighter or looser hand-drawn feel
- **Stroke weight** — thicker for presence, thinner for elegance
- **Terminal style** — round vs square vs mixed
- **Proportions** — adjust peak height, bar position, letter width ratios
- **Background** — try the winning mark on both light and dark
- Add or remove flourishes, adjust spacing

**Always save a new file per iteration** — never overwrite. This preserves decision history.

### Phase 4: Final Export

Once the final concept is chosen, extract assets:

1. **Primary Logo SVG** — extract the `<svg>` tag, save as `.svg`
2. **Favicon SVG** — simplified version, add a colored background with rounded corners
3. **Inverted version** — light marks on dark background, for dark-mode contexts

## Guardrails

- Phase 1 must include at least 2 concepts each from pure text, pure graphic, and combination — never all-one-category.
- Pure text concepts use filled text (`fill="currentColor"`) with no `feDisplacementMap` filter — stroked + filtered text reads as a graphic, defeating the category distinction.
- Pure graphic marks must remain **recognizable** — the intended letter or symbol should be identifiable at a glance. If it looks like an abstract squiggle, simplify the path until the letterform reads clearly.
- For pure graphic letter-marks, prefer continuous-line Bézier paths (`C`/`Q` commands, `stroke-width` 1.3–2px, `stroke-linecap="round"`) over chunky filled shapes.
- Use `viewBox="0 0 72 72"` on every concept in the same page — mixed viewBoxes distort comparison.
- Hand-drawn filters are encouraged but keep `feDisplacementMap` `scale` ≤ 2 for legibility.
- Palette ≤ 3 colors per concept. Let whitespace carry the elegance.
- Always save a new file per iteration — never overwrite.
- Extract exported SVGs as standalone `.svg` files with `xmlns` and `viewBox` intact.

## SVG Recipes

See [references/svg-recipes.md](references/svg-recipes.md) for ready-to-use snippets:

| Category             | Contents                                                                       |
| -------------------- | ------------------------------------------------------------------------------ |
| Hand-drawn filters   | `feTurbulence` + `feDisplacementMap` presets at three intensity levels         |
| Geometric primitives | Circle, triangle, hexagon, diamond, star, arc, spiral paths                    |
| Color palettes       | 6 curated elegant palettes (monochrome, warm, cool, earth, muted accent, dark) |
| Typographic marks    | Single-letter, two-letter ligature, and monogram layout patterns               |

## Output Checklist

- [ ] Phase 1 concepts cover all three categories: pure text (≥2), pure graphic (≥2), combination (≥2).
- [ ] Pure text concepts use `fill="currentColor"` (filled, not stroked) and no hand-drawn filter.
- [ ] Cards have no `.label` text — section headers alone identify categories; pure graphic cards contain zero text.
- [ ] Pure graphic letter-marks stay recognizable — the intended letter reads clearly, not an abstract squiggle.
- [ ] Combination text is designed, not default — italic/sans-serif/mixed fonts/divider lines vary across concepts.
- [ ] Brand-owner extraction applied: marks derive from the brand owner, not full hyphenated name.
- [ ] Final SVG has `xmlns="http://www.w3.org/2000/svg"` and the correct `viewBox`.
- [ ] Favicon variant includes a background `<rect>` with `rx` for rounded corners.
- [ ] Inverted variant swaps `stroke`/`fill` for light-on-dark readability.
- [ ] Paths use `stroke-linecap="round"` and `stroke-linejoin="round"`.
- [ ] Filters use `color-interpolation-filters="sRGB"` for cross-browser consistency.
