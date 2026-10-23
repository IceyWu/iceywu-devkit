# Control recipes

These measurements form the default Silken family. Preserve an existing project's consistent density where appropriate. All controls inherit the same font and semantic tokens; only their geometry and behavior vary.

## Buttons share one optical line

| Variant | Geometry | Surface and state |
| --- | --- | --- |
| Primary | 32px high, 8px radius, 12px inline padding | Neutral high-contrast fill by default; product accent only when specified |
| Secondary | Same geometry as primary | Shared control fill; slightly stronger fill on hover |
| Quiet action | Same label baseline and hit area | Transparent resting surface; reveal a quiet fill on hover or focus |
| Icon action | 32px square, 8px radius, 14–16px SVG | Same fill as adjacent secondary buttons; useful accessible name |
| Compact action | 28px high, 8px radius | For dense toolbars, retaining a sufficient non-overlapping hit target |

Use a 6px gap between icon and label. For visibly unbalanced icon-plus-text buttons, start with 2px less padding on the icon side and inspect at actual size. Keep the SVG on one native grid, with `currentColor` and a stroke weight suited to the adjacent label. A loading spinner replaces or overlays a reserved icon slot; the label width stays stable.

Disabled controls retain their shape and a legible label with reduced emphasis. They do not acquire hover or pressed motion. A destructive action uses the existing danger treatment and a suitable confirmation or undo flow.

## Fields remain fields

Use a 32px-high desktop field with 10px inline padding, 8px radius, 13px/18px text, and a label 6px above it. Multiline fields grow with their content. Use 16px text in mobile text inputs to avoid automatic focus zoom.

The resting surface is the shared 7% text-relative fill with a transparent border. A focused field makes the border explicit; invalid state makes it meaningful. Native fields/selects should retain their semantics while matching this surface, rather than inheriting the platform's unrelated outlined skin.

- Search has a 16px leading icon and a clear action only when there is a value. Preserve the typed query on failure.
- Select has a trailing chevron with a reserved 16px slot. Use a native select for short, simple choices unless the project already has an accessible select component.
- An error has a persistent message associated with the field, plus an invalid boundary or icon. Placeholder copy is an example, not its label.
- Focus uses the reserved field border or the host's established ring without changing dimensions. Use an explicit invalid treatment and associated message for errors.

## Segments and tabs have different jobs

For two to five short mutually exclusive settings, use a 32px rail, 2px inset, and a 28px selected surface with 6px radius. Use 13px labels and 10px inline option padding. Keep labels fixed and move one shared raised indicator between choices over 220ms with `cubic-bezier(.22,1,.36,1)` when motion is enabled. Use native radios or the host's accessible segmented component.

For navigation between panels, use tabs with a panel relationship and proper arrow-key behavior. Do not apply `role="tab"` to ordinary buttons without implementing the interaction. When a row no longer fits, choose wrapping, a select, or an explicitly scrollable tab rail based on the content.

## Switches show a binary setting

Use a 40×24px track, 3px inset, and an 18px circular thumb that moves 16px. The thumb has a small downward shadow. Pressing may widen it to 22px while anchoring it to the current side. The off track uses the 17% text-relative fill; the on track uses the accent and a contrasting thumb. Keep the label on the same row and explanatory copy underneath when needed.

Use a checkbox input, `role="switch"` when appropriate, and its visible label. The thumb position must distinguish the state even without color. Let the row label activate the input. Enlarge the hit target without enlarging the visual track where density permits.

## Checkboxes and radios keep their own shape

Use a 16px square with 4px radius for a checkbox and a 16px circle for a radio. A selected checkbox has a check mark; a radio has a centered dot. Keep 8px between the mark and the label. Use native inputs or the host primitives so label clicks, Space, and radio arrow keys work.

## Sliders expose a useful value

Use a 4px track, a 16px white thumb, and at least 24px-high interaction region on desktop. Give the thumb a neutral hairline and short downward shadow. The unfilled track uses the 17% text-relative token; the filled track uses the accent. Pair it with a label and a tabular value. The thumb never clips at the limits.

Use a native range input for keyboard behavior. Read the minimum, maximum, and step from the task rather than inventing precision. Values with units need an accessible value description. Expand the interaction region to 44px on coarse pointers.

## Steppers keep the number stable

Use a 32px-high shared shell, 28px decrement/increment actions, and a tabular central value. Disable the boundary action at a true minimum or maximum. Use explicit accessible action names. Permit direct numeric entry when repeated stepping would be inefficient.

## Chips and badges do not replace every button

For multi-select choices use a 32px-high filled chip with 8px radius, a 16px check well, an 8px gap, and 13px text. Selected chips fill their check well; unchecked chips retain a fine inset mark. Do not reduce this choice control to a tiny outlined status pill. Passive status badges may use a separate compact treatment. Removable chips need a distinct remove action.

## Rows have a shared grid

For grouped settings, use a 12px-radius card, rows at least 56px high, 16px horizontal inset, 14px labels, and 12px supporting text. Hairlines begin at the label inset and omit the first row. Compact standalone tool rows can be shorter. Permit wrapping and keep trailing actions stable. Do not wrap every row in another card.

## Menus and popovers borrow the panel material

Use 8px outer padding, 32px menu items, and 8px item radii; derive the close-fitting container radius accordingly. Align labels and shortcut hints in columns. Separate destructive groups with space or a meaningful divider. Support Escape, focus return, dismissal, and contained scrolling through existing accessible primitives.

## Progress and feedback stay local

Use a 4px progress track with an explicit textual value when it matters. Preserve the last useful content while updating. Place completion or error feedback beside the action that caused it; avoid a toast for every routine switch or selection.

## A specimen must prove the family

Show at least a text button, icon action, field, choice control, binary control, and a continuous-value control when evaluating this style as a kit. Place them at actual size on the same surface. Include selected, disabled, focusable, and invalid examples where relevant, and make their behavior reachable. This is a design exercise only when requested; do not insert a component gallery into a user's product screen.
