# Dremio Icon Assets

This folder contains all Dremio SVG icon assets used across the AI Agent prototype and org-settings surfaces.

## Structure

```
public/icons/
├── ai-agent/          ← 101 icons from the AI Agent prototype
│   ├── ai-agent.svg
│   ├── check.svg
│   ├── caret-down.svg
│   └── ... (101 total)
│
└── org-settings/      ← 12 icons from the Dremio org-settings surface
    ├── icon-ai.svg
    ├── icon-auditing.svg
    ├── icon-bi.svg
    └── ... (12 total)
```

## Icon Resolution Priority (MANDATORY)

When building a component, always resolve icons in this order — **stop at the first match**:

1. **`src/app/components/icons/`** — React `.tsx` components for all 101 AI Agent icons. Use these in React code.
2. **`public/icons/org-settings/`** — SVG assets for org-settings. Use as `<img src>` or CSS background when a React component is not available.
3. **`@fluentui/react-icons` Regular weight** — Fallback only. Use when no match is found in steps 1 or 2.

**Never install a new icon package.**

## Icon Specs

| Property | Value |
|---|---|
| Dimensions | 24×24px (viewBox `0 0 24 24`) |
| Fill | `currentColor` (ai-agent icons) or `var(--fill-0, #505862)` (org-settings) |
| Format | SVG 1.1 |

## ai-agent Icon Naming

All ai-agent SVGs are named in kebab-case without the `Icon` prefix:

| TSX component | SVG file |
|---|---|
| `IconAiAgent` | `ai-agent.svg` |
| `IconCaretDown` | `caret-down.svg` |
| `IconNavSettings` | `nav-settings.svg` |
| `IconSettingsUsers` | `settings-users.svg` |
| ... | ... |
