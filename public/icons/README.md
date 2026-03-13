# Dremio Icon Assets

This folder contains all 113 Dremio SVG icons used across the AI Agent prototype and org-settings surfaces.

## Icon Resolution Priority (MANDATORY)

When building a component, always resolve icons in this order — **stop at the first match**:

1. **`src/app/components/icons/`** — React `.tsx` components (101 AI Agent icons). Use these in React code.
2. **`public/icons/`** — Standalone SVG assets (this folder). Use as `<img src>` or in design tools.
3. **`@fluentui/react-icons` Regular weight** — Fallback only. Use when no match is found in steps 1 or 2.

**Never install a new icon package.**

## Naming Conventions

| Origin | File naming | Fill style |
|---|---|---|
| AI Agent prototype (101) | `kebab-case.svg` (e.g. `caret-down.svg`, `nav-settings.svg`) | `currentColor` |
| Org-settings surface (12) | `icon-kebab-case.svg` (e.g. `icon-ai.svg`, `icon-roles.svg`) | `var(--fill-0, #505862)` |

## Icon Specs

| Property | Value |
|---|---|
| Dimensions | 24×24px (viewBox `0 0 24 24`) |
| Format | SVG 1.1 |

## React Component → SVG Filename Mapping

TSX components in `src/app/components/icons/` map to SVG files here with the `Icon` prefix removed and CamelCase converted to kebab-case:

| TSX component | SVG file |
|---|---|
| `IconAiAgent` | `ai-agent.svg` |
| `IconCaretDown` | `caret-down.svg` |
| `IconNavSettings` | `nav-settings.svg` |
| `IconSettingsUsers` | `settings-users.svg` |
| `IconEntityTable` | `entity-table.svg` |
