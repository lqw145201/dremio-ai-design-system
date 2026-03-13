# 04 — Buttons

All standard buttons use the `<Button>` component from `src/app/components/ui/button.tsx` (CVA-based). Never hand-build `<button>` elements for primary, secondary, ghost, or destructive actions.

---

## Variants

### Primary (default)

The main call-to-action. Maximum one per view.

| Property | Value |
|---|---|
| Background | `--primary` = #43B8C9 |
| Hover background | `--sidebar-primary` = #2E92A1 |
| Text | White |
| Border | None |

### Secondary

Supporting actions that sit alongside a primary button.

| Property | Value |
|---|---|
| Background | `--card` = #FFFFFF |
| Hover background | `--background` = #F6F7F8 |
| Text | `--secondary-foreground` = #505862 |
| Border | `border border-border` (1px, #D2D6DA) |

### Ghost (Tertiary)

Low-emphasis actions. Used for links, cancel actions, and icon-only controls.

| Property | Value |
|---|---|
| Background | Transparent |
| Hover background | `--background-hover` = #F1FAFB |
| Text | `--accent` = #008489 **always** |
| Border | None |

### Destructive

Used only for permanent or irreversible actions (delete, remove).

| Property | Value |
|---|---|
| Background | `--destructive` = #CA3F32 |
| Hover background | `--destructive-hover` = #AD3021 |
| Text | White |
| Border | None |

---

## Dimensions

| Property | Value |
|---|---|
| Height | `h-[32px]` |
| Horizontal padding | `px-2` = 8px |
| Icon gap | `gap-1` = 4px |
| Border radius | `rounded-[4px]` (`--radius-button`) |
| Font size | 14px (`text-base`) |
| Font weight | 600 (semibold) |

> There is only **one standard button height** (32px) in the Dremio design system. Both `size="default"` and `size="sm"` resolve to 32px.

---

## Disabled State

All variants: `opacity-50`, pointer-events disabled. Applied automatically by the Button component when `disabled` prop is set.

---

## Icon Buttons

When a button contains only an icon (no label), use `size="icon"` which sets equal width and height. Icon should be 16×16px inline with button text, 20×20px for standalone icon buttons.

---

## Usage Notes

```tsx
// Primary
<Button>Save as view</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// Ghost
<Button variant="ghost">
  <IconEdit size={16} />
  Edit
</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Disabled
<Button disabled>Processing…</Button>
```

---

## Critical Rules

- **Max 1 Primary button per view** — if multiple actions compete, the secondary one gets `variant="secondary"`
- **Ghost text is always `--accent`** — this is enforced in the CVA variant, do not override via `className`
- **cva hover colors cannot be overridden via `className`** — Tailwind resolves by stylesheet order, not DOM. Edit the variant in `button.tsx` directly if a hover change is needed

---

## Known Prototype Inconsistency

Some action buttons in the AI Agent prototype were built as ad-hoc `<button>` elements using `bg-accent` (#008489) as a background fill:
- "Execute" button in approval block
- "Run in SQL runner" button in workspace panel

**This is incorrect.** `--accent` (#008489) is a text/link color only — never a background fill. These buttons should be refactored to use `<Button variant="default">`, which renders with `--primary` (#43B8C9).

| Button | Current (wrong) | Correct |
|---|---|---|
| Execute | `bg-accent` #008489 | `<Button>` → `bg-primary` #43B8C9 |
| Run in SQL runner | `bg-accent` #008489 | `<Button>` → `bg-primary` #43B8C9 |
