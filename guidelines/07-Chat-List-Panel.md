# 07 — Chat List Panel

The ChatListPanel is the leftmost panel in the AI Agent view. It shows the list of recent chat sessions and allows creating or searching for chats.

---

## Spec

| Property | Value |
|---|---|
| Width | 240px (default, resizable) |
| Min width | ~160px |
| Background | `--card` = #FFFFFF |
| Right border | `1px solid var(--muted)` — NOT `var(--border)` |
| Height | Full panel height (below TopNav) |

---

## Layout

```
ChatListPanel
  ├─ Header area
  │    ├─ "New chat" button (ghost, full width, with + icon)
  │    └─ "Search chats" input (with search icon)
  └─ Recent chats section
       ├─ Section label: "Recent chats" (text-sm, text-muted-foreground)
       └─ ChatItemRow × N
```

---

## ChatItemRow

Each row represents one chat session.

### Spec

| Property | Value |
|---|---|
| Height | 40px |
| Padding | `px-[8px]` |
| Radius | `rounded-[4px]` |
| Layout | Flex row, items-center |

### States

| State | Background | Text |
|---|---|---|
| Default | Transparent | `--foreground` |
| Hover | `bg-muted/50` | `--foreground` |
| Selected (active chat) | `bg-muted` (#EEEFF1) | `--foreground`, weight 600 |

### Hover Actions

When a row is hovered, a **more button (⋯)** appears:

| Property | Value |
|---|---|
| Size | `size-[24px]` (24×24px) |
| Visibility | `opacity-0 group-hover:opacity-100` — never visible by default |
| Position | Right side of row, `ml-auto` |
| Icon | 3-dot / ellipsis, 16×16px |
| On click | Shows context menu: Rename, Delete |

> ⚠️ The more button is **never unconditionally visible**. It must use the `group` / `group-hover:opacity-100` pattern.

```tsx
<div className="group relative rounded-[4px] ...">
  <span className="flex-1 truncate">{chat.title}</span>
  <button className="size-[24px] opacity-0 group-hover:opacity-100 transition-opacity">
    <IconMoreHorizontal size={16} />
  </button>
</div>
```

---

## "New chat" Button

- Uses ghost variant: `<Button variant="ghost">`
- Full width: `w-full justify-start`
- Leading icon: `+` / add icon, 16×16px
- Label: "New chat"

## Search Chats Input

- Placeholder: "Search chats"
- Placeholder color: `--muted-foreground`
- Background: `--background` = #F6F7F8
- Leading icon: Search icon, 16×16px, `text-muted-foreground`
- Height: 32px
- Radius: `rounded-[4px]`

---

## Section Label

- Text: "Recent chats"
- Color: `--muted-foreground` (correct: this is a label for an empty/structural section)
- Size: `text-sm` (12px)
- Padding: `px-[8px] py-[4px]`
