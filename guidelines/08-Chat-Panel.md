# 08 — Chat Panel

The ChatPanel is the central panel. It shows the full conversation thread between the user and the AI Agent.

---

## Spec

| Property | Value |
|---|---|
| Width | flex-1 (fills remaining space between ChatListPanel and WorkspacePanel) |
| Background | `--card` = #FFFFFF |
| Right border | `1px solid var(--muted)` |
| Layout | Flex column: header + scrollable message thread + input bar |

---

## Message Types

### User Message

| Property | Value |
|---|---|
| Alignment | Right-aligned or contained in `bg-muted` bubble |
| Background | `bg-muted` = #EEEFF1 |
| Radius | `rounded-[var(--radius-card)]` = 8px |
| Padding | `px-[16px] py-[12px]` |
| Text | `text-base` (#202124) |
| Max width | ~70% of panel width |

### AI Message

| Property | Value |
|---|---|
| Alignment | Left-aligned |
| Background | None (transparent) |
| Text | `text-base` (#202124) |

---

## ToolCallsBlock

Appears after the AI response when the agent used tools. Contains an expandable list of tool calls.

| Property | Value |
|---|---|
| Background | `bg-background` = #F6F7F8 |
| Border | `border border-muted` |
| Radius | `rounded-[var(--radius-card)]` = 8px |
| Padding | `px-[12px] py-[8px]` |
| Collapsed label | "Used N tools ↓" |
| Expanded | List of individual tool calls with name and status |

Each tool call row:
- Icon: tool-type icon, 16×16px, `text-secondary-foreground`
- Name: `text-base` semibold
- Status: small badge or icon (success = green check, running = spinner)

---

## Output Block

Output blocks are the structured results the agent produces (SQL query, table scan, chart, etc.).

### Block Card

| Property | Value |
|---|---|
| Background | `--card` |
| Border | `border border-muted` (default) or `border-chart-5/30` (executed state) |
| Radius | `rounded-[var(--radius-card)]` = 8px |
| Padding | `px-[12px] py-[8px]` |

### Block Header Row

```
[BlockTypeBadge]  [Title — text-sm semibold, text-secondary-foreground]     [TimeBadge]
```

- `BlockTypeBadge` → left
- Title → `flex-1 overflow-hidden text-ellipsis whitespace-nowrap`
- `TimeBadge` → right, `ml-auto`

### Block States

**Default / preview:**
- Border: `border-muted`
- Shows partial content with overflow fade

**Executed (success):**
- Border: `border-chart-5/30`
- Header gains: green checkmark (12×12, stroke `--chart-5`) + "EXECUTED" badge (`bg-chart-5/10 text-chart-5`)

**Hover:**
- Border switches to `border-primary`
- Cursor: pointer (opens full view in Workspace)

### Output Types and Content

| Block type | Content |
|---|---|
| `sql` | Syntax-highlighted SQL code, truncated to ~3 lines |
| `table` | Preview table: first 3-4 rows, column headers |
| `chart` | Chart/visualisation thumbnail |
| `explanation` | Prose markdown text |
| `dataset` / `view` | Dataset/view name + metadata (row count, schema) |

---

## Approval Block

Shown when the agent needs user approval before executing a destructive or schema-modifying operation (DDL, DML).

### Spec

| Property | Value |
|---|---|
| Background | `--card` |
| Border | `border border-border` |
| Radius | `rounded-[var(--radius-card)]` |

### Header

```
[ApprovalBadge "ACTION REQUIRED"]  [Operation title — e.g. "DDL/DML Operation"]
```

### Body

- Description text: "I need to execute the following SQL statements:"
- Code preview: SQL to be executed (truncated, syntax-highlighted)

### Action Buttons (bottom of card)

Four buttons in a row:

| Button | Variant | Description |
|---|---|---|
| "Always allow in [scope]" | Ghost | Permanently allow this operation type in this namespace |
| "Allow once" | Ghost | Allow this single execution |
| "Execute" | Primary-style (currently uses `bg-accent` — see note) | Confirm and execute |
| "Request changes" | Ghost | Send feedback to the agent |

> ⚠️ "Execute" currently uses `bg-accent` (#008489). It should be `<Button variant="default">` with `bg-primary` (#43B8C9). See [`04-Buttons.md`](04-Buttons.md) for the known inconsistency.

---

## "Used N tools" Summary

Between AI message and output blocks:

| Property | Value |
|---|---|
| Text | "Used N tools" |
| Style | `text-sm text-secondary-foreground` |
| Icon | Chevron/arrow to expand |
| On click | Expands ToolCallsBlock inline |

---

## Panel Header

| Property | Value |
|---|---|
| Height | 48px |
| Content | Chat session title (current chat name) |
| Background | `--card` |
| Border bottom | `1px solid var(--muted)` |
| Actions | Optional: share, export (right side) |
