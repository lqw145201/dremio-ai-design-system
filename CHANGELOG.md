# Changelog

All notable changes to the Dremio AI Agent Design System are documented here.
Newest entries appear at the top.

Format: **Date · Author · Component · Description**

---

## 2026-03-13 · Design Systems · Icons — Add icon asset library

**What changed:** Added all 113 Dremio icon assets to `public/icons/`:
- `public/icons/ai-agent/` — 101 SVGs exported from the AI Agent prototype's `.tsx` icon components (24×24px, `fill="currentColor"`)
- `public/icons/org-settings/` — 12 SVGs pulled from the `dremio-design-system` repo's org-settings icon set

**Why:** Engineers had no standalone icon asset reference. SVG exports allow icons to be used in design tools, documentation, and non-React contexts. Establishing a canonical icon folder also enforces the priority rule: prototype icons → org-settings icons → Fluent UI fallback.

**CLAUDE.md updated:** Added "Icon Priority Rule" section documenting the mandatory resolution order.

---

## 2026-03-13 · Design Systems · Repository — Initial release

**What changed:** Created the Dremio AI Agent Design System repository with full component documentation, CLAUDE.md rules file, README for engineers and PMs, and guidelines for all 13 component areas.

**Why:** The AI Agent prototype lacked a centralised, versioned design system. Engineers from other teams had no reference for tokens, component specs, or interaction patterns. This repo establishes that source of truth.

**Files added:**
- `CLAUDE.md` — Full rules file for Claude Code, covering tokens, Figma workflow, all component specs
- `README.md` — Onboarding guide for PMs and engineers
- `CHANGELOG.md` — This file
- `ATTRIBUTIONS.md` — Third-party credits
- `guidelines/01-Overview.md` — Product layout and panel system
- `guidelines/02-Design-Tokens.md` — Complete token reference with hex values and usage rules
- `guidelines/03-Badges-and-Tags.md` — BlockTypeBadge, TimeBadge, ApprovalBadge
- `guidelines/04-Buttons.md` — All button variants, known prototype inconsistency documented
- `guidelines/05-Left-Nav.md` — LeftNav specs
- `guidelines/06-Top-Nav.md` — TopNav specs
- `guidelines/07-Chat-List-Panel.md` — Chat list, item rows, hover/selected states
- `guidelines/08-Chat-Panel.md` — Messages, tool calls, output blocks, approval blocks
- `guidelines/09-Chat-Input.md` — Input bar specs
- `guidelines/10-Workspace-Panel.md` — Plan steps, output tabs, context items
- `guidelines/11-Catalog-Panel.md` — Tree items, browse mode, save/pick mode
- `guidelines/12-Collapsed-Panel-Strip.md` — Minimised panel behaviour
- `guidelines/13-Panel-Layout.md` — Resizable panel layout and interactions

---

## 2026-03-13 · Design Systems · Badges — TimeBadge color correction

**What changed:** Corrected `TimeBadge` color token from `#277ABD` (blue) to `#5ABD4A` (green). Token is `--chart-5 = rgba(90, 189, 74, 1)`.

**Why:** Previous documentation incorrectly described TimeBadge as using an info/blue color. Live prototype inspection confirmed the actual token resolves to green.

---

## 2026-03-13 · Design Systems · Badges — BlockTypeBadge dataset/view correction

**What changed:**
- `dataset` type: display label corrected from "DATASET" to "TABLE"
- `dataset` and `view` types: text color corrected from `--accent` to `--secondary-foreground` (same as all other types)
- Clarified that border is an `absolute inset-0` overlay div using `border-border`, not an accent-colored border

**Why:** Previous documentation showed dataset/view as a visually distinct accent-colored variant. All BlockTypeBadge types share identical styling — the only variation is the label text.

---

## 2026-03-13 · Design Systems · Buttons — Primary vs accent inconsistency documented

**What changed:** Added a note in button documentation that some ad-hoc action buttons in the prototype (Execute, Run in SQL runner) use `bg-accent` (#008489) directly instead of `<Button variant="default">`.

**Why:** The discrepancy was observed during prototype inspection. The rule is clear: `--accent` is for ghost button text and links only — never as a button background. Flagged for future refactoring.

---

<!-- Add new entries above this line -->
