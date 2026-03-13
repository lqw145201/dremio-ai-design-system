# 05 — Left Nav

The LeftNav is the product-level navigation bar. It is always visible and provides access to all major Dremio sections.

---

## Spec

| Property | Value |
|---|---|
| Width | 64px (fixed) |
| Height | Full screen (`h-screen`) |
| Background | `--sidebar` = #2A394A |
| Position | Fixed left edge |

---

## Layout

```
LeftNav (64px wide, h-screen)
  ├─ Logo / brand icon (top)
  ├─ Nav items (scrollable middle)
  │    ├─ Home
  │    ├─ AI Agent  ← active example
  │    ├─ Catalog
  │    ├─ SQL
  │    ├─ Semantic Layer
  │    └─ Admin
  └─ User avatar / profile (bottom)
```

---

## Nav Item States

| State | Icon color | Background |
|---|---|---|
| Default | `rgba(255,255,255,0.5)` — 50% white | Transparent |
| Hover | White (`#FFFFFF`) | `--background-hover` at low opacity |
| Active (current page) | `--primary` = #43B8C9 | Subtle tint or none |

- Nav items have no label text visible — icon only, with tooltip on hover
- Icon size: **24×24px**
- Item height: 40px, centered icon
- Radius: `rounded-[4px]`

---

## Figma Reference

| Component | Node ID |
|---|---|
| Secondary nav module | `35:1429` |
| Secondary nav full | `36:2383` |

Always read the Figma node before implementing — never approximate icon placement or sizing.
