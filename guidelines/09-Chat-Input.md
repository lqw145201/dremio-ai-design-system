# 09 — Chat Input

The ChatInput is the text entry bar at the bottom of the ChatPanel.

---

## Spec

| Property | Value |
|---|---|
| Background | `--card` = #FFFFFF |
| Container border | `border border-border` |
| Radius | `rounded-[var(--radius-card)]` = 8px |
| Padding | `px-[12px] py-[8px]` |
| Position | Bottom of ChatPanel, sticky |
| Width | Full width of ChatPanel minus padding |

---

## Textarea

| Property | Value |
|---|---|
| Placeholder | Context-dependent ("Ask the AI Agent anything…" or similar) |
| Placeholder color | `--muted-foreground` (#B0B7BF) — correct and intentional use |
| Text color | `--foreground` (#202124) |
| Font | Inter, 14px, regular |
| Min height | ~40px (single line) |
| Resize | Vertical auto-expand as user types |
| Background | Transparent (inherits from container) |
| Border | None on textarea itself |

---

## Footer Actions

Below or inside the input bar:

| Element | Description |
|---|---|
| Attach / paperclip icon | Attach data files or context — ghost icon button, 20×20px |
| Submit button | Arrow/send icon button — active when input has content |

### Submit Button States

| State | Style |
|---|---|
| Empty (no text) | `opacity-50` disabled |
| Has text | Active, `text-primary` or filled |

---

## Focus State

When the textarea is focused:
- Container border: `border-primary` (#43B8C9)
- No other visual changes

---

## Usage Notes

The ChatInput placeholder text uses `--muted-foreground` correctly (it is actual placeholder text). This is one of the few places where `--muted-foreground` is the right choice.
