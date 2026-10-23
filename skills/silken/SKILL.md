---
name: silken
description: Use when building frosted glass cards, floating panels, and coordinated rounded controls. Defines translucent material, control proportions, restrained interruptible motion, reduced motion, and rendered glass checks across product domains.
metadata:
  author: IceyWu
  version: "2026.10.23"
---

# Silken

Build frosted floating surfaces whose blurred surroundings remain visible through their tint, with compact controls resting on that material. Material, background sampling, and control proportions must work together for the style to read correctly.

## Choose the density before drawing the card

Read the target surface, neighboring components, token system, and real content first. Keep established product behavior and component APIs. For a new surface without tokens, use the baseline in [surfaces](references/surfaces.md). Those values are one coordinated starting set; change shared tokens together when the product needs another density.

The default floating panel is 360px wide with a 20px radius and 12px inset. Use 13px control text in a 32px control with an 8px radius. Controls use theme-relative translucent fills. Introduce the product's accent only where meaning requires it.

## Give each layer a job

The floating panel carries the glass. Its content and controls use stable, readable fills. A selected segment sits slightly above its rail; a field sits slightly below its surrounding surface. Reserve strong elevation for overlays.

Use an 80% tint with `blur(40px) saturate(1.3)` for the default floating material. Set the fill's alpha, not the opacity of the whole panel. Background features should dissolve into color underneath the surface while foreground text stays sharp. Surface recipes and nested-radius geometry are in [surfaces](references/surfaces.md).

For material work, read [glass diagnosis](references/glass-diagnosis.md) before accepting a render. Check actual background sampling and compare with the filter temporarily disabled. A computed blur value alone does not prove the intended appearance.

## Build controls as a family

Use the same height, label size, icon grid, and radius across adjacent controls. Start with the actual controls the task needs. Read the relevant entries in [controls](references/controls.md) for buttons, icon actions, fields, selects, segments, tabs, switches, checkboxes, radios, sliders, steppers, chips, rows, progress, and menus.

A specimen may display several control types for evaluation. A product screen only includes controls that serve its task.

## Make small decisions visible

- Set control text at 13px/18px and supporting text at 12px/18px in the baseline. Keep ordinary labels at weight 400 or 500. Use 16px/22px at weight 600 for a panel title. Set changing values with tabular numerals.
- Share leading and trailing alignment edges across rows. Start with 8px within related items and 20px between groups. Use space before adding a divider.
- Inspect icon alignment at its rendered size. Use a 16px icon for a 13px label. Adjust visibly asymmetric glyphs by eye; do not shift the whole icon family to fix one glyph.
- Keep settings labels literal and actions specific. Preserve the product's terminology. Avoid adding introductory slogans, decorative captions, badges, or fabricated statistics to make a panel look designed.

## State changes must preserve geometry

Implement default, hover, focus, pressed, selected, disabled, and loading states that apply to the component. Loading must not resize a button; validation must not hide its field; selection must not move the surrounding labels.

Read [motion](references/motion.md) when adding transitions: it defines timing, button feedback, shared selection travel, panel/dialog lifecycles, content height changes, interruption, and reduced motion. Keep frequent changes quick and reversible. Preserve the glass material during movement; keep first paint stable. Introduce no motion dependency solely for this style.

Use [interaction](references/interaction.md) for keyboard behavior, coarse-pointer targets, overlay semantics, and rendered checks.

## Check the result, not the adjectives

Render at the intended size and at a narrow width. Compare geometry, type size, surface contrast, and state behavior with the requested reference. If only a screenshot exists, distinguish measured code values from visual estimates. Preserve the requested composition instead of inventing a business scenario to demonstrate it.

For a specimen, show actual-size controls on one consistent surface, including a few disabled, selected, and invalid examples. Mark intentionally inert examples clearly. A static screenshot demonstrates appearance; it cannot establish keyboard behavior or visual fidelity by itself.

When a component specimen is requested, start from [the self-contained control sheet](assets/controls.html). It includes light/dark surfaces, native inputs, selectable segments, a slider, switches, chips, local persistence, state examples, and a motion tab with panel/dialog and completion previews. Adapt its controls to the task; keep the specimen out of production routes unless requested.

| Visible symptom | Correction |
| --- | --- |
| The panel looks like a glowing poster | Remove promotional layout and decorative effects; restore the requested component hierarchy |
| Tiny secondary labels make the card look refined only at full-screen zoom | Restore the 12px supporting and 13px control baseline, then judge at 100% |
| Close nested corners do not follow each other | Derive the outer radius from the inner radius, inset, and border |
| Buttons, chips, and tabs all look like pills | Use their separate geometry and selection treatments |
| Every row is boxed or separated | Group with spacing; retain boundaries that communicate input or structure |
| The dark panel hides control boundaries | Adjust local fill differences and required control edges; do not brighten every label |
| The panel reads as an opaque gray form | Check the sampled background, fill alpha, saturation, shadow, and inherited backdrop roots; compare filter-on and filter-off renders |
| Every resting field has a prominent gray frame | Use the shared translucent field fill and an explicit focus/invalid treatment; preserve required contrast through an appropriate accessible field pattern |
| Several unrelated colors compete for attention | Return to neutrals and the established semantic colors |
| A polished screenshot contains dead actions | Wire the interaction or label its specimen-only state |

Finish by naming the files changed, the states actually checked, and any visual or interaction checks still unverified. Keep technical test claims separate from the user's judgment of the design.
