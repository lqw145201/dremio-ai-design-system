# Dremio AI Agent – Design System Rules for Claude Code

## ⚠️ STOP — Read This Before Writing Any Code

This design system repo contains the **actual source code** for every component in the Dremio AI Agent prototype. Do not approximate. Do not rebuild. Copy the files.

**Full component catalog → [`COMPONENTS.md`](./COMPONENTS.md)**

### Component Discovery Workflow (required before every task)

1. **Open `COMPONENTS.md`** — find the component you need
2. **Copy the source file** from `components/` into your project
3. **Import using the barrel export:**
   ```tsx
   import { LeftNav, TopNav, ChatPanel } from './components';
   import { Button, Badge } from './components/ui';
   import { IconSearch, IconPlus } from './components/icons';
   ```
4. **Copy `styles/theme.css`** into your project's `src/styles/` and import it
5. **Copy the hooks** from `hooks/` — do not re-implement state management

### What already exists (copy, don't rebuild)

| Need | File to copy |
|---|---|
| Left sidebar | `components/LeftNav.tsx` |
| Top bar | `components/TopNav.tsx` |
| Chat thread | `components/ChatPanel.tsx` |
| Chat history list | `components/ChatListPanel.tsx` |
| Plan/Outputs/Context panel | `components/WorkspacePanel.tsx` |
| Data catalog tree | `components/CatalogPanel.tsx` |
| Collapsed panel strip | `components/CollapsedPanelStrip.tsx` |
| Tool calls block | `components/ToolCallsBlock.tsx` |
| Any icon | `components/icons/Icon*.tsx` (101 icons — see list in `COMPONENTS.md`) |
| Button, Badge, Tabs, Dialog… | `components/ui/*.tsx` (48 primitives) |
| CSS design tokens | `styles/theme.css` |
| Chat state | `hooks/useChat.ts` |
| Panel open/close state | `hooks/usePanelLayout.ts` |
| Workspace block state | `hooks/useWorkspace.ts` |

**If you write an inline `<svg>`, hand-build a `<button>`, or redefine a hook — you are doing it wrong. Check this table first.**

---

## Project Stack & Component Locations

- **Framework:** React + Vite + TypeScript + Tailwind CSS v4
- **Theme file:** `src/styles/theme.css` — copy from `styles/theme.css` in this repo
- **Icons (101 Dremio icons):** `components/icons/` — check here first, never hand-draw SVGs
- **UI primitives:** `components/ui/` (Button, Tabs, Badge, Dialog, Table, etc.)
- **Layout components:** `components/` (LeftNav, TopNav, ChatPanel, etc.)
- **Hooks:** `hooks/` (useChat, usePanelLayout, useWorkspace)

**Never hardcode hex values.** All colors must reference CSS tokens.

---

## Figma MCP Workflow (Required for Every Component)

### Step 1 — Map the full page hierarchy BEFORE writing any code

Call `get_figma_data` (or `get_design_context`) on the **page-level node** first. Read every named child component. Build a complete mental map of:
- Which components exist and where they sit in the layout
- What each component's **name** tells you about its responsibility
- Which children belong to which parent

Do not write a single line of implementation until this map is complete.

### Step 2 — Read each named component individually

For every component identified in Step 1, call `get_design_context` on it directly. Confirm:
- Exact dimensions (`width`, `height`, `padding`, `gap`)
- What children it contains (icons, buttons, inputs, labels)
- Background, border, and color fills — map back to CSS tokens

### Step 3 — Implement using project tokens, not Figma raw values

Map Figma fill/stroke values back to `src/styles/theme.css` tokens. Never hardcode hex.

### Step 4 — Validate against screenshot

Call `get_screenshot` on the Figma node and compare the rendered result before marking complete.

**Figma file:** `https://www.figma.com/design/P2EhSAF4LQfhYQEIiyltan/`

| Reference | Node ID |
|---|---|
| AI Agent page | `12400:79817` |
| Nav / Top Nav | `12337:132404` |
| Secondary nav module | `35:1429` |
| Secondary nav full | `36:2383` |
| Settings sample page | `12400:83714` |
| SQL Runner sample page | `7978:139494` |

⚠️ **Never hand-build a component that exists in the Figma design system.** Approximations produce wrong dimensions, spacing, and interaction states. Always `get_design_context` first.

### Component name = content contract

A component's Figma name defines exactly what belongs inside it:
- `Nav/Top Nav` → project context dropdown + search bar + AI Agent button. Nothing else.
- `AIAgent/ChatListPanel` → chat list header (New chat, Search), recent chats list. No workspace controls.
- `AIAgent/ChatPanel` → message thread, tool call blocks, output blocks, approval blocks.

If you think an element "belongs" somewhere but haven't verified it in Figma — you're guessing. Stop and read Figma first.

---

## Design Tokens

### Colors

| Token | Hex | Semantic Use |
|---|---|---|
| `--foreground` | `#202124` | Primary text, page titles |
| `--secondary-foreground` | `#505862` | Secondary text, table headers, labels, badge text |
| `--muted-foreground` | `#B0B7BF` | **ONLY:** placeholders, disabled text, empty states |
| `--muted` | `#EEEFF1` | Dividers, muted backgrounds, selected chat row bg |
| `--background` | `#F6F7F8` | Page body, tool call block bg |
| `--card` | `#FFFFFF` | Panels, cards, badge bg |
| `--border` | `#D2D6DA` | Input/card borders, badge borders |
| `--primary` | `#43B8C9` | Primary buttons, active states, running spinner |
| `--sidebar-primary` | `#2E92A1` | Primary button hover, selected nav item bg |
| `--accent` | `#008489` | Ghost button text, links — NOT button backgrounds |
| `--destructive` | `#CA3F32` | Delete actions, error, ApprovalBadge text |
| `--destructive-hover` | `#AD3021` | Destructive button hover |
| `--background-hover` | `#F1FAFB` | Ghost button hover bg, nav item hover |
| `--sidebar` | `#2A394A` | Left nav background |
| `--chart-5` | `#5ABD4A` | TimeBadge text + background tint (green) |

**CRITICAL:** `--muted-foreground` is for placeholders/disabled ONLY. Table headers, stat labels, badge text → `--secondary-foreground`.

**CRITICAL:** `--accent` is for ghost button text and links only — never use `bg-accent` as a button background fill.

### Typography

| Tailwind Class | px | Use |
|---|---|---|
| `text-2xl` | 24px | Page titles |
| `text-xl` | 18px | Section titles, panel headers |
| `text-lg` | 16px | Card/nav headers |
| `text-base` | 14px | Body text, table cells, chat messages |
| `text-sm` | 12px | Metadata, timestamps, badge text (some 9px inline) |

Font family: **Inter** (sans). Monospace: **Fira Code / JetBrains Mono**.
Weights: 600 semibold (headings, active items), 400 regular (body).

### Shadows

```css
--shadow-sm:       0px 2px 4px rgba(16,18,20,0.10)   /* cards, dropdowns */
--shadow-dropdown: 4px 4px 16px 0px rgba(16,18,20,0.10) /* portal dropdowns */
```

---

## Page Layout — AI Agent

```
h-screen w-screen flex
  └─ LeftNav                    (64px wide, fixed, bg --sidebar)
  └─ flex-1 flex h-full
       └─ TopNav                (64px tall, position: absolute/sticky, white bg)
       └─ Panel area (below TopNav)
            ├─ ChatListPanel    (240px default, resizable)
            ├─ ChatPanel        (flex-1, resizable)
            └─ WorkspacePanel / CatalogPanel  (resizable, can be collapsed)
```

- Uses `react-resizable-panels` for the horizontal panel layout
- **Never wrap panels in card/border/shadow/margin** — panels are full-height flush regions
- Collapsed panels render as a `CollapsedPanelStrip` on the right edge
- Max 1 Primary button per view

---

## Buttons

Use `<Button>` from `src/app/components/ui/button.tsx` — never hand-build `<button>` for primary/secondary actions.

| Variant | cva key | Default bg | Hover bg | Text |
|---|---|---|---|---|
| Primary | `default` | `--primary` (#43B8C9) | `--sidebar-primary` (#2E92A1) | white |
| Secondary | `secondary` | `--card` (#FFFFFF) | `--background` (#F6F7F8) | `--secondary-foreground` |
| Ghost | `ghost` | transparent | `--background-hover` (#F1FAFB) | `--accent` (#008489) |
| Destructive | `destructive` | `--destructive` (#CA3F32) | `--destructive-hover` (#AD3021) | white |

**Dimensions:** `h-[32px]` · `px-2` (8px) · `gap-1` (4px icon gap) · `rounded-[4px]`
**Disabled:** `opacity-50`, pointer-events none — all variants.
**Secondary** has `border border-border`. Ghost has no border.

⚠️ cva hover colors **cannot be overridden via `className`** — Tailwind resolves by stylesheet order. Edit the variant in `button.tsx` directly.

⚠️ **Known prototype inconsistency:** Some ad-hoc buttons (Execute, Run in SQL runner) use `bg-accent` (#008489) directly instead of `<Button variant="default">`. This is incorrect — refactor to use the Button component.

---

## Icons

| Context | Size |
|---|---|
| Page header, secondary nav items | **24×24px** |
| Table row actions | **20×20px** |
| Inline with button text | **16×16px** |
| Badge icons (ApprovalBadge warning) | **12×12px** |

### Icon Priority Rule (MANDATORY)

Always resolve icons in this order — stop at the first match:

1. **`src/app/components/icons/`** — 101 Dremio icons as React `.tsx` components. Check here first, always.
2. **`public/icons/`** — 113 standalone SVG assets (all icons combined in a single folder). Use as `<img src>` or in design tools when a React component is not needed.
3. **`@fluentui/react-icons` Regular weight** — fallback only when no match exists in steps 1 or 2.

**Never install a new icon package.** If a Fluent icon is used, import only the specific named export — do not add icon libraries.

### Other Icon Rules

- Icon name comes from Figma's `data-name` attribute in `get_design_context` output
- Color via Tailwind `text-*` classes — icons use `fill="currentColor"`
- Never use `preserveAspectRatio="none"` — causes distortion
- `<img>` icons: always `objectFit: "contain"`
- Never hand-draw SVG paths from scratch

---

## Badges

### BlockTypeBadge — all types share identical styling

| Property | Value |
|---|---|
| Height | `h-[20px]` |
| Padding | `px-[6px] py-px` |
| Background | `bg-card` (white) |
| Border | absolute overlay div: `border border-border` |
| Radius | `rounded-[var(--radius-button)]` = 4px |
| Text | 9px · semibold · uppercase · `text-secondary-foreground` |

Type → label mapping:

| Type key | Displayed label |
|---|---|
| `sql` | SQL |
| `table` | TABLE |
| `chart` | CHART |
| `explanation` | TEXT |
| `dataset` | TABLE |
| `view` | VIEW |

No accent-colored variant. All types use `--secondary-foreground` text and `--border` border.

### TimeBadge

| Property | Value |
|---|---|
| Background | `bg-chart-5/10` — rgba(90,189,74,0.10), green tint |
| Text color | `text-chart-5` — `--chart-5` = #5ABD4A (green) |
| Text size | 9px semibold |
| No border | Unlike BlockTypeBadge |

### ApprovalBadge

| Property | Value |
|---|---|
| Background | `bg-destructive/10` |
| Text color | `text-destructive` (#CA3F32) |
| Height | `h-[20px]` |
| Padding | `px-[6px] gap-[4px]` |
| Icon | 12×12px warning SVG, `stroke: var(--destructive)` |
| Label | "ACTION REQUIRED" — 9px semibold uppercase |

---

## Chat List Panel

| Property | Value |
|---|---|
| Width | 240px (default, resizable) |
| Background | `--card` |
| Right border | `1px solid var(--muted)` |

**ChatItemRow:**

| State | Style |
|---|---|
| Default | transparent bg, `rounded-[4px]` |
| Selected | `bg-muted` (#EEEFF1) |
| Hover | `bg-muted/50` |
| Height | 40px |

**More button (3-dot menu):** `size-[24px]`, `opacity-0 group-hover:opacity-100` — never unconditionally visible.

---

## Chat Panel

Message bubbles:
- **User message:** `bg-muted` rounded card
- **AI message:** no background, plain text

**ToolCallsBlock:**
- Container: `bg-background` + `border border-muted` + `rounded`
- Summary row: "Used N tools" trigger
- Expanded: list of individual tool calls with name + status

**Output block header pattern:**
```
[BlockTypeBadge] [Title text]        [TimeBadge]
```

**Output block — executed state:**
- Green checkmark icon (12×12, stroke `--chart-5`)
- "EXECUTED" label: 9px semibold, `text-chart-5`, `bg-chart-5/10`
- Card border: `border-chart-5/30`

**Approval block:**
- `ApprovalBadge` + title
- Action buttons: "Always allow", "Allow once", "Execute", "Request changes"
- Background: white card, border `--border`

---

## Chat Input

| Property | Value |
|---|---|
| Background | `bg-card` |
| Border | `border border-border` |
| Placeholder text | `text-muted-foreground` (the correct use for this token) |
| Radius | `rounded-[var(--radius-card)]` = 8px |

---

## Workspace Panel

**Plan steps:**

| State | Visual |
|---|---|
| Done | Filled circle (`bg-chart-5/10`) + green checkmark (stroke `--chart-5`) |
| Running | Animated spinner: `--primary` stroke, dasharray animation |
| Pending | Empty circle, `border border-border` only |

**Output tabs:** `px-[12px] py-[6px]`
- Active: `bg-primary/10`
- Hover: `bg-background-hover`

**Context items:** list of data sources with row counts.

---

## Catalog Panel

**TreeItem (browse mode):**

| State | Style |
|---|---|
| Default | `h-[32px]`, transparent |
| Active | `bg-[#e9f5f9]` |
| Hover | `bg-muted/50` |

**PickableTreeItem (save / pick mode):**

| State | Style |
|---|---|
| Default | `h-[32px]`, transparent |
| Selected | `bg-primary/10` |
| Hover | `bg-muted/50` |

---

## Collapsed Panel Strip

Renders when WorkspacePanel or CatalogPanel is collapsed. Provides vertical icon buttons to re-expand each panel. Uses `bg-card`, `border-l border-muted`.

---

## Critical Rules

1. `--muted-foreground` for placeholders/disabled ONLY — labels, headers → `--secondary-foreground`
2. `--accent` for ghost button text and links ONLY — never as a `bg-*` fill
3. No card chrome (border/radius/shadow/margin) on full-page panel layouts
4. Max 1 Primary button per view
5. Row/list actions: `opacity-0 group-hover:opacity-100` — never unconditionally visible
6. Delete icons: `text-secondary-foreground` by default, `text-destructive` on hover only
7. Icon sizes: 24px (nav/header), 20px (table rows), 16px (button inline), 12px (badge icons)
8. cva hover colors: edit `button.tsx` directly — never override via `className`
9. Always `get_design_context` before building any component — never approximate from memory
10. All icons in `src/app/components/icons/` — check before anything else
11. Read the full page node first, then each child component. Never code until hierarchy is mapped.
12. Never place UI elements by intuition — verify every element's parent component in Figma
13. Never use UI design tokens for code syntax colors. Use code-editor palette: keywords `#0033B3`, strings `#067D17`, functions `#7A3E9D`
14. BlockTypeBadge border is an `absolute inset-0` overlay div — not a CSS `border` property on the container
15. TimeBadge uses `--chart-5` = green (#5ABD4A), not blue

---

## Changelog Rule

Every significant change must be recorded in `CHANGELOG.md` (newest entry at the top).

Each entry must include: **date · author · what changed · why**.

Applies to: new components, design token changes, spec corrections, bug fixes, structural refactors.
