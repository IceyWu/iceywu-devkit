---
name: design-md
description: Use when you want AI-generated UI to follow a concrete visual language from DESIGN.md templates, with consistent color, typography, spacing, components, and responsive behavior.
metadata:
  author: IceyWu
  version: "2026.06.02"
  source: Adapted workflow for awesome-design-md usage in agent projects
---

# design-md

Use this skill to make frontend output stylistically consistent by grounding the agent in a single DESIGN.md.

## What You Get

- A repeatable workflow to choose one style and apply it across pages.
- Prompt templates that keep the agent aligned with the same design language.
- A quality checklist to avoid style drift during iterative edits.

## Quick Start

1. Choose one style source from the shortlist in [references/style-shortlist.md](references/style-shortlist.md).
2. Copy that template into your project root as DESIGN.md.
3. Tell the coding agent to implement UI strictly according to DESIGN.md.
4. For follow-up changes, keep referencing the same DESIGN.md to prevent drift.

## Prompt Templates

Use one of these prompts directly.

### Initial Build

Build this page using DESIGN.md in the project root as the single source of visual truth. Strictly follow color roles, typography hierarchy, spacing scale, component styles, and responsive rules from DESIGN.md. Keep business logic unchanged and only implement UI.

### Restyle Existing Page

Refactor current UI to match DESIGN.md exactly. Do not change behavior or data flow. Focus on visual consistency: palette, type scale, radius, shadows, spacing rhythm, and interaction states.

### Add New Section

Add a new section that looks native to this product style. Reuse existing tokens and patterns from DESIGN.md. If any decision is ambiguous, prefer consistency with existing sections over novelty.

## Guardrails

- Use one DESIGN.md per product surface unless explicitly split by brand.
- Do not mix style systems from multiple templates.
- Keep components token-driven instead of one-off hardcoded values.
- Re-check mobile breakpoints after every major layout change.

## Output Checklist

- Colors map to semantic roles defined in DESIGN.md.
- Typography follows the documented hierarchy and weights.
- Buttons, cards, forms, and nav states are style-consistent.
- Spacing and layout rhythm are consistent across sections.
- Mobile and desktop layouts both follow the same visual language.

## Notes

- This skill is workflow-oriented and works with any framework.
- Source catalog reference: https://github.com/VoltAgent/awesome-design-md
