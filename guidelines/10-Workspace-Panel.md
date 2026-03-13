# 10 — Workspace Panel

The WorkspacePanel is the right-side panel. It shows the agent's active work: the current plan, output artifacts, and data context. It has three tabs: Plan, Outputs, and Context.

---

## Spec

| Property | Value |
|---|---|
| Width | ~360px default (resizable) |
| Background | `--card` = #FFFFFF |
| Left border | `1px solid var(--muted)` |
| Height | Full panel height |

---

## Panel Header

| Property | Value |
|---|---|
| Height | 48px |
| Label | "Workspace" |
| Font | `text-lg` (16px) semibold |
| Background | `--card` |
| Border bottom | `1px solid var(--muted)` |
| Right actions | Collapse button (closes panel → CollapsedPanelStrip), Run in SQL runner button |

### "Run in SQL runner" Button

> ⚠️ Currently uses `bg-accent` (#008489). Should be `<Button variant="default">` with `bg-primary`. See [`04-Buttons.md`](04-Buttons.md).

---

## Tab Bar

Three tabs: **Plan** · **Outputs** · **Context**

| State | Style |
|---|---|
| Active | `bg-primary/10` — light teal tint; text `--foreground` semibold |
| Inactive | Transparent; text `--secondary-foreground` |
| Hover | `bg-background-hover` |
| Padding | `px-[12px] py-[6px]` |
| Radius | `rounded-[4px]` |

---

## Plan Tab

Shows the agent's execution plan as a numbered list of steps.

### Step States

| State | Circle visual | Text style |
|---|---|---|
| **Done** | Filled `bg-chart-5/10` with green checkmark SVG (12×12, stroke `--chart-5`) | `text-foreground`, weight 600 |
| **Running** | Animated spinner: `--primary` stroke, SVG dasharray animation | `text-foreground` semibold + sub-label "Awaiting approval…" or step detail |
| **Pending** | Empty circle, `border border-border` only | `text-secondary-foreground` |

### Step Counter

A count badge shows total steps: e.g. `6` in a small `bg-muted rounded-full` pill next to "Plan".

### Step Layout

```
[Circle icon]  [Step title — text-base]
               [Step sub-label — text-sm, text-secondary-foreground]
```

---

## Outputs Tab

Lists all output artifacts produced during the session.

### Output Item

| Property | Value |
|---|---|
| Padding | `px-[12px] py-[6px]` |
| Radius | `rounded-[4px]` |

| State | Background |
|---|---|
| Default | Transparent |
| Active (selected) | `bg-primary/10` |
| Hover | `bg-background-hover` |

Each item:
- Leading badge: `BlockTypeBadge` (compact, same spec as in ChatPanel)
- Label: `text-base` `text-foreground`

---

## Context Tab

Lists the data sources the agent has analysed or is using.

### Context Item

| Property | Value |
|---|---|
| Height | 32px |
| Layout | Flex row: icon + table/view name + row count badge |
| Icon | Table/dataset icon, 16×16px, `text-secondary-foreground` |
| Name | `text-base text-foreground` |
| Row count | `text-sm text-secondary-foreground` (e.g. "2.4M rows") |

---

## Expanded Content Area

When an output item is selected in the Outputs tab, the bottom portion of the Workspace panel (or a scrollable region) shows the full artifact:
- SQL: Syntax-highlighted code block with `Copy` button
- Table: Full data table
- Chart: Rendered visualisation

### Artifact Header

```
[Title]                [Run in SQL runner]  [Copy]
```

- Code block background: `--card` or `--background` depending on variant
- Code font: `--font-mono` (Fira Code / JetBrains Mono)
- Code colors: use code-editor palette, NOT UI tokens
