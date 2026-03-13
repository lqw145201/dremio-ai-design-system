# Dremio AI Agent — Component Catalog

> **This is the source of truth for what components exist and how to use them.**
> Every component listed here has its source in `components/`. Copy them directly into a new project — do not rebuild from scratch.

---

## ⚠️ Critical Rule: Never Rebuild What Already Exists

Before writing a single line of component code, check this file. If the component is listed here, **copy the source file** — do not approximate, do not hand-build. Rebuilding from scratch always produces wrong spacing, wrong tokens, and wrong interaction states.

---

## Repository Structure

```
dremio-ai-design-system/
├── components/
│   ├── index.ts                ← barrel export: all components + icons + UI
│   ├── LeftNav.tsx             ← left sidebar (64px)
│   ├── TopNav.tsx              ← top bar (64px)
│   ├── ChatPanel.tsx           ← main message thread
│   ├── ChatListPanel.tsx       ← chat history list (left panel)
│   ├── WorkspacePanel.tsx      ← Plan / Outputs / Context tabs (right panel)
│   ├── CatalogPanel.tsx        ← data catalog tree (replaces Workspace)
│   ├── CollapsedPanelStrip.tsx ← icon strip when panels are collapsed
│   ├── ToolCallsBlock.tsx      ← "Used N tools" expandable block
│   ├── icons/                  ← 101 Dremio icon components
│   │   ├── index.ts            ← barrel export: all icons
│   │   └── Icon*.tsx           ← individual icons
│   └── ui/                     ← 48 UI primitive components
│       ├── index.ts            ← barrel export: all UI primitives
│       ├── button.tsx          ← CVA Button with 4 variants
│       ├── badge.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── dialog.tsx
│       └── ... (43 more)
├── hooks/
│   ├── index.ts
│   ├── useChat.ts              ← messages, input, approval, catalog actions
│   ├── usePanelLayout.ts       ← open/close state for all 4 panels
│   └── useWorkspace.ts         ← active block, history, save-as-view
├── styles/
│   └── theme.css               ← all CSS custom properties (copy into project)
└── public/icons/               ← 113 standalone SVG assets
```

---

## Layout Components

### `LeftNav`
Left sidebar with Dremio navigation icons.

```tsx
import { LeftNav } from './components';

<LeftNav />
```

| Property | Value |
|---|---|
| Width | 64px, fixed |
| Background | `--sidebar` (#2A394A) |
| Icons | 24×24px, uses `IconNav*` components |
| Active state | teal bg at 10% opacity |

**File:** `components/LeftNav.tsx`

---

### `TopNav`
Top bar with project context dropdown, search, and AI Agent button.

```tsx
import { TopNav } from './components';

<TopNav />
```

| Property | Value |
|---|---|
| Height | 64px, fixed |
| Background | `--card` (#FFFFFF) |
| Border bottom | `1px solid var(--muted)` |
| Contents | Project dropdown · Search bar · AI Agent button |

**File:** `components/TopNav.tsx`

---

### `ChatListPanel`
Left panel showing time-grouped chat history.

```tsx
import { ChatListPanel } from './components';

<ChatListPanel
  onSelectChat={(id) => ...}
  selectedChatId="abc123"
/>
```

| Property | Value |
|---|---|
| Default width | 240px (resizable) |
| Background | `--card` |
| Right border | `1px solid var(--muted)` |
| Chat item height | 40px |
| Selected row | `bg-muted` (#EEEFF1) |
| More button | `opacity-0 group-hover:opacity-100` — never always-visible |

**File:** `components/ChatListPanel.tsx`

---

### `ChatPanel`
Main message thread with user bubbles, AI responses, tool call blocks, and output blocks.

```tsx
import { ChatPanel } from './components';
import { useChat } from './hooks';

const chat = useChat();
<ChatPanel {...chat} />
```

Contains:
- User message bubbles (`bg-muted` rounded card)
- AI message text (no background)
- `ToolCallsBlock` ("Used N tools" expandable)
- Output blocks (SQL, TABLE, CHART, TEXT, VIEW)
- Approval blocks with action buttons

**File:** `components/ChatPanel.tsx`

---

### `WorkspacePanel`
Right panel with three tabs: Plan · Outputs · Context.

```tsx
import { WorkspacePanel } from './components';
import { useWorkspace, usePanelLayout } from './hooks';

const { openWorkspace, openCatalog } = usePanelLayout();
const workspace = useWorkspace(openWorkspace, openCatalog);
<WorkspacePanel {...workspace} onClose={closeWorkspace} />
```

**Tabs:**
- **Plan** — numbered step list with Done / Running / Pending states
- **Outputs** — list of output artifacts with `BlockTypeBadge`
- **Context** — data sources with row counts

**File:** `components/WorkspacePanel.tsx`

---

### `CatalogPanel`
Right panel showing the data catalog tree. Replaces `WorkspacePanel` when agent is in save/pick mode.

```tsx
import { CatalogPanel } from './components';

<CatalogPanel onClose={closeCatalog} pickMode={false} />
```

**File:** `components/CatalogPanel.tsx`

---

### `CollapsedPanelStrip`
Thin 40px icon strip that appears on the right edge when panels are collapsed.

```tsx
import { CollapsedPanelStrip } from './components';

<CollapsedPanelStrip
  workspaceCollapsed={true}
  catalogCollapsed={false}
  onExpandWorkspace={openWorkspace}
  onExpandCatalog={openCatalog}
/>
```

**File:** `components/CollapsedPanelStrip.tsx`

---

### `ToolCallsBlock`
Expandable "Used N tools" block rendered inside `ChatPanel` AI messages.

```tsx
import { ToolCallsBlock } from './components';

<ToolCallsBlock tools={[{ name: 'query_catalog', status: 'done' }]} />
```

**File:** `components/ToolCallsBlock.tsx`

---

## UI Primitives (`components/ui/`)

These are Radix UI + CVA primitives pre-configured with Dremio tokens.

### `Button`
```tsx
import { Button } from './components/ui';

<Button variant="default">Primary</Button>      // teal, bg-primary
<Button variant="secondary">Secondary</Button>  // white, border
<Button variant="ghost">Ghost</Button>           // transparent, accent text
<Button variant="destructive">Delete</Button>    // red
```

**All buttons:** `h-[32px]` · `px-2` · `rounded-[4px]` · `gap-1` icon gap
**⚠️ Never override hover colors via `className`** — edit `button.tsx` directly.

### `Badge`
```tsx
import { Badge } from './components/ui';
<Badge>Label</Badge>
```

### `Card`
```tsx
import { Card, CardHeader, CardContent } from './components/ui';
```

### `Tabs`
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui';
```

### Other available primitives
`accordion` · `alert` · `alert-dialog` · `avatar` · `calendar` · `checkbox` · `collapsible` · `command` · `context-menu` · `dialog` · `dropdown-menu` · `form` · `hover-card` · `input` · `label` · `menubar` · `navigation-menu` · `popover` · `progress` · `radio-group` · `resizable` · `scroll-area` · `select` · `separator` · `sheet` · `skeleton` · `slider` · `sonner` · `switch` · `table` · `textarea` · `toast` · `toggle` · `toggle-group` · `tooltip`

**File:** `components/ui/index.ts` exports all.

---

## Icons (`components/icons/`)

All 101 Dremio icons as React components. **Always import from here — never hand-draw SVG paths.**

```tsx
import { IconSearch, IconPlus, IconAiAgent } from './components/icons';

<IconSearch size={16} />   // inline with button text
<IconPlus size={20} />     // table row actions
<IconAiAgent size={24} />  // nav / page header
```

### Icon size rules
| Context | Size |
|---|---|
| Nav, page header | `size={24}` |
| Table row actions | `size={20}` |
| Button inline | `size={16}` |
| Badge icons | `size={12}` |

### Full icon list

| Icon name | Typical use |
|---|---|
| `IconAiAgent` | AI Agent nav item, branding |
| `IconCaretDown` / `Up` / `Left` / `Right` | Dropdowns, expand/collapse |
| `IconCheck` | Completed state, checkmarks |
| `IconCleanUp` | Clean/reset action |
| `IconClose` | Dismiss, close panel |
| `IconCollapse` / `CollapseLeft` / `CollapseRight` | Panel collapse controls |
| `IconCopy` | Copy to clipboard |
| `IconDatasetAddField` | Dataset add column |
| `IconDatasetCancel` | Cancel dataset action |
| `IconDatasetDetails` | View dataset details |
| `IconDatasetDownload` | Download dataset |
| `IconDatasetGroupBy` | Group by operation |
| `IconDatasetJoin` | Join operation |
| `IconDatasetLineage` | Lineage view |
| `IconDatasetPreview` | Preview dataset |
| `IconDatasetReflections` | Reflections |
| `IconDatasetRun` | Run dataset |
| `IconDelete` | Delete action (neutral default, red on hover) |
| `IconDrag` | Drag handle |
| `IconEdit` | Edit action |
| `IconEditWiki` | Edit wiki/description |
| `IconEntityFolderBlue` / `Purple` | Folder entities |
| `IconEntityIcebergTable` / `View` | Iceberg entity types |
| `IconEntityNamespace` | Namespace entity |
| `IconEntityTable` | Table entity |
| `IconEntityView` | View entity |
| `IconExpand` | Expand |
| `IconEyeHide` / `Show` | Toggle visibility |
| `IconFilter` / `FilterActive` | Filter controls |
| `IconGridView` / `ListView` | View mode toggle |
| `IconHelp` | Help/info |
| `IconHistory` | History |
| `IconHome` | Home nav |
| `IconInformation` | Info tooltip trigger |
| `IconJobCancel` / `Completed` / `EngineStart` / `Failed` / `Loading` / `NotAvailable` / `Profile` / `Queued` / `Setup` | Job status icons |
| `IconMore` | 3-dot overflow menu |
| `IconNavAppGrid` | App grid nav |
| `IconNavCatalog` | Catalog nav |
| `IconNavCollapseMenu` / `ExpandMenu` | Nav collapse |
| `IconNavDataset` | Dataset nav |
| `IconNavEnterprise` | Enterprise nav |
| `IconNavHelp` | Help nav |
| `IconNavHome` | Home nav |
| `IconNavJobs` | Jobs nav |
| `IconNavOptimizationJobs` | Optimization jobs nav |
| `IconNavProject` | Project nav |
| `IconNavSemanticLayer` | Semantic layer nav |
| `IconNavSettings` | Settings nav |
| `IconNavSqlRunner` | SQL runner nav |
| `IconPin` | Pin item |
| `IconPlus` | Add/create action |
| `IconRefresh` | Refresh |
| `IconSearch` | Search |
| `IconSettings` | Settings gear |
| `IconSettingsActivation` / `AiConfigurations` / `Auditing` / `Authentication` / `BiApplications` / `Billing` / `Catalog` / `Cloud` / `EngineRerouting` / `Engines` / `ExternalToken` / `Monitor` / `NodeActivity` / `Oauth` / `Preference` / `Privilege` / `ProjectStorage` / `Projects` / `Queue` / `QueueControl` / `Roles` / `Support` / `Users` | Settings section icons |
| `IconSqlFunction` | SQL function |
| `IconStarStarred` / `Unstarred` | Star/favourite |
| `IconWarning` | Warning state |
| `IconWikiTag` | Wiki tag |

---

## Hooks (`hooks/`)

### `useChat`
Manages all chat state: messages, input value, tool call results, approval flows, and catalog actions.

```tsx
import { useChat } from './hooks';

const {
  messages,           // ChatMessage[]
  inputValue,         // string
  setInputValue,      // (v: string) => void
  isTyping,           // boolean — AI is responding
  sendMessage,        // (text: string) => void
  handleApprove,      // (id: string) => void
  handleDeny,         // (id: string) => void
  outputBlocks,       // OutputBlock[]
} = useChat();
```

**Types exported:** `BlockType` · `OutputBlock` · `ApprovalData`

### `usePanelLayout`
Controls open/close state for all four panels.

```tsx
import { usePanelLayout } from './hooks';

const {
  chatListOpen,       // boolean
  catalogOpen,        // boolean
  workspaceOpen,      // boolean
  toggleChatList,     // () => void
  toggleCatalog,      // () => void
  toggleWorkspace,    // () => void
  openWorkspace,      // () => void
  closeChatList,      // () => void
  // ...etc
} = usePanelLayout();
```

### `useWorkspace`
Manages the active output block and the save-as-view flow.

```tsx
import { useWorkspace } from './hooks';

const {
  activeBlock,        // OutputBlock | null
  setActiveBlock,     // (block: OutputBlock) => void
  saveViewMode,       // SaveViewMode | null — non-null = catalog open in pick mode
  enterSaveView,      // (block: OutputBlock) => void
  exitSaveView,       // () => void
} = useWorkspace(openWorkspace, openCatalog);
```

---

## Styles (`styles/theme.css`)

Copy `styles/theme.css` into your project's `src/styles/` directory. It defines all CSS custom properties and maps them to Tailwind via `@theme inline`.

```css
/* All tokens available after importing theme.css */
var(--foreground)           /* #202124 — primary text */
var(--secondary-foreground) /* #505862 — labels, headers */
var(--muted-foreground)     /* #B0B7BF — placeholders/disabled ONLY */
var(--muted)                /* #EEEFF1 — dividers, muted backgrounds */
var(--background)           /* #F6F7F8 — page body */
var(--card)                 /* #FFFFFF — panels, cards */
var(--border)               /* #D2D6DA — input/card borders */
var(--primary)              /* #43B8C9 — primary buttons, active states */
var(--accent)               /* #008489 — ghost button text, links */
var(--destructive)          /* #CA3F32 — delete, error */
var(--sidebar)              /* #2A394A — left nav background */
var(--chart-5)              /* #5ABD4A — TimeBadge green */
```

---

## Complete Page Assembly Example

This is how all components wire together for the full AI Agent page:

```tsx
import { LeftNav, TopNav, ChatListPanel, ChatPanel, WorkspacePanel, CatalogPanel, CollapsedPanelStrip } from './components';
import { useChat, usePanelLayout, useWorkspace } from './hooks';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export function AIAgentPage() {
  const chat = useChat();
  const layout = usePanelLayout();
  const workspace = useWorkspace(layout.openWorkspace, layout.openCatalog);

  return (
    <div className="h-screen w-screen flex">
      <LeftNav />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <div className="flex-1 flex min-h-0">
          <PanelGroup direction="horizontal">
            {layout.chatListOpen && (
              <>
                <Panel defaultSize={20} minSize={14}>
                  <ChatListPanel />
                </Panel>
                <PanelResizeHandle />
              </>
            )}
            <Panel minSize={30}>
              <ChatPanel {...chat} />
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={28} minSize={0} collapsible>
              {workspace.saveViewMode ? (
                <CatalogPanel onClose={layout.closeCatalog} />
              ) : (
                <WorkspacePanel {...workspace} onClose={layout.closeWorkspace} />
              )}
            </Panel>
          </PanelGroup>
          <CollapsedPanelStrip
            workspaceCollapsed={!layout.workspaceOpen}
            catalogCollapsed={!layout.catalogOpen}
            onExpandWorkspace={layout.openWorkspace}
            onExpandCatalog={layout.openCatalog}
          />
        </div>
      </div>
    </div>
  );
}
```
