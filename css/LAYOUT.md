# Question 4 — layout notes

## Breakpoint

**768px** (`min-width: 768px` for desktop grid). Below that width, layout is single-column mobile.

## Desktop (3 columns)

| Row | Columns |
|-----|---------|
| 1 | A (span 2), B |
| 2 | C, D, E |
| 3 | F, G, H |

## Mobile

Hidden: **E, F, H** (`display: none`).

Visual order via CSS `order`: **A → D → B → C → G**.

DOM order remains **A, B, C, D, E, F, G, H** (no duplicated markup).

## Keyboard navigation and screen readers

- **Tab order** follows DOM order (A, B, C, …), not the mobile visual reorder.
- **Screen readers** typically read in DOM order; mobile users hear B before D even though D appears second visually. This is an accepted trade-off given the brief forbids duplicate sections and JavaScript; mitigations in production might include reordering DOM for mobile with flex/grid without cloning content, or matching DOM order to the most important reading order.

## Long heading

Cell **A** uses `min-width: 0` and `overflow-wrap: break-word` on the heading so long text wraps inside the grid cell.

## Screenshots

Captured at 1200×800 (desktop) and 375×812 (mobile) against `css/index.html` via local HTTP server. See [screenshots/](screenshots/).
