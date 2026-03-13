# 03 — Badges & Tags

Three badge types appear in the AI Agent chat interface. All are small, inline, non-interactive labels.

---

## BlockTypeBadge

Indicates the type of an output block (SQL query result, table scan, chart, etc.). Appears in the block header row alongside the block title and TimeBadge.

### Spec

| Property | Value |
|---|---|
| Height | `h-[20px]` |
| Padding | `px-[6px] py-px` |
| Background | `bg-card` — white |
| Border | Absolute overlay `div`: `border border-border` (1px, `--border` = #D2D6DA) |
| Radius | `rounded-[var(--radius-button)]` = 4px |
| Text size | 9px (inline style) |
| Text weight | `font-semibold` (600) |
| Text case | `uppercase` |
| Text color | `text-secondary-foreground` (#505862) — all types |
| Letter spacing | `tracking-[0.3px]` |

> ⚠️ The border is **not** a CSS `border` property on the container. It is a separate `<div aria-hidden="true">` positioned `absolute inset-0` with `border border-border rounded-[inherit]`. This preserves the inner padding without it being affected by the border box model.

### Type → Label Mapping

| `type` prop | Displayed label | Notes |
|---|---|---|
| `sql` | SQL | SQL query output |
| `table` | TABLE | Tabular data scan |
| `chart` | CHART | Visualisation |
| `explanation` | TEXT | Prose explanation block |
| `dataset` | TABLE | Dataset reference (same label as `table`) |
| `view` | VIEW | View reference |

All types share **identical visual styling** — there is no accent-colored or highlighted variant.

### Usage

```tsx
<BlockTypeBadge type="sql" />
<BlockTypeBadge type="table" />
<BlockTypeBadge type="chart" />
```

---

## TimeBadge

Shows query or tool execution time (e.g. "0.8s"). Uses a green color scheme from `--chart-5`.

### Spec

| Property | Value |
|---|---|
| Background | `bg-chart-5/10` — rgba(90, 189, 74, 0.10), light green tint |
| Text color | `text-chart-5` — `--chart-5` = #5ABD4A (green) |
| Padding | `px-[6px] py-px` |
| Radius | `rounded-[var(--radius-button)]` = 4px |
| Text size | 9px (inline style) |
| Text weight | `font-semibold` (600) |
| No border | TimeBadge has no border, unlike BlockTypeBadge |

> ⚠️ `--chart-5` resolves to **green** (#5ABD4A), not blue. This is easily confused with the info/FYI color (#277ABD) which is a separate, unrelated token.

### Usage

```tsx
<TimeBadge time="0.8s" />
<TimeBadge time="1.2s" />
```

---

## ApprovalBadge

Appears on blocks requiring user approval before the agent proceeds (DDL/DML operations, schema changes, etc.). Styled in destructive red.

### Spec

| Property | Value |
|---|---|
| Background | `bg-destructive/10` — rgba(202, 63, 50, 0.10) |
| Text color | `text-destructive` — #CA3F32 |
| Height | `h-[20px]` |
| Padding | `px-[6px] gap-[4px]` |
| Icon | 12×12px warning triangle SVG, `stroke: var(--destructive)` |
| Label | "ACTION REQUIRED" |
| Text size | 9px semibold uppercase |

### Usage

ApprovalBadge appears in the block header of any block that requires user approval before execution. It is always accompanied by action buttons: "Always allow in [scope]", "Allow once", "Execute", "Request changes".

---

## Badge Layout in Block Headers

The standard block header pattern:

```
[BlockTypeBadge]  [Block title — text-secondary-foreground, text-sm semibold]     [TimeBadge]
```

- BlockTypeBadge is always leftmost
- Title text is `overflow-hidden text-ellipsis whitespace-nowrap flex-1`
- TimeBadge is pushed to the far right with `ml-auto` or flex justify-between
- For approval blocks: `[ApprovalBadge]  [Block title]` — no TimeBadge

---

## Workspace Panel Badge Variants

The Workspace output tab list uses a slightly different badge pattern:

| Label | Background | Text |
|---|---|---|
| SQL | `bg-card` + border | `--secondary-foreground` |
| TABLE | `bg-card` + border | `--secondary-foreground` |
| VIS | `bg-card` + border | `--secondary-foreground` |

Note: In the Workspace panel, `chart` type maps to "VIS" (not "CHART") per `BLOCK_TYPE_LABELS_WORKSPACE`.
