# 02 — Design Tokens

All tokens are defined in `src/styles/theme.css` as CSS custom properties and mapped to Tailwind via `@theme inline`. **Never hardcode hex values** — always reference the token.

---

## Color Tokens

### Foreground / Text

| Token | Hex | When to use |
|---|---|---|
| `--foreground` | `#202124` | Primary text — page titles, body copy, chat messages |
| `--secondary-foreground` | `#505862` | Secondary text — labels, badge text, table headers, panel section titles |
| `--muted-foreground` | `#B0B7BF` | **Placeholders and disabled states ONLY** — never for active labels |

> ⚠️ **Common mistake:** Using `--muted-foreground` for labels or headers. That token is for empty/disabled states only. Anything that communicates active information uses `--secondary-foreground`.

### Background / Surface

| Token | Hex | When to use |
|---|---|---|
| `--background` | `#F6F7F8` | Page body, tool call block backgrounds |
| `--card` | `#FFFFFF` | Panels, cards, badge backgrounds, output blocks |
| `--muted` | `#EEEFF1` | Dividers, muted backgrounds, selected chat row, row dividers |
| `--background-hover` | `#F1FAFB` | Ghost button hover, nav item hover |

### Interactive

| Token | Hex | When to use |
|---|---|---|
| `--primary` | `#43B8C9` | Primary buttons, active LeftNav icon, running plan spinner stroke |
| `--sidebar-primary` | `#2E92A1` | Primary button hover bg, selected secondary nav item bg |
| `--accent` | `#008489` | Ghost button text, links — **never as a button background fill** |

> ⚠️ `--accent` is for text/icon color in ghost contexts only. Some prototype buttons incorrectly use `bg-accent` — this is a known inconsistency to be fixed.

### Semantic

| Token | Hex | When to use |
|---|---|---|
| `--destructive` | `#CA3F32` | Delete actions, error states, ApprovalBadge text/icon |
| `--destructive-hover` | `#AD3021` | Destructive button hover state |
| `--border` | `#D2D6DA` | Input borders, card borders, badge border overlay |

### Navigation

| Token | Hex | When to use |
|---|---|---|
| `--sidebar` | `#2A394A` | LeftNav background |

### Chart / Data Viz

| Token | Hex | When to use |
|---|---|---|
| `--chart-5` | `#5ABD4A` | TimeBadge text + background tint (green) |

---

## Opacity Variants

Tailwind's `/opacity` syntax is used throughout:

| Usage | Class | Resolves to |
|---|---|---|
| TimeBadge background | `bg-chart-5/10` | rgba(90,189,74, 0.10) |
| Approval block background | `bg-destructive/10` | rgba(202,63,50, 0.10) |
| Output tab active | `bg-primary/10` | rgba(67,184,201, 0.10) |
| Catalog active item | `bg-primary/10` | rgba(67,184,201, 0.10) |
| Plan step done bg | `bg-chart-5/10` | rgba(90,189,74, 0.10) |
| ToolCall block border | `border-muted` | #EEEFF1 border |

---

## Typography Tokens

### Font Sizes

| Tailwind class | px | Use |
|---|---|---|
| `text-2xl` | 24px | Page titles |
| `text-xl` | 18px | Panel section headers |
| `text-lg` | 16px | Card headers, nav group headers |
| `text-base` | 14px | Body, chat messages, table cells, labels |
| `text-sm` | 12px | Metadata, timestamps, workspace item labels |
| Inline `9px` | 9px | Badge labels (set via inline style) |

### Font Families

| Variable | Value | Use |
|---|---|---|
| `--font-sans` | `Inter, sans-serif` | All UI text |
| `--font-mono` | `Fira Code, JetBrains Mono, monospace` | SQL editors, code output blocks |

### Font Weights

| Variable | Value | Use |
|---|---|---|
| `--font-weight-semibold` | `600` | Headings, active nav items, badge labels |
| `--font-weight-normal` | `400` | Body text, secondary labels |

---

## Spacing & Sizing

These are the most common spacing values found across components (not a full design token — just the observed set):

| Value | Usage |
|---|---|
| `4px` | Gap between icon and label in badges; button icon gap |
| `6px` | Badge horizontal padding (`px-[6px]`) |
| `8px` | Button padding (`px-2`), nav item gap |
| `12px` | Output tab padding (`px-[12px]`) |
| `16px` | Nav list horizontal padding |
| `20px` | Table cell padding (`px-[20px]`) |
| `24px` | Page section padding |

---

## Border Radius Tokens

| Variable | Value | Use |
|---|---|---|
| `--radius-button` | `4px` | Buttons, badges, chat item rows |
| `--radius-card` | `8px` | Cards, panels, output blocks, chat input |

---

## Shadow Tokens

| Variable | Value | Use |
|---|---|---|
| `--shadow-sm` | `0px 2px 4px rgba(16,18,20,0.10)` | Card elevation, dropdown menus |
| `--shadow-dropdown` | `4px 4px 16px 0px rgba(16,18,20,0.10)` | Portal-rendered dropdowns |

---

## Code Syntax Colors (NOT design tokens)

SQL/code editors must use a standard code-editor palette. Do **not** use UI design tokens (`--primary`, `--accent`, etc.) for syntax highlighting — they clash with the Dremio brand.

| Element | Color |
|---|---|
| Keywords (`SELECT`, `FROM`, `CREATE`) | `#0033B3` |
| Strings | `#067D17` |
| Functions | `#7A3E9D` |
| Comments | `#8C8C8C` |
| Numbers | `#1750EB` |
| Default text | `--foreground` (#202124) |
