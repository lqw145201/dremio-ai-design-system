# Changelog

All notable changes to the Dremio AI Agent Design System are documented here.
Newest entries appear at the top.

Format: **Date · Author · Component · Description**

---

## 2026-03-13 · Design Systems · LeftNav — Match reference design (light background, secondary-foreground icons)

**What changed:**

`components/LeftNav.tsx`:
- Background: `var(--sidebar, #2A394A)` → `var(--background, #F6F7F8)` — light gray to match reference in mona_test_aiagent
- `IconWrapper` inactive color: `var(--sidebar-foreground, #ffffff)` → `var(--secondary-foreground, #505862)` — dark gray on light bg
- Removed `opacity: 0.7` from inactive items — reference uses full-opacity `--secondary-foreground` directly
- Active item background: `rgba(33,132,128,0.2)` → `rgba(33,132,128,0.1)` — 10% tint matches reference
- Bottom section icons (Help, Expand): updated to use `--secondary-foreground` instead of `--sidebar-foreground`

`design-system.html`:
- Section 07a updated: background, colors, spec table, and demo styles all updated to match new design

`CLAUDE.md`:
- LeftNav Props section: updated active/inactive color documentation
- Token table: `--sidebar` row clarified as not used by LeftNav

**Why:** User pointed to `https://github.com/lqw145201/mona_test_aiagent` as the correct reference. That design uses a light background nav with dark text, not the dark navy (`--sidebar`) that was previously used. All values now match the reference exactly.

---

## 2026-03-13 · Design Systems · LeftNav + CLAUDE.md — Add hex fallbacks and failure mode docs

**What changed:**

`components/LeftNav.tsx`:
- Background: `var(--sidebar)` → `var(--sidebar, #2A394A)` — hex fallback so nav renders dark navy even when `theme.css` is not yet imported
- `IconWrapper` color: `var(--accent)` / `var(--sidebar-foreground)` → added `#008489` / `#ffffff` fallbacks
- Label text color: same fallbacks added
- Bottom section icon spans: same fallbacks added

`CLAUDE.md`:
- Added **"Two failure modes that produce a broken LeftNav"** section immediately after the component workflow, documenting exactly what goes wrong when `theme.css` is missing or wrong icons are used, and how to fix each.

**Why:** AI-built implementations kept producing a white-background LeftNav with wrong icons (narwhal logo, generic icon set). Root causes: (1) `theme.css` not imported so CSS vars resolve to nothing; (2) icon components not copied, so generic fallbacks used. Hex fallbacks prevent silent white-nav failure; CLAUDE.md addition prevents icon substitution.

---

## 2026-03-13 · Design Systems · LeftNav — Fix icon color/opacity not applying

**What changed:** `components/LeftNav.tsx` — replaced `iconStyle()` helper (which passed a `style` prop directly to icon components) with an `IconWrapper` span that applies `color` and `opacity` via CSS inheritance.

**Why:** All icon components in `components/icons/` only accept `size` and `className` — they do not accept a `style` prop. Passing `style={iconStyle(...)}` was silently dropped, so inactive icons rendered at full opacity with no color override (defaulting to whatever fill the SVG had), and active icons received no teal color. The `IconWrapper` span sets `color` on a parent element so `fill="currentColor"` on the SVG picks it up correctly.

---

## 2026-03-13 · Design Systems · LeftNav + CLAUDE.md — Fix hardcoded active state and stale paths

**What changed:**

`components/LeftNav.tsx`:
- Added `LeftNavItem` type union and `LeftNavProps` interface (`activeItem`, `userInitials`, `onNavigate`)
- `LeftNav` now accepts all three props with defaults (`activeItem="ai-agent"`, `userInitials="TS"`)
- Every nav item wrapped in a click handler calling `onNavigate?.(item)`
- Active state driven by `activeItem` prop — no longer hardcoded to "AI Agent"
- `UserAvatar` initials now uses the `userInitials` prop

`CLAUDE.md`:
- Fixed 3 stale `src/app/` path references → `components/icons/`, `components/ui/button.tsx`, `styles/theme.css`
- Fixed critical rule #10: `src/app/components/icons/` → `components/icons/`
- Added **LeftNav Props** section with usage example

**Why:** AI systems were rebuilding LeftNav from scratch because (a) the component had no props and appeared frozen at "AI Agent" active state, and (b) CLAUDE.md referenced `src/app/` paths that don't exist in this repo, causing confusion about where icons and primitives live.

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
