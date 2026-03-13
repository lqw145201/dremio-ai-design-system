# 11 — Catalog Panel

The CatalogPanel replaces the WorkspacePanel when the user is browsing the data catalog (e.g. to select where to save a generated view). It renders a tree of namespaces, schemas, and tables.

---

## Spec

| Property | Value |
|---|---|
| Width | ~360px (same slot as WorkspacePanel, resizable) |
| Background | `--card` = #FFFFFF |
| Left border | `1px solid var(--muted)` |

---

## Panel Header

| Property | Value |
|---|---|
| Height | 48px |
| Label | "Catalog" |
| Sub-label | "Powered by Polaris" — `text-sm text-muted-foreground` |
| Background | `--card` |
| Border bottom | `1px solid var(--muted)` |

---

## Tree Structure

The catalog is a hierarchical tree:

```
Namespaces (2)
  └─ Dremio_samples
       └─ NYC-taxi-trips
       └─ SF-weather
  └─ Production
       └─ citibike
       └─ Analytics

Connections (4)
  └─ Glue
  └─ Unity
  └─ AWS Samples
```

### Indentation

Each level is indented by `16px` per depth level.

---

## TreeItem (Browse Mode)

Default mode — user is browsing without picking a save location.

| State | Background | Text color |
|---|---|---|
| Default | Transparent | `--foreground` |
| Active (current selection) | `bg-[#e9f5f9]` | `--foreground` |
| Hover | `bg-muted/50` | `--foreground` |

| Property | Value |
|---|---|
| Height | `h-[32px]` |
| Padding | `px-[8px]` |
| Radius | `rounded-[4px]` |
| Expand icon | Chevron-right, 16×16px, `text-secondary-foreground` |
| Item icon | Type-specific icon (namespace, table, folder), 16×16px |
| Label | `text-base text-foreground` |

---

## PickableTreeItem (Save / Pick Mode)

Activated when the agent asks the user to select a save location (e.g. "Where should I save this view?"). Items become selectable.

| State | Background | Text color |
|---|---|---|
| Default | Transparent | `--foreground` |
| Selected (chosen) | `bg-primary/10` — light teal tint | `--primary` or `--foreground` |
| Hover | `bg-muted/50` | `--foreground` |

Dimension spec is identical to TreeItem.

> The only visual difference between browse mode and pick mode is: **active = `bg-[#e9f5f9]`** (browse) vs **selected = `bg-primary/10`** (pick).

---

## Section Labels

| Label | Style |
|---|---|
| "Namespaces (N)" | `text-sm text-secondary-foreground font-semibold`, `px-[8px] py-[4px]` |
| "Connections (N)" | Same |

---

## Empty State

If a namespace has no children:
- Label: "No objects found"
- Color: `--muted-foreground`
- Padding: `px-[8px] py-[4px]`

---

## Relationship to WorkspacePanel

- Both panels occupy the same layout slot (right panel)
- The active panel is toggled by the agent's current state (browsing vs. working)
- Both share the same width, border, and header height spec
- When collapsed, both contribute to `CollapsedPanelStrip`
