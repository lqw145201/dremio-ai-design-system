# Dremio AI Agent – Design System

> 👉 **[Open design-system.html](design-system.html) in your browser first** — visual color swatches, component demos, and specs.

> Component specifications, design tokens, and usage guidelines for the Dremio AI Agent product surface.

---

## What is this?

This repository is the **single source of truth** for the design system used across the Dremio AI Agent interface. It documents every component, interaction pattern, and design token so that:

- **PMs** can reference exact specs when writing tickets or reviewing designs
- **Engineers** from other teams can build new AI Agent features with zero guesswork
- **AI coding tools (Claude Code)** can generate pixel-accurate, token-correct code automatically

The companion prototype lives at `dremio-prototype/` — this repo documents the rules that govern it.

---

## Repository Structure

```
dremio-ai-design-system/
├── design-system.html           ← 👈 Open this first (browser, no install needed)
├── CLAUDE.md                    ← Claude Code rules (read automatically)
├── CHANGELOG.md                 ← All changes, newest first
├── README.md                    ← This file
├── ATTRIBUTIONS.md              ← Third-party credits
└── guidelines/
    ├── 01-Overview.md           ← Product layout, panel system, Figma refs
    ├── 02-Design-Tokens.md      ← Colors, typography, spacing, shadows
    ├── 03-Badges-and-Tags.md    ← BlockTypeBadge, TimeBadge, ApprovalBadge
    ├── 04-Buttons.md            ← All button variants + known prototype issues
    ├── 05-Left-Nav.md           ← LeftNav specs
    ├── 06-Top-Nav.md            ← TopNav specs
    ├── 07-Chat-List-Panel.md    ← Chat list, item rows, hover states
    ├── 08-Chat-Panel.md         ← Messages, tool call blocks, output blocks
    ├── 09-Chat-Input.md         ← Input bar, attach, submit
    ├── 10-Workspace-Panel.md    ← Plan steps, output tabs, context items
    ├── 11-Catalog-Panel.md      ← Tree items, save/pick mode
    ├── 12-Collapsed-Panel-Strip.md  ← Minimised panel strip
    └── 13-Panel-Layout.md       ← Resizable layout, panel interactions
```

---

## Getting Started

### For Engineers

**Clone and install the prototype:**

```bash
git clone https://github.com/lqw145201/dremio-ai-design-system.git
cd dremio-ai-design-system
```

Read `CLAUDE.md` first — it contains all token names, component locations, and the Figma workflow that govern every implementation decision.

For the live prototype:

```bash
# The prototype is a separate repo
git clone https://github.com/lqw145201/dremio-design-system.git
cd dremio-design-system
npm install
npm run dev
# → http://localhost:5173
```

### For PMs

Browse the `guidelines/` folder. Each file maps to a specific UI area with:
- A description of what the component does
- A spec table of exact dimensions, colors, and states
- A "Critical rules" section noting common mistakes

Start with [`guidelines/01-Overview.md`](guidelines/01-Overview.md) to understand the page structure, then navigate to specific component docs.

### With Claude Code

Open the prototype repository in Claude Code. The `CLAUDE.md` file is read automatically. You can then give natural language instructions like:

> *"Add a new output block type for 'lineage' following the same pattern as 'chart' blocks"*

Claude Code will read the Figma node, match the correct tokens, and generate compliant code.

---

## Figma File

All components are spec'd against:

| Reference | Figma Node |
|---|---|
| AI Agent page | `12400:79817` |
| Nav / Top Nav | `12337:132404` |
| Secondary nav module | `35:1429` |
| Secondary nav full | `36:2383` |

Full Figma file: `https://www.figma.com/design/P2EhSAF4LQfhYQEIiyltan/`

---

## Design Token Quick Reference

| Token | Hex | Use |
|---|---|---|
| `--primary` | `#43B8C9` | Primary buttons, active states |
| `--accent` | `#008489` | Ghost button text, links |
| `--foreground` | `#202124` | Primary text |
| `--secondary-foreground` | `#505862` | Labels, table headers |
| `--muted-foreground` | `#B0B7BF` | Placeholders, disabled only |
| `--background` | `#F6F7F8` | Page body |
| `--card` | `#FFFFFF` | Panels, cards |
| `--sidebar` | `#2A394A` | Left nav background |

Full token reference → [`guidelines/02-Design-Tokens.md`](guidelines/02-Design-Tokens.md)

---

## Contributing

1. Make changes in the prototype (`dremio-design-system/`) or update docs here
2. **Always add a `CHANGELOG.md` entry** for any meaningful change
3. PR title format: `[Component] Brief description` — e.g. `[ChatPanel] Add lineage block type`
4. Design changes must reference a Figma node ID

---

## Questions?

Open an issue or reach out to the Design Systems team.
