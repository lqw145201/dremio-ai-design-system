# 12 — Collapsed Panel Strip

The CollapsedPanelStrip renders on the right edge of the screen when one or more side panels (WorkspacePanel, CatalogPanel) are collapsed. It provides a compact set of vertical icon buttons to re-expand each panel.

---

## Spec

| Property | Value |
|---|---|
| Width | ~40px |
| Height | Full panel height |
| Background | `--card` = #FFFFFF |
| Left border | `1px solid var(--muted)` |
| Layout | Flex column, items-center, `gap-[4px]`, `pt-[8px]` |

---

## Strip Icon Button

Each collapsed panel contributes one icon button to the strip.

| Property | Value |
|---|---|
| Size | `size-[32px]` (32×32px) |
| Icon size | 20×20px |
| Default color | `text-secondary-foreground` |
| Hover background | `bg-muted/50` |
| Hover color | `text-foreground` |
| Radius | `rounded-[4px]` |
| Tooltip | Panel name on hover (e.g. "Workspace", "Catalog") |

---

## Behaviour

- Clicking a strip button re-expands the panel to its previous width
- When a panel is expanded, its button disappears from the strip
- If all panels are collapsed, the strip shows both buttons
- If no panels are collapsed, the strip is hidden entirely (zero width)

---

## Transition

Panel collapse/expand uses CSS transitions:
- Width transition: `transition-[width] duration-200 ease-in-out`
- The strip fades in as panels collapse
