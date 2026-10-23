# Motion

Motion should explain where a surface came from, which choice moved, and whether an action completed. Preserve the glass material and the quiet geometry of the controls. Read this file when adding or reviewing transitions; use the runnable patterns in [the specimen](../assets/controls.html).

## Shared timing

| Token | Default | Use |
| --- | --- | --- |
| `--motion-fast` | 120ms | Hover, checkmark, icon and label crossfade |
| `--motion-press` | 150ms | Button press and release |
| `--motion-move` | 220ms | Shared selection indicator, switch thumb |
| `--motion-size` | 300ms | A small content region changing height |
| `--motion-enter` | 220ms | Panel and dialog entrance |
| `--motion-exit` | 160ms | Panel and dialog dismissal |
| `--ease-standard` | `cubic-bezier(.4,0,.2,1)` | Color and opacity changes |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | Travel and surface entry |

These values form a starting set. Read tokens from computed styles when scripting motion in a host application. If JavaScript repeats a duration, keep its value synchronized with the CSS token. Do not add a motion dependency just for these effects.

## Controls

- **Buttons:** enabled press scales to .96 over 150ms. Use the existing center; do not change padding or hit area. Keep fields, frequent row choices, and text tabs stationary. Hover changes fill over 120ms on fine pointers only.
- **Segments and tabs:** one selected surface travels inside the rail over 220ms. Update selection semantics immediately. Labels stay still. A new target replaces the old destination; never queue moves or delay input.
- **Switches:** the 18px thumb travels 16px inside a 40×24px track over 220ms. Its pressed width can become 22px without changing the target size. On/off meaning remains visible with no animation.
- **Checkboxes and chips:** fill and checkmark settle over 120ms. A checkmark may grow from .6 to 1 while fading in; do not bounce the whole control. Radio changes remain local to the dot.
- **Sliders:** the value and fill track the pointer directly. Do not tween values behind the pointer. A thumb may scale to 1.12 while actively dragged; preserve the input's hit area and keyboard behavior.
- **Completion:** crossfade icon or label in a shared grid slot over 120ms. Reserve the larger label's width before activation. Start success feedback after the action succeeds; never simulate a save delay. Reset the prior dismissal timer on repeated actions. A 1600ms visual confirmation is suitable for this specimen; retain essential results in readable status text.
- **Loading and progress:** reserve dimensions; use actual busy semantics. Progress reflects reported work. Indeterminate motion stops under reduced motion and leaves a readable busy label. Do not invent percentages.

## Floating surfaces

Keep `backdrop-filter`, tint, shadow, and border radius constant during an entrance. Animate the surface with opacity and a small transform. Do not animate blur radius, shadow spread, or a background photograph. Avoid idle drifting, glow pulses, overshooting springs, and staggered rows.

| Surface | Entrance | Exit | Origin and behavior |
| --- | --- | --- | --- |
| Floating panel | Opacity 0→1, scale .96→1, offset 8→0px; 220ms | Reverse over 160ms | Toward its real trigger; first paint is stable |
| Dialog | Opacity 0→1, scale .98→1, offset 6→0px; 220ms | Reverse over 160ms | Center; backdrop may fade without blurring |
| Menu or popover | Opacity 0→1, offset 4→0px; 120–160ms | Opacity over 120ms | At the anchor edge; no scale if it blurs small text |
| Tooltip | Opacity over 120ms | Opacity over 80–120ms | No travel; follow the host's hover/focus delay |
| Inline disclosure | Current height→measured height; up to 300ms | Same | Only the requested region moves |
| Toast | Opacity and at most 6px travel; 160–220ms | 120–160ms | Keep a stable status region and readable message |

Do not introduce a tooltip, toast, or menu solely to demonstrate animation. Use the host's accessible primitives for overlays and honor their lifecycle hooks.

## Interruptibility and lifecycle

CSS transitions retarget from their current interpolated value. For scripted motion, sample the current rendered style before canceling the previous animation; start the replacement there. Keep one owner per animated property. Catch cancellation rejections from `Animation.finished`. Clear a pending replay, feedback timeout, or delayed open when a user issues a new command or the component unmounts.

For tabs or disclosure height, read the current container height, cancel its old height animation, reveal the new content, and measure its natural height. Animate between these two measurements; release the fixed height on completion. New content may fade in over 120ms without translating its labels. Avoid `max-height: 1000px` tricks, per-frame DOM measurements, and `height: auto` interpolation assumptions. Clip only the animating content area; keep focus rings visible.

For a nonmodal panel, move focus to the external trigger before marking a closing subtree `inert` and `aria-hidden`. Update `aria-expanded` immediately. On reopen, remove inertness and focus a meaningful heading or control without waiting for a timer. Keep it mounted until the transition finishes; it must remain operable after rapid close/open/close input.

For a native dialog, call `showModal()` before entry. Intercept form dismissal and `cancel` for the exit animation, then call `close()` after the latest exit finishes. Preserve native focus return and modal semantics during the exit. Reopening cancels the exit so a stale completion cannot close the reopened dialog. Do not let the dialog's Escape also dismiss its parent panel.

## Reduced motion and performance

Honor `prefers-reduced-motion: reduce` on first render and when it changes. A local switch may reduce motion further; it cannot override the system preference. Remove scale, travel, height tweening, and indefinite spinning. Set selection, geometry, and visibility immediately; a short opacity change is optional. Cancel active scripted animations and settle each surface to its latest requested state. Do not leave a fixed height, invisible modal, or stale focus trap behind.

Suppress color transitions while switching the whole theme. Do not animate the entire page's colors or glass tint. Keep first paint stable. Avoid persistent `will-change`; only promote a surface temporarily if profiling shows a need. Opacity/transform can usually composite, but a glass surface may still require backdrop work; do not promise a frame rate without measuring on target hardware.

## Check in a running browser

1. Activate with pointer and keyboard. Observe press/release, selection travel, panel and dialog dismissal, and success feedback.
2. Change direction midway through an animation. The latest command must win without jumping back, queued motion, or stale close callbacks.
3. Switch between short and tall content repeatedly. After settling, height must be natural, content unclipped, and only one tabpanel exposed.
4. Verify focus return, hidden subtree inertness, Escape scope, and stable button dimensions during feedback.
5. Enable reduced motion before loading, and again during motion. Check both system and local preferences. All states must remain usable.
6. Confirm the glass still samples its background at rest. Record a short live preview when it helps review timing; a screenshot cannot demonstrate motion.
