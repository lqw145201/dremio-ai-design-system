# 06 — Top Nav

The TopNav sits at the top of the content area (right of LeftNav). It is scoped to the current project context.

---

## Spec

| Property | Value |
|---|---|
| Height | 64px |
| Background | `--card` = #FFFFFF |
| Border bottom | `1px solid var(--muted)` (#EEEFF1) |
| Width | Full width of content area |

---

## Contents

The TopNav contains exactly three elements — no more:

| Element | Description |
|---|---|
| **Project context dropdown** | Displays current project name (e.g. "First Lakehouse") with a chevron to switch projects |
| **Search bar** | Full-width flex-1 input: "Search data, scripts, recent jobs and more..." |
| **AI Agent button** | Primary button — opens/activates the AI Agent |

> ⚠️ **The TopNav does not contain:** Run, Preview, Engine selector, or any SQL Runner controls. Those belong in the SQL Runner Action Header. Verify component contents in Figma before placing any element.

---

## Figma Reference

| Component | Node ID |
|---|---|
| Nav / Top Nav | `12337:132404` |

---

## Search Bar

| Property | Value |
|---|---|
| Placeholder | "Search data, scripts, recent jobs and more..." |
| Placeholder color | `--muted-foreground` (#B0B7BF) — correct use of this token |
| Background | `--background` = #F6F7F8 |
| Border | `1px solid var(--border)` |
| Radius | `rounded-[var(--radius-button)]` = 4px |
| Leading icon | Search/magnifier icon, 16×16px, `text-muted-foreground` |
| Height | 36px |

---

## Project Context Dropdown

- Displays project name in `text-base` semibold
- Chevron icon: 16×16px, `text-secondary-foreground`
- On click: shows project switcher dropdown (portal-rendered, `--shadow-dropdown`)
