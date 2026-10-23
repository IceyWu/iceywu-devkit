# Surfaces and proportions

Use these defaults when the target has no established design tokens. They define one compact desktop density, not a universal sizing rule. Map semantic names into the project's own CSS, Tailwind, or component tokens.

## Baseline tokens

| Role | Dark | Light |
| --- | --- | --- |
| Canvas | `#202024` | `#eeeef0` |
| Panel fallback | `#1c1c1f` | `#f4f4f5` |
| Panel glass | `rgb(28 28 31 / 80%)` | `rgb(244 244 245 / 80%)` |
| Control fill | Primary text at 7% alpha | Primary text at 7% alpha |
| Hover fill | Primary text at 12% alpha | Primary text at 12% alpha |
| Raised selection | `rgb(255 255 255 / 18%)` | `#fff` |
| Primary text | `#f4f4f5`, or the product theme's text | `#18181b`, or the product theme's text |
| Secondary text | Primary text at 62% alpha | Primary text at 62% alpha |
| Quiet structural line | Primary text at 8% alpha | Primary text at 8% alpha |
| Inactive range/switch track | Primary text at 17% alpha | Primary text at 17% alpha |

These are surface defaults. Measure the final text and input edges against their actual composite background. A quiet separator token is not automatically suitable for a required input boundary or focus ring. Body/control text needs 4.5:1 in ordinary cases; meaningful control boundaries and focus indicators need 3:1 against adjacent colors.

| Geometry | Default |
| --- | --- |
| Panel radius | `20px` |
| Floating-panel width / content inset | `360px / 12px` |
| Button, field, menu-item radius | `8px` |
| Segment rail / inset / selected radius | `8px / 2px / 6px` |
| Desktop control height | `32px` |
| Compact toolbar control height | `28px` |
| Space inside a group / between groups | `8px / 20px` |
| Glass blur / saturation | `40px / 1.3` |

## Glass belongs to the outer layer

Put blur on a single panel layer. Keep controls and text outside any `filter: blur()` subtree. Use an opaque fallback before the feature query:

```css
.silken-panel {
  border: 0;
  border-radius: 20px;
  background: #1c1c1f;
  box-shadow:
    0 30px 80px rgb(0 0 0 / 55%),
    0 0 0 1px rgb(255 255 255 / 9%);
}

@supports (backdrop-filter: blur(1px)) {
  .silken-panel {
    background: rgb(28 28 31 / 80%);
    backdrop-filter: blur(40px) saturate(1.3);
    -webkit-backdrop-filter: blur(40px) saturate(1.3);
  }
}
```

The broad shadow separates the floating shell from its surroundings; the 1px shadow gives it an edge. Do not repeat the large shadow on buttons. In forced-colors mode, add a real `1px solid CanvasText` border because shadows may disappear.

For light mode use `0 30px 80px rgb(0 0 0 / 24%), 0 0 0 1px rgb(0 0 0 / 6%)`. For embedded row groups, use a stable card fill and 12px radius. The floating glass shell and embedded card are different surface roles.

## Close nested corners follow the inset

For an evenly inset child, calculate:

`outer radius = inner radius + padding + border width`

For example, an 8px inner radius with a 12px inset and no layout border yields a 20px shell radius. A segment rail with 2px inset and a 6px selected-item radius yields an 8px rail radius. With large or asymmetric spacing, treat the surfaces independently and choose their existing radius tokens.

Do not make all containers pills. A long capsule, a rounded rectangle, and a circular icon action communicate different relationships.

## Distinguish media edges from control edges

Place a 1px neutral inset outline on opaque content images when the edge needs definition. Use white at 10% in dark mode and black at 10% in light mode, with `outline-offset: -1px`. Leave transparent logos and illustrations alone.

Resting fields use the same 7% theme-relative fill as buttons, with a transparent layout border. Focus changes the field border to the accent; invalid state adds its message and distinct treatment. Do not add a conspicuous frame to every resting field as a generic polish step. Assess contrast in context and use the host's accessible field pattern when the baseline cannot satisfy its requirements.
