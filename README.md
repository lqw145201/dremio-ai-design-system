# Dremio AI Agent – Design System

> The single source of truth for every component, token, and interaction pattern in the Dremio AI Agent interface.

---

## Step 1 — Open the Visual Reference First

Before reading anything else, open `design-system.html`. It shows every component visually — color swatches, button states, nav variants, badges, chat blocks, panel layouts — with the exact spec values alongside each one.

**No install needed — open directly in your browser:**

👉 **[Click to open design-system.html](https://htmlpreview.github.io/?https://raw.githubusercontent.com/lqw145201/dremio-ai-design-system/main/design-system.html)**

Or if you have the repo cloned locally:

```bash
open design-system.html   # macOS
# or double-click the file in Finder / Explorer
```

Once you have a visual picture of the system, continue with the guide for your role below.

---

## For PMs

Use this repo to look up exact specs when writing tickets or reviewing designs — no need to guess at dimensions, colors, or states.

### Step-by-step

1. **Open `design-system.html`** — find the component you're writing about. Every component has its dimensions, padding, color tokens, and interaction states documented visually.

2. **Browse `guidelines/`** — each file covers a specific UI area in detail:

   | File | Covers |
   |---|---|
   | `01-Overview.md` | Page structure, panel layout, Figma references |
   | `02-Design-Tokens.md` | All color tokens, typography scale, spacing, shadows |
   | `03-Badges-and-Tags.md` | BlockTypeBadge, TimeBadge, ApprovalBadge |
   | `04-Buttons.md` | All button variants, sizes, states |
   | `05-Left-Nav.md` | Left navigation bar — items, active state, avatar |
   | `06-Top-Nav.md` | Top navigation bar — search, context switcher |
   | `07-Chat-List-Panel.md` | Chat history list, row states, hover actions |
   | `08-Chat-Panel.md` | Message thread, tool call blocks, output blocks |
   | `09-Chat-Input.md` | Input bar, attach button, submit |
   | `10-Workspace-Panel.md` | Plan steps, output tabs, context items |
   | `11-Catalog-Panel.md` | Data catalog tree, browse vs. pick mode |
   | `12-Collapsed-Panel-Strip.md` | Minimised panel strip |
   | `13-Panel-Layout.md` | Resizable layout, panel open/close behavior |

3. **Reference token names in tickets** — instead of writing "the teal button", write `<Button variant="default">` or reference the `--primary` token (`#43B8C9`). This removes ambiguity for engineers.

4. **Check the Figma file** for any component not covered here:
   `https://www.figma.com/design/P2EhSAF4LQfhYQEIiyltan/`

---

## For Engineers

All components are ready to copy into your project. Do not rewrite them — the source files are the reference implementation.

### Step-by-step

**1. Clone this repo**

```bash
git clone https://github.com/lqw145201/dremio-ai-design-system.git
```

**2. Open `design-system.html`** in your browser to identify which components you need visually before touching any code.

**3. Copy the theme file into your project**

```bash
cp styles/theme.css your-project/src/styles/theme.css
```

Import it at the very top of your app entry point (e.g. `main.tsx`):

```tsx
import './styles/theme.css';
```

> ⚠️ If you skip this step, all CSS variables resolve to nothing — backgrounds go transparent, text disappears, and the LeftNav will look completely broken.

**4. Copy the components you need**

```bash
# Copy layout components
cp components/LeftNav.tsx        your-project/src/app/components/
cp components/TopNav.tsx         your-project/src/app/components/
cp components/ChatPanel.tsx      your-project/src/app/components/
cp components/ChatListPanel.tsx  your-project/src/app/components/
cp components/WorkspacePanel.tsx your-project/src/app/components/

# Copy the entire icons directory (required — do not substitute other icon libraries)
cp -r components/icons/          your-project/src/app/components/icons/

# Copy UI primitives
cp -r components/ui/             your-project/src/app/components/ui/
```

**5. Copy the hooks**

```bash
cp hooks/useChat.ts          your-project/src/app/hooks/
cp hooks/usePanelLayout.ts   your-project/src/app/hooks/
cp hooks/useWorkspace.ts     your-project/src/app/hooks/
```

**6. Import and use**

```tsx
import { LeftNav, TopNav, ChatPanel, ChatListPanel } from './components';
import { Button, Badge } from './components/ui';
import { IconSearch, IconPlus } from './components/icons';

// LeftNav — control active item and user avatar via props
<LeftNav
  activeItem="ai-agent"           // "home" | "ai-agent" | "catalog" | "sql" | "semantic-layer" | "admin"
  userInitials="JD"               // shown in the avatar circle at the bottom
  onNavigate={(item) => { ... }}  // called when the user clicks a nav item
/>
```

**7. Check `COMPONENTS.md`** for a full inventory of every component, icon, and UI primitive available — use it as a lookup table before building anything new.

### Critical rules for engineers

- **Never hardcode hex values** — always use CSS tokens (e.g. `var(--primary)` not `#43B8C9`)
- **Never substitute icon libraries** — `LeftNav` and other components require icons from `components/icons/` specifically; Fluent UI, Heroicons, or any other library will produce the wrong output
- **Never rebuild components from scratch** — if it's in this repo, copy it
- **`--muted-foreground` is for placeholders and disabled states only** — for labels, headers, and secondary text use `--secondary-foreground`

---

## For Claude Code (AI-assisted development)

Open your project in Claude Code. This repo's `CLAUDE.md` is read automatically and gives Claude all the rules, token names, component locations, and the Figma workflow.

### Step-by-step

**1. Make sure this design system repo is accessible**

Either clone it alongside your project, or point Claude to it explicitly at the start of your session:

> *"The design system is at `../dremio-ai-design-system/`. Use components and tokens from there."*

**2. Open `design-system.html` and describe what you want**

Give Claude the visual context:

> *"I want to add a new panel that looks like the WorkspacePanel in the design system. It should have a tab bar at the top and a scrollable body."*

**3. Let Claude read Figma before writing any code**

Claude will call `get_design_context` on the relevant Figma node before writing a single line. If it skips this step, prompt it:

> *"Read the Figma node for this component before implementing it."*

**4. Reference components by their exact names**

> *"Add a `BlockTypeBadge` with type `sql` to the output block header."*
> *"Use `<Button variant="ghost">` for this action."*
> *"The active nav item should use `activeItem="catalog"`."*

**5. Verify the output**

Ask Claude to take a screenshot of the Figma node and compare it against what was built before marking a task complete.

---

## Repository Structure

```
dremio-ai-design-system/
├── design-system.html           ← 👈 Open this first — visual reference for all components
├── CLAUDE.md                    ← Rules Claude Code reads automatically
├── CHANGELOG.md                 ← All changes, newest first
├── COMPONENTS.md                ← Full inventory of every component, icon, and primitive
├── README.md                    ← This file
├── ATTRIBUTIONS.md              ← Third-party credits
├── components/
│   ├── LeftNav.tsx              ← Left navigation bar (64px, icon + label nav)
│   ├── TopNav.tsx               ← Top navigation bar (search, context switcher)
│   ├── ChatPanel.tsx            ← Main chat thread (messages, tool calls, outputs)
│   ├── ChatListPanel.tsx        ← Chat history list (240px, resizable)
│   ├── WorkspacePanel.tsx       ← Plan / Outputs / Context panel
│   ├── CatalogPanel.tsx         ← Data catalog tree
│   ├── CollapsedPanelStrip.tsx  ← Collapsed panel icon strip (right edge)
│   ├── ToolCallsBlock.tsx       ← Expandable tool call log inside chat
│   ├── icons/                   ← 101 Dremio icon components (Icon*.tsx)
│   └── ui/                      ← 48 UI primitives (Button, Badge, Tabs, Dialog…)
├── hooks/
│   ├── useChat.ts               ← Chat thread state
│   ├── usePanelLayout.ts        ← Panel open/close/resize state
│   └── useWorkspace.ts          ← Workspace block and tab state
├── styles/
│   └── theme.css                ← All CSS tokens — copy this into every project
└── guidelines/
    ├── 01-Overview.md
    ├── 02-Design-Tokens.md
    ├── 03-Badges-and-Tags.md
    ├── 04-Buttons.md
    ├── 05-Left-Nav.md
    ├── 06-Top-Nav.md
    ├── 07-Chat-List-Panel.md
    ├── 08-Chat-Panel.md
    ├── 09-Chat-Input.md
    ├── 10-Workspace-Panel.md
    ├── 11-Catalog-Panel.md
    ├── 12-Collapsed-Panel-Strip.md
    └── 13-Panel-Layout.md
```

---

## Design Token Quick Reference

| Token | Hex | Use |
|---|---|---|
| `--primary` | `#43B8C9` | Primary buttons, active states, running spinner |
| `--accent` | `#008489` | Ghost button text, links only — never as a background fill |
| `--foreground` | `#202124` | Primary text, page titles |
| `--secondary-foreground` | `#505862` | Labels, table headers, secondary text, badge text |
| `--muted-foreground` | `#B0B7BF` | Placeholders and disabled states only |
| `--muted` | `#EEEFF1` | Dividers, muted backgrounds |
| `--background` | `#F6F7F8` | Page body, LeftNav background |
| `--card` | `#FFFFFF` | Panels, cards |
| `--border` | `#D2D6DA` | Input and card borders |
| `--destructive` | `#CA3F32` | Delete actions, errors |

Full token reference → [`guidelines/02-Design-Tokens.md`](guidelines/02-Design-Tokens.md)

---

## Figma File

All components are spec'd against this file:

`https://www.figma.com/design/P2EhSAF4LQfhYQEIiyltan/`

| Reference | Figma Node |
|---|---|
| AI Agent page | `12400:79817` |
| Nav / Top Nav | `12337:132404` |
| Secondary nav module | `35:1429` |
| Secondary nav full | `36:2383` |
| Settings sample page | `12400:83714` |
| SQL Runner sample page | `7978:139494` |

---

## Contributing

1. **Always add a `CHANGELOG.md` entry** for any meaningful change (newest at top)
2. Each entry must include: date · author · what changed · why
3. PR title format: `[Component] Brief description` — e.g. `[LeftNav] Fix icon color on active state`
4. Design changes must reference a Figma node ID
5. Never hardcode hex values — map everything back to a token in `styles/theme.css`

---

## Questions?

Open an issue or reach out to the Design Systems team.
