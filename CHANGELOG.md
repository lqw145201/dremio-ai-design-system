# Changelog

All notable changes to the Dremio AI Agent Design System are documented here.
Newest entries appear at the top.

Format: **Date · Author · Component · Description**

---

## 2026-03-13 · Design Systems · design-system.html — Add missing Context section to §10 Workspace Panel

**What changed:** §10 Workspace Panel was missing documentation for `ContextSection` and `RightSectionHeader`. Expanded §10 with full specs for all three sub-sections and the shared header:
- **`RightSectionHeader`:** height, padding, label style (9px semibold uppercase), count pill (bg-muted, 16px, rounded-[3px])
- **Plan Section:** corrected step icon specs (13×13 inline SVG circles, not named icon components); step label colors by state; detail line style
- **Outputs Section:** active vs. hover states, reversed list order, blue dot indicator
- **Context Section:** row padding, hover bg, `IconEntityTable`/`IconEntityView` at 16px, path text (truncate, --foreground), detail line (9px --muted-foreground), code example of row structure

**Why:** The section previously had only a one-liner ("Context items: list of data sources with row counts") which gave no usable implementation guidance. All three sub-sections are documented at the same level of detail as other panel components.

---

## 2026-03-13 · Design Systems · design-system.html — Document new components (portable conversion)

**What changed:** Updated `design-system.html` with documentation for all components added during the svgPaths → portable conversion:
- **§1 Overview:** Updated file locations table to reflect design-system repo paths (`components/`, `hooks/`, `constants/`, `services/`). Added `constants/strings.ts`, `services/mock-responses.ts`, `UserMessageBubble`, `UserAvatar`, `ToolCallsBlock` to the inventory. Added "Portable Icon Strategy" subsection documenting the three resolution strategies (named `IconXxx` component, inline `PATH_XXX` constant, CSS animation).
- **§8 Chat Panel:** Replaced outdated block-structure table with a message-type table distinguishing user bubbles (bg-muted, asymmetric radius) from AI responses (no background). Added full ToolCallsBlock spec table documenting collapsed/expanded states and all four step statuses. Added note about auto-expand behaviour and non-standard viewBox PATH constants.
- **§16 (new) — Message Bubbles & Typing:** Full spec for `UserMessageBubble` (bg-muted, right-aligned, asymmetric 8/8/4/8 radius, max-w-80%), `UserMessageText`, and `AITypingIndicator` (3×6px dots, bg-accent/60, staggered animate-bounce). Includes usage code example and explicit warning that AI responses never use a bubble.
- **§17 (new) — User Avatar:** Spec for `UserAvatar` (rounded-full, sidebar-primary bg, white initials, size prop).
- **§14 Critical Rules:** Added rules 16–18 covering: never import svgPaths from Figma-generated files; AI responses have no message bubble; UserMessageBubble asymmetric radius.
- **TOC:** Added §16 and §17 entries.

**Why:** The design-system.html was not updated after multiple sessions of component work, leaving it out of sync with the actual codebase. All newly added or modified components are now documented.

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
