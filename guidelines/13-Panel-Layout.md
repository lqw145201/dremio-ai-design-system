# 13 — Panel Layout & Interactions

The AI Agent page uses a horizontal resizable panel system. This document covers layout rules, resize behaviour, and panel interactions.

---

## Layout Structure

```
h-screen w-screen flex flex-row
│
├─ LeftNav (64px, fixed width, never resizable)
│
└─ flex-1 flex flex-col
     │
     ├─ TopNav (64px, full width, fixed height)
     │
     └─ flex-1 flex flex-row (panel area)
          │
          ├─ ChatListPanel    (default 240px, resizable, min ~160px)
          ├─ [resize handle]
          ├─ ChatPanel        (flex-1, always visible, min ~320px)
          ├─ [resize handle]
          └─ WorkspacePanel / CatalogPanel  (default ~360px, resizable, collapsible)
               └─ OR: CollapsedPanelStrip  (~40px, when collapsed)
```

---

## Resizable Panels

The panel area uses [`react-resizable-panels`](https://github.com/bvaughn/react-resizable-panels).

| Panel | Resizable | Collapsible | Min width |
|---|---|---|---|
| ChatListPanel | Yes | Yes (future) | ~160px |
| ChatPanel | Yes | No | ~320px |
| WorkspacePanel | Yes | Yes | Collapses to strip |
| CatalogPanel | Yes | Yes | Collapses to strip |

### Resize Handle

| Property | Value |
|---|---|
| Width | 4px |
| Background default | Transparent |
| Background hover/drag | `--primary` (#43B8C9) tinted |
| Cursor | `col-resize` |

---

## Panel Dividers

Between panels: `1px solid var(--muted)` — implemented as right/left border on each panel, not as a standalone divider element.

> ⚠️ Use `var(--muted)` (#EEEFF1) for panel dividers — NOT `var(--border)` (#D2D6DA). This is a common mistake.

---

## Full-Screen Rule

All panels are rendered as full-height flush regions:
- No outer `card` wrapper with border/shadow/radius
- No margin between panels
- Panels extend from TopNav bottom edge to screen bottom edge

---

## Collapse Behaviour

When WorkspacePanel or CatalogPanel is collapsed:
1. Panel width animates to 0 (`transition-[width] duration-200`)
2. CollapsedPanelStrip appears at right edge (40px wide)
3. Strip shows one icon button per collapsed panel
4. Clicking the button re-expands the panel to its last width

---

## Panel Switching: Workspace ↔ Catalog

The right-side slot shows either WorkspacePanel or CatalogPanel depending on agent state:
- **Default / working:** WorkspacePanel
- **Save/pick mode:** CatalogPanel (agent prompts user to pick a save location)
- **Explicit navigation:** User can toggle via tab/button

Both panels share the same slot, width, and border spec.

---

## Scroll Behaviour

| Panel | Scroll |
|---|---|
| ChatListPanel | Vertical scroll on chat list |
| ChatPanel | Vertical scroll on message thread; input is sticky bottom |
| WorkspacePanel | Vertical scroll within each tab's content area |
| CatalogPanel | Vertical scroll on tree |

Scrollbars: styled with thin `--muted` track, `--border` thumb. Hidden when not hovering.

---

## Portal Dropdowns

Context menus and dropdowns that overflow panel boundaries are rendered as portals:
- Position calculated with `getBoundingClientRect()` relative to trigger
- Shadow: `--shadow-dropdown` = `4px 4px 16px 0px rgba(16,18,20,0.10)`
- Z-index: above all panels
- Dismissed on outside click or Escape

---

## Keyboard Interactions

| Key | Action |
|---|---|
| `Enter` | Submit chat message (when input focused) |
| `Shift+Enter` | New line in chat input |
| `Escape` | Close any open dropdown/context menu |
| `Tab` | Navigate focusable elements within a panel |
