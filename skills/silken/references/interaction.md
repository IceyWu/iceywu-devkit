# Interaction and verification

## Quiet feedback, stable layout

Use [motion](motion.md) for shared timing, control feedback, surface transitions, interruption, and reduced motion. State semantics update immediately; feedback must preserve control dimensions. Keep pointer-only hover inside `@media (hover: hover) and (pointer: fine)`.

## Keyboard and targets are part of the component

- Use native input, select, button, checkbox, radio, and range behavior when possible. Use the project's accessible primitives for dialogs, tabs, menus, and custom selects.
- Use a visible 2px focus ring with a 2px offset where layout permits; use an inset equivalent inside a clipped rail. Check it against neighboring surfaces.
- The compact desktop family must still provide at least a 24×24px target, or the applicable spacing exception. Prefer 44×44px on coarse pointers. Expanded targets must not overlap.
- Loading communicates busy state while preserving dimensions and preventing duplicate submission. Disabled uses actual semantics, not only a faded color.
- Overlays manage focus and dismissal, return focus to their trigger, and use `overscroll-behavior: contain` on their scrolling area. Visual effects do not replace these behaviors.

## Inspect at the size people use

1. Render the real component in its intended context at 100% scale. Compare silhouette, padding, label sizes, icon weights, and selected surfaces with the reference or agreed baseline.
2. Use pointer and keyboard to reach the defined states. Check focus, labels, range stepping, selection, disabled behavior, and loading dimensions that apply to the component.
3. Recheck at 320px width and 200% zoom where relevant to the host. Use long labels, empty values, and realistic item counts. Look for lost content, overlapping targets, and a slider thumb clipped at its limits.
4. Check reduced motion and coarse-pointer styling when motion or hover is present. Verify that a contrast claim uses the final composite background.

Record the checks actually performed. Source inspection, browser interactions, and screenshot comparison establish different things. Passing a validator or finding no console errors does not establish visual quality. Where a reference measurement is inferred from an image, say so rather than presenting it as an extracted token.
