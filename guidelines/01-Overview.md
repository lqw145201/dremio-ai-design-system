# 01 — Overview

## What is the AI Agent interface?

The Dremio AI Agent is a conversational data assistant embedded in the Dremio product. Users describe what they want in natural language — "Build a Bronze-Silver-Gold medallion architecture for our CRM data" — and the agent plans, executes, and delivers results with full transparency.

The interface is designed around four key principles:
1. **Transparency** — every agent action is visible (tool calls, plan steps, approvals)
2. **Control** — users approve destructive operations before they run
3. **Context** — the Workspace and Catalog panels keep data context always in view
4. **Continuity** — recent chats are browsable, resumable, and searchable

---

## Page Layout

The AI Agent occupies a full-screen, borderless canvas split into horizontal panels.

```
┌──────┬──────────────────────────────────────────────────────────────────┐
│      │  TopNav (64px)                                                   │
│      ├──────────────────┬──────────────────────┬────────────────────────┤
│ Left │                  │                      │                        │
│ Nav  │  ChatListPanel   │    ChatPanel         │  WorkspacePanel        │
│      │  (240px default) │    (flex-1)          │  or CatalogPanel       │
│ 64px │                  │                      │  (resizable)           │
│      │                  │                      │                        │
└──────┴──────────────────┴──────────────────────┴────────────────────────┘
```

| Panel | Width | Notes |
|---|---|---|
| LeftNav | 64px fixed | Always visible; bg `--sidebar` |
| TopNav | full width, 64px tall | Sits above the panel area |
| ChatListPanel | 240px default | Resizable; can be collapsed |
| ChatPanel | flex-1 | Always visible |
| WorkspacePanel | ~360px default | Resizable; collapses to strip |
| CatalogPanel | ~360px default | Replaces WorkspacePanel when active |
| CollapsedPanelStrip | 40px | Shown when WorkspacePanel/CatalogPanel collapsed |

---

## Panel System

Panels are managed by `react-resizable-panels`. Each panel:
- Has no outer card chrome (no border, shadow, or margin)
- Is flush to its neighbours
- Can be resized by dragging the divider handle
- Can be collapsed (except ChatPanel)

When a side panel collapses, `CollapsedPanelStrip` appears on the right edge with vertical buttons to re-expand.

---

## Figma References

| Screen / Component | Node ID |
|---|---|
| AI Agent page (full) | `12400:79817` |
| Nav / Top Nav | `12337:132404` |
| Left Nav | `35:1429` (secondary nav module) |

Full Figma file: `https://www.figma.com/design/P2EhSAF4LQfhYQEIiyltan/`

---

## Navigation Model

The AI Agent is one section in the broader Dremio product. The **LeftNav** provides product-level navigation (Home, AI Agent, Catalog, SQL, Semantic Layer, Admin). **TopNav** is scoped to the current project context (project dropdown + search + AI Agent button).

Routing:
- `/` → Home page
- `/ai-agent` → AI Agent page (this design system)
- `/sql` → SQL Runner
- `/settings/*` → Settings pages
