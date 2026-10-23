# Check the material in its scene

Glass is a relationship between the backdrop and the floating surface. Verify the relationship visually and in the browser rather than accepting a CSS property by itself.

## Material baseline

Use this coordinated baseline for the floating surface and its controls. Adapt it through shared tokens when the host product requires another density.

| Surface detail | Baseline |
| --- | --- |
| Floating shell | 360px width, 20px radius, 12px inset |
| Backdrop | 40px blur, saturation 1.3 |
| Shell tint | Dark `(28,28,31,.8)`, light `(244,244,245,.8)` |
| Dark shadow | 30px vertical offset, 80px blur, black at 55%, white 9% edge |
| Control fills | Theme text at 7% default and 12% hover |
| Glass selection | White at 18% in dark glass |
| Fields | 32px high, 8px radius, filled, border appears on focus |
| Switch | 40×24px track, 18px thumb, 3px inset |
| Slider | 4px track, 16px white thumb |

## Diagnose a flat-looking result

1. Inspect the computed fill and filter. The supported baseline should resolve to an alpha fill and `blur(40px) saturate(1.3)`. An opaque background declaration can cover a correct filter.
2. Inspect the sampled scene. Put recognizable edges and some color changes behind the surface. Huge uniform tiles provide almost nothing to blur. Use the user's actual context when supplied.
3. Keep the surface's foreground crisp. Applying `filter: blur()` to the card blurs its controls. Applying `opacity` to the whole shell dims its text and creates different compositing behavior. Put transparency in the background color.
4. Inspect ancestor effects and clipping if the panel samples only part of the scene. Do not move material into an isolated decorative layer without checking what the browser actually samples. Check unsupported-filter fallback separately.
5. Temporarily disable just `backdrop-filter` while holding the tint and scene still. Compare the same area. Recognizable detail should reappear in the no-filter render; color should remain visible in the filtered render. If both look the same, investigate the scene, alpha, layering, and filter support.
6. Temporarily switch to the opaque fallback. The glass and opaque renders should differ over a varied background. If the filtered version merely looks like a solid gray form, restore the backdrop relationship before polishing typography.

## Keep specimen context honest

Use the same control markup and material CSS when comparing backgrounds. Use original varied artwork in distributable specimens and allow tuning blur and transmission. Keep identifiable third-party screenshots, project names, repository URLs, revision IDs, and internal file paths out of style documentation and presentation assets. Retain required third-party license notices in the license file.

Record computed material values, the two rendered comparisons, and visual observations separately. Pixel differences demonstrate a changed render, not artistic fidelity. Do not claim full fidelity from a working filter or a passing validator.
