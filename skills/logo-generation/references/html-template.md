# HTML Logo Preview Template

Use this skeleton to render multiple SVG logo concepts side-by-side. Group concepts by category under section headers so reviewers can compare within and across types at a glance.

Key layout rules:
- **Section headers** (`<h2>`) separate Pure Text / Pure Graphic / Combination — makes category distinction visually obvious.
- **120×120 SVG rendering** inside a `.mark` container gives enough room to see detail.
- **Wide cards** (`style="width:260px"`) for wordmarks and combination marks that need horizontal space.
- **`.card.dark`** variant for light-on-dark concepts.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Logo Preview</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f4f1; font-family: "Inter", system-ui, sans-serif; padding: 40px; }
  .section { margin-bottom: 48px; }
  .section h2 { font-size: 13px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; padding-left: 8px; }
  .row { display: flex; flex-wrap: wrap; gap: 24px; }
  .card { width: 220px; background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; padding: 32px 20px 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .card.dark { background: #1e1e24; border-color: #333; }
  .card.dark .label { color: #ccc; }
  .mark { width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; }
  .label { font-size: 13px; font-weight: 600; color: #1a1a1a; text-align: center; }
</style>
</head>
<body>

<div class="section">
  <h2>Pure Text</h2>
  <div class="row">
    <div class="card">
      <div class="mark">
        <svg width="120" height="120" viewBox="0 0 72 72">
          <!-- Pure text SVG: filled text, no filter, no graphic elements -->
        </svg>
      </div>
      <div class="label">Concept Name</div>
    </div>
  </div>
</div>

<div class="section">
  <h2>Pure Graphic</h2>
  <div class="row">
    <div class="card">
      <div class="mark">
        <svg width="120" height="120" viewBox="0 0 72 72">
          <!-- Pure graphic SVG: shapes with hand-drawn filter, no &lt;text&gt; -->
        </svg>
      </div>
      <div class="label">Concept Name</div>
    </div>
  </div>
</div>

<div class="section">
  <h2>Combination</h2>
  <div class="row">
    <div class="card">
      <div class="mark">
        <svg width="120" height="120" viewBox="0 0 72 72">
          <!-- Combo SVG: icon (with filter) + text (filled, no filter) -->
        </svg>
      </div>
      <div class="label">Concept Name</div>
    </div>
    <!-- Dark variant -->
    <div class="card dark">
      <div class="mark">
        <svg width="120" height="120" viewBox="0 0 72 72">
          <!-- Light-on-dark SVG -->
        </svg>
      </div>
      <div class="label">Dark Variant</div>
    </div>
  </div>
  <!-- Copy .card for more concepts -->
</body>
</html>
```

## Usage Notes

- **No `.label` text inside cards** — the SVG content itself IS the concept. Section headers (`<h2>`) tell reviewers which category they're looking at. Descriptive labels bleed text into every card, making pure graphic concepts appear to have text.
- Keep the same `viewBox="0 0 72 72"` across all SVG concepts for fair visual comparison.
- Use `style="width:280px"` on wordmark and combination cards that need horizontal space.
- Render SVGs at 140×140 inside `.mark` for clear detail at a glance.
