import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import svgPaths from "../../imports/svg-javaskxvh1";
import historySvgPaths from "../../imports/svg-ktjy7sjh8n";
import type { OutputBlock, BlockType, CatalogActions } from "../hooks/useChat";
import { IconEntityTable } from "./icons/IconEntityTable";
import { IconEntityView } from "./icons/IconEntityView";

interface WorkspacePanelProps {
  activeBlock: OutputBlock | null;
  blockHistory: OutputBlock[];
  onClose: () => void;
  onSelectBlock: (block: OutputBlock) => void;
  onSaveAsView?: (block: OutputBlock) => void;
  chatActions?: { runQuery: () => void; explainQuery: () => void; catalogActions: CatalogActions; wikiSave: (id: string) => void; wikiDismiss: (id: string) => void } | null;
  onToggleCatalog?: () => void;
  catalogOpen?: boolean;
  bronzeComplete?: boolean;
}

/* ── Shared small components ─────────────────────────────────── */

function BlockTypeBadge({ type }: { type: BlockType }) {
  const labels: Record<BlockType, string> = {
    sql: "SQL",
    table: "TABLE",
    chart: "VIS",
    explanation: "TEXT",
    dataset: "DATASET",
    view: "VIEW",
  };
  const colors: Record<BlockType, string> = {
    sql: "text-secondary-foreground",
    table: "text-secondary-foreground",
    chart: "text-secondary-foreground",
    explanation: "text-secondary-foreground",
    dataset: "text-accent",
    view: "text-accent",
  };
  return (
    <div className="bg-card flex h-[20px] items-center justify-center px-[6px] py-px relative rounded-[var(--radius-button)] shrink-0">
      <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
      <p
        className={`tracking-[0.3px] uppercase whitespace-nowrap ${colors[type]}`}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "9px",
          fontWeight: "var(--font-weight-semibold)",
          lineHeight: "1.5",
        }}
      >
        {labels[type]}
      </p>
    </div>
  );
}

function formatTime(createdAt?: number): string {
  if (!createdAt) return "";
  const now = Date.now();
  const diff = now - createdAt;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(createdAt).toLocaleDateString();
}

/** Bordered toolbar button (visible actions). */
function ToolbarBtn({ label, primary, onClick, icon }: { label: string; primary?: boolean; onClick?: () => void; icon?: React.ReactNode }) {
  if (primary) {
    return (
      <button
        type="button"
        className="bg-accent flex h-[28px] items-center justify-center px-[8px] gap-[4px] rounded-[var(--radius-button)] shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onClick}
      >
        {icon}
        <p
          className="whitespace-nowrap"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semibold)",
            lineHeight: "1.5",
            color: "var(--primary-foreground)",
          }}
        >
          {label}
        </p>
      </button>
    );
  }
  return (
    <button
      type="button"
      className="flex h-[28px] items-center justify-center px-[8px] gap-[4px] relative rounded-[var(--radius-button)] shrink-0 cursor-pointer hover:bg-muted transition-colors"
      onClick={onClick}
    >
      <div aria-hidden="true" className="absolute border border-border/50 border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
      {icon}
      <p
        className="whitespace-nowrap"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-normal)",
          lineHeight: "1.5",
          color: "var(--secondary-foreground)",
        }}
      >
        {label}
      </p>
    </button>
  );
}

/** Three-dot "More" overflow menu for toolbars. */
function ToolbarMoreMenu({ items, onItemClick }: { items: string[]; onItemClick?: (item: string) => void }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.right });
    }
  }, [open]);

  return (
    <div ref={triggerRef} className="relative shrink-0">
      <button
        type="button"
        className="flex h-[28px] w-[28px] items-center justify-center relative rounded-[var(--radius-button)] shrink-0 cursor-pointer hover:bg-muted transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div aria-hidden="true" className="absolute border border-border/50 border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
        <svg width="10" height="3" viewBox="0 0 10.3333 2.33333" fill="none">
          <path d={svgPaths.p12e12a80} fill="var(--secondary-foreground)" />
          <path d={svgPaths.p39c2dc00} fill="var(--secondary-foreground)" />
          <path d={svgPaths.p1a349680} fill="var(--secondary-foreground)" />
        </svg>
      </button>
      {open && menuPos && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-popover overflow-clip py-[4px] rounded-[var(--radius-button)] shadow-dropdown min-w-[8rem]"
          style={{ top: menuPos.top, left: menuPos.left, transform: "translateX(-100%)" }}
        >
          {items.map((item) => (
            <button
              key={item}
              type="button"
              className="h-[32px] w-full text-left flex items-center cursor-pointer select-none hover:bg-background-hover transition-colors"
              onClick={() => { setOpen(false); onItemClick?.(item); }}
            >
              <div className="flex items-center gap-[4px] pl-[16px] pr-[8px] size-full">
                <span
                  className="flex-1 whitespace-nowrap text-popover-foreground"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-base)",
                    fontWeight: "var(--font-weight-normal)",
                    lineHeight: "20px",
                  }}
                >
                  {item}
                </span>
              </div>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

/* ── History dropdown ─────────────────────────────────────────── */

function HistoryDropdown({
  blocks,
  activeBlockId,
  onSelect,
}: {
  blocks: OutputBlock[];
  activeBlockId: string | null;
  onSelect: (block: OutputBlock) => void;
}) {
  // Newest first
  const sorted = [...blocks].reverse();

  return (
    <div className="absolute top-[52px] right-[8px] z-50 bg-popover text-popover-foreground rounded-md border border-border shadow-md w-[280px] max-h-[320px] overflow-hidden flex flex-col">
      <div className="px-[12px] py-[8px] border-b border-border">
        <p
          className="text-foreground"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semibold)",
            lineHeight: "1.5",
          }}
        >
          Generated Outputs
        </p>
        <p
          className="text-muted-foreground"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "9px",
            fontWeight: "var(--font-weight-normal)",
            lineHeight: "1.5",
          }}
        >
          {blocks.length} items · newest first
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {sorted.map((block) => (
          <button
            key={block.id}
            type="button"
            className={`w-full flex items-center gap-[8px] px-2 py-1.5 cursor-pointer rounded-sm select-none hover:bg-accent hover:text-accent-foreground transition-colors ${
              block.id === activeBlockId ? "bg-muted/60" : ""
            }`}
            onClick={() => onSelect(block)}
          >
            <BlockTypeBadge type={block.type} />
            <div className="flex-1 min-w-0 text-left">
              <p
                className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  lineHeight: "1.5",
                }}
              >
                {block.title}
              </p>
            </div>
            <div className="flex items-center gap-[6px] shrink-0">
              <p
                className="text-muted-foreground whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "9px",
                  fontWeight: "var(--font-weight-normal)",
                  lineHeight: "1.5",
                }}
              >
                v{block.version}
              </p>
              {block.createdAt && (
                <p
                  className="text-muted-foreground whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "9px",
                    fontWeight: "var(--font-weight-normal)",
                    lineHeight: "1.5",
                  }}
                >
                  {formatTime(block.createdAt)}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Workspace content views ─────────────────────────────────── */

function SqlWorkspaceView({ block, onSaveAsView, onRunQuery, onExplainQuery }: { block: OutputBlock; onSaveAsView?: (block: OutputBlock) => void; onRunQuery?: () => void; onExplainQuery?: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-auto px-[16px] py-[8px]">
      <div className="relative rounded-[var(--radius-card)] w-full flex-1 min-h-0">
        <div className="overflow-hidden rounded-[inherit] size-full">
          <div className="flex flex-col items-start p-px size-full">
            {/* Toolbar: title left, actions right — matches Table/Chart/Explanation layout */}
            <div className="bg-[rgba(249,250,251,0.5)] relative shrink-0 w-full">
              <div aria-hidden="true" className="absolute border-border/30 border-b border-solid inset-0 pointer-events-none" />
              <div className="flex items-center px-[12px] py-[8px] w-full gap-[8px]">
                <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px] flex-1">
                  {block.title}
                </p>
                <ToolbarBtn
                  label="Run in SQL runner"
                  primary
                  onClick={onRunQuery}
                  icon={
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="shrink-0">
                      <path d="M1.5 1.288a.5.5 0 0 1 .736-.44l7.5 4.212a.5.5 0 0 1 0 .88l-7.5 4.212A.5.5 0 0 1 1.5 9.712V1.288Z" fill="var(--primary-foreground)" />
                    </svg>
                  }
                />
                <ToolbarBtn label="Copy" />
                <ToolbarMoreMenu
                  items={["Save as View", "Format", "Explain", "Download .sql", "Edit"]}
                  onItemClick={(item) => { if (item === "Save as View") onSaveAsView?.(block); if (item === "Explain") onExplainQuery?.(); }}
                />
              </div>
            </div>
            {/* SQL Code */}
            <div className="bg-card flex-1 w-full overflow-auto">
              <div className="p-[16px]">
                <pre className="font-['Fira Code',monospace] text-[12px] leading-[150%] whitespace-pre-wrap">
                  <span className="text-muted-foreground italic">-- Bronze layer DDL · Auto-generated by AI Agent</span>{"\n"}
                  <span className="text-accent font-medium">CREATE OR REPLACE VIEW</span><span className="text-foreground"> bronze.customer_360.raw_customers </span><span className="text-accent font-medium">AS</span>{"\n"}
                  <span className="text-accent font-medium">SELECT</span>{"\n"}
                  <span className="text-foreground">  customer_id,</span>{"\n"}
                  <span className="text-foreground">  first_name,</span>{"\n"}
                  <span className="text-foreground">  last_name,</span>{"\n"}
                  <span className="text-foreground">  email,</span>{"\n"}
                  <span className="text-foreground">  phone,</span>{"\n"}
                  <span className="text-foreground">  city,</span>{"\n"}
                  <span className="text-foreground">  state,</span>{"\n"}
                  <span className="text-foreground">  created_at,</span>{"\n"}
                  <span className="text-foreground">  updated_at,</span>{"\n"}
                  <span className="text-foreground">  source_system,</span>{"\n"}
                  <span className="text-foreground">  _ingested_at</span>{"\n"}
                  <span className="text-accent font-medium">FROM</span><span className="text-foreground"> crm.raw_customers;</span>{"\n"}
                  {"\n"}
                  <span className="text-muted-foreground italic">-- (+ 3 more views: raw_orders, raw_interactions, raw_campaigns)</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-border/50 border-solid inset-0 pointer-events-none rounded-[var(--radius-card)]" />
      </div>
    </div>
  );
}

function TableWorkspaceView({ block, onSaveAsView }: { block: OutputBlock; onSaveAsView?: (block: OutputBlock) => void }) {
  const rows = [
    { station: "Grand Central Terminal", total: 45892, member: 38204, casual: 7688, avg: 8.2 },
    { station: "Union Square", total: 38451, member: 29841, casual: 8610, avg: 12.4 },
    { station: "Times Square", total: 35120, member: 18560, casual: 16560, avg: 18.7 },
    { station: "Penn Station", total: 32890, member: 27521, casual: 5369, avg: 9.1 },
    { station: "Central Park South", total: 28744, member: 14372, casual: 14372, avg: 22.3 },
    { station: "Columbus Circle", total: 26510, member: 21208, casual: 5302, avg: 10.6 },
    { station: "Brooklyn Bridge", total: 24893, member: 12447, casual: 12446, avg: 25.1 },
    { station: "Wall Street", total: 22140, member: 19926, casual: 2214, avg: 7.8 },
    { station: "Hudson Yards", total: 19876, member: 15901, casual: 3975, avg: 14.2 },
    { station: "Williamsburg Bridge", total: 18320, member: 14656, casual: 3664, avg: 16.9 },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-[16px] py-[8px]">
      <div className="relative rounded-[var(--radius-card)] w-full flex-1 min-h-0 border border-border/50 overflow-hidden flex flex-col">
        {/* Toolbar: Export CSV + Copy visible, rest in More */}
        <div className="bg-[rgba(249,250,251,0.5)] relative shrink-0 w-full border-b border-border/30">
          <div className="flex items-center px-[12px] py-[8px] w-full gap-[8px]">
            <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px]">
              {block.title}
            </p>
            <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-muted-foreground text-[12px] flex-1">
              {rows.length} rows · 5 cols
            </p>
            <ToolbarBtn label="Export CSV" />
            <ToolbarBtn label="Copy" />
            <ToolbarMoreMenu
              items={["Save as View", "Download JSON"]}
              onItemClick={(item) => { if (item === "Save as View") onSaveAsView?.(block); }}
            />
          </div>
        </div>
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background border-b border-muted sticky top-0">
                <th className="text-left px-[8px] py-[6px] font-['Inter',sans-serif] font-semibold text-foreground text-[12px] leading-[150%] border-l border-muted first:border-l-0">Station</th>
                <th className="text-right px-[8px] py-[6px] font-['Inter',sans-serif] font-semibold text-foreground text-[12px] leading-[150%] border-l border-muted">Total</th>
                <th className="text-right px-[8px] py-[6px] font-['Inter',sans-serif] font-semibold text-foreground text-[12px] leading-[150%] border-l border-muted">Members</th>
                <th className="text-right px-[8px] py-[6px] font-['Inter',sans-serif] font-semibold text-foreground text-[12px] leading-[150%] border-l border-muted">Casual</th>
                <th className="text-right px-[8px] py-[6px] font-['Inter',sans-serif] font-semibold text-foreground text-[12px] leading-[150%] border-l border-muted">Avg Min</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-muted hover:bg-muted/30">
                  <td className="px-[8px] py-[6px] font-['Inter',sans-serif] font-normal text-foreground text-[12px] leading-[150%]">{row.station}</td>
                  <td className="text-right px-[8px] py-[6px] font-['Inter',sans-serif] font-normal text-foreground text-[12px] leading-[150%] border-l border-muted">{row.total.toLocaleString()}</td>
                  <td className="text-right px-[8px] py-[6px] font-['Inter',sans-serif] font-normal text-foreground text-[12px] leading-[150%] border-l border-muted">{row.member.toLocaleString()}</td>
                  <td className="text-right px-[8px] py-[6px] font-['Inter',sans-serif] font-normal text-foreground text-[12px] leading-[150%] border-l border-muted">{row.casual.toLocaleString()}</td>
                  <td className="text-right px-[8px] py-[6px] font-['Inter',sans-serif] font-normal text-foreground text-[12px] leading-[150%] border-l border-muted">{row.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Lineage node card (workspace full view) ─────────────────── */

function LineageNodeCard({ node, isTarget }: { node: { id: string; label: string; namespace: string; type: string; columns: string[] }; isTarget?: boolean }) {
  const [showColumns, setShowColumns] = useState(true);
  const iconColor = node.type === "source" ? "var(--fyi)" : "var(--primary)";

  return (
    <div className={`bg-card rounded-[var(--radius-card)] shrink-0 w-[220px] overflow-hidden ${isTarget ? "ring-2 ring-accent/40" : ""}`} style={{ border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="bg-background h-[40px] w-full relative rounded-t-[var(--radius-card)]">
        <div aria-hidden="true" className="absolute border-border border-b border-solid inset-0 pointer-events-none rounded-t-[var(--radius-card)]" />
        <div className="flex items-center px-[8px] py-[4px] size-full gap-[8px]">
          <div className="shrink-0 size-[24px] rounded-[2px] flex items-center justify-center" style={{ backgroundColor: iconColor }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="16" height="16" rx="2" fill="white" fillOpacity="0.3" />
              <rect x="4" y="4" width="12" height="5" rx="1" fill="white" fillOpacity="0.8" />
              <rect x="4" y="11" width="12" height="5" rx="1" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
          <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[14px] overflow-hidden text-ellipsis whitespace-nowrap flex-1">{node.label}</p>
        </div>
      </div>
      {/* Metadata */}
      <div className="px-[8px] py-[4px] border-b border-border">
        <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px]">{node.namespace}</p>
        <div className="flex items-center justify-between mt-[2px]">
          <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px]">Jobs (last 30 hours)</p>
          <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-accent text-[12px]">23</p>
        </div>
        <div className="flex items-center justify-between mt-[2px]">
          <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px]">Owner</p>
          <div className="flex items-center gap-[4px]">
            <div className="size-[16px] rounded-full bg-accent/30 flex items-center justify-center">
              <p className="font-['Inter',sans-serif] font-normal text-accent text-[8px]">A</p>
            </div>
            <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px]">Antonio</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[2px]">
          <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px]">Last updated</p>
          <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px]">Sep 11, 2024, 6:23AM</p>
        </div>
      </div>
      {/* Columns toggle */}
      <div className="px-[8px] py-[4px] border-b border-border">
        <button type="button" className="flex items-center gap-[4px] cursor-pointer" onClick={() => setShowColumns(!showColumns)}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: showColumns ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M1 1L5 5L9 1" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-accent text-[12px]">{showColumns ? "Hide" : "Show"} {node.columns.length} columns</p>
        </button>
      </div>
      {/* Columns list */}
      {showColumns && (
        <div className="max-h-[180px] overflow-y-auto">
          {node.columns.map((col, i) => (
            <div key={`${col}-${i}`} className="flex items-center gap-[4px] px-[16px] py-[4px]">
              <span className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[9px] shrink-0">abc</span>
              <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px] overflow-hidden text-ellipsis whitespace-nowrap">{col}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChartWorkspaceView({ block, onSaveAsView }: { block: OutputBlock; onSaveAsView?: (block: OutputBlock) => void }) {
  const isLineage = block.data?.lineage;

  if (isLineage) {
    const { nodes, edges } = block.data;
    return (
      <div className="flex-1 flex flex-col overflow-hidden px-[16px] py-[8px]">
        <div className="relative rounded-[var(--radius-card)] w-full flex-1 min-h-0 border border-border/50 overflow-hidden flex flex-col bg-card">
          {/* Toolbar */}
          <div className="bg-[rgba(249,250,251,0.5)] border-b border-border/30 shrink-0">
            <div className="flex items-center px-[12px] py-[8px] w-full gap-[8px]">
              <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px] flex-1">
                {block.title}
              </p>
              <ToolbarBtn label="Zoom to fit" />
              <ToolbarBtn label="Copy" />
              <ToolbarMoreMenu items={["Download PNG", "Download SVG", "Share"]} />
            </div>
          </div>
          {/* Lineage graph area */}
          <div className="flex-1 overflow-auto p-[24px]">
            <div className="flex items-start gap-[48px] min-w-min">
              {nodes.map((node: any, i: number) => (
                <div key={node.id} className="flex items-center gap-[24px]">
                  <LineageNodeCard node={node} isTarget={node.id === "target"} />
                  {i < nodes.length - 1 && (
                    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="shrink-0">
                      <path d="M0 12H40M40 12L34 6M40 12L34 18" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const data = [
    { station: "Grand Central", member: 83, casual: 17 },
    { station: "Union Sq", member: 78, casual: 22 },
    { station: "Times Sq", member: 53, casual: 47 },
    { station: "Penn Stn", member: 84, casual: 16 },
    { station: "Central Pk", member: 50, casual: 50 },
  ];

  return (
    <div className="flex-1 overflow-auto px-[16px] py-[8px]">
      <div className="relative rounded-[var(--radius-card)] w-full border border-border/50 overflow-hidden bg-card">
        <div className="bg-[rgba(249,250,251,0.5)] border-b border-border/30">
          <div className="flex items-center px-[12px] py-[8px] w-full gap-[8px]">
            <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px] flex-1">
              {block.title}
            </p>
            <ToolbarBtn label="Copy" />
            <ToolbarBtn label="Save as View" onClick={() => onSaveAsView?.(block)} />
            <ToolbarMoreMenu items={["Download PNG", "Download CSV", "Edit"]} />
          </div>
        </div>
        <div className="p-[16px]">
          <div className="flex items-end gap-[10px] h-[120px] pb-[24px]">
            {data.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col gap-px items-start h-full justify-end">
                <div className="bg-accent/80 rounded-t-[3px] w-full" style={{ height: `${d.member}%` }} />
                <div className="bg-chart-4 rounded-b-[3px] w-full" style={{ height: `${d.casual}%` }} />
                <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-muted-foreground text-[9px] mt-[4px] text-center w-full">{d.station}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-[16px] items-center mt-[8px]">
            <div className="flex items-center gap-[4px]">
              <div className="size-[8px] rounded-sm bg-accent/80" />
              <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-muted-foreground text-[9px]">Member</p>
            </div>
            <div className="flex items-center gap-[4px]">
              <div className="size-[8px] rounded-sm bg-chart-4" />
              <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-muted-foreground text-[9px]">Casual</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExplanationWorkspaceView({ block, onWikiSave, onWikiDismiss }: { block: OutputBlock; onWikiSave?: (id: string) => void; onWikiDismiss?: (id: string) => void }) {
  const wikiReview = block.data?.wikiReview;
  const isWiki = !!wikiReview;
  const isPending = isWiki && wikiReview.status === "pending";

  return (
    <div className="flex-1 overflow-auto px-[16px] py-[8px]">
      <div className={`relative rounded-[var(--radius-card)] w-full overflow-hidden bg-card ${isWiki ? "border border-fyi/20" : "border border-border/50"}`}>
        {/* Toolbar */}
        <div className="bg-[rgba(249,250,251,0.5)] border-b border-border/30">
          <div className="flex items-center px-[12px] py-[8px] w-full gap-[8px]">
            <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px] flex-1">
              {block.title}
            </p>
            {isPending && onWikiSave && (
              <ToolbarBtn label="Save Wiki" primary onClick={() => onWikiSave(wikiReview.id)} />
            )}
            {isPending && onWikiDismiss && (
              <ToolbarBtn label="Dismiss" onClick={() => onWikiDismiss(wikiReview.id)} />
            )}
            {isWiki && wikiReview.status === "saved" && (
              <div className="bg-chart-5/10 flex h-[20px] items-center justify-center px-[6px] py-px rounded-[var(--radius-button)] shrink-0 gap-[4px]">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="var(--chart-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p className="font-['Inter',sans-serif] font-bold leading-[150%] text-chart-5 text-[9px] tracking-[0.3px] uppercase whitespace-nowrap">SAVED</p>
              </div>
            )}
            {isWiki && wikiReview.status === "dismissed" && (
              <div className="bg-muted flex h-[20px] items-center justify-center px-[6px] py-px rounded-[var(--radius-button)] shrink-0">
                <p className="font-['Inter',sans-serif] font-bold leading-[150%] text-secondary-foreground text-[9px] tracking-[0.3px] uppercase whitespace-nowrap">DISMISSED</p>
              </div>
            )}
            {!isWiki && <ToolbarBtn label="Copy" />}
            {!isWiki && <ToolbarBtn label="Regenerate" />}
            <ToolbarMoreMenu items={isWiki ? ["Copy", "Download TXT"] : ["Download TXT", "Share"]} />
          </div>
        </div>
        <div className="p-[16px]">
          <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px]">
            {block.preview || "The query joins trip records with station metadata to compute aggregated metrics. The GROUP BY clause partitions results by station, while CASE WHEN expressions split counts between member and casual rider types. The final ORDER BY sorts stations by total trip volume."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Dataset Profile workspace view ──────────────────────────── */

function DatasetWorkspaceView({ block }: { block: OutputBlock }) {
  const d = block.data?.profile;
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [semanticOpen, setSemanticOpen] = useState(true);
  const [columnsOpen, setColumnsOpen] = useState(true);
  const [wikiOpen, setWikiOpen] = useState(true);

  if (!d) return <div className="flex-1 flex items-center justify-center"><p className="font-['Inter',sans-serif] font-normal leading-[150%] text-muted-foreground text-[14px]">No profile data</p></div>;

  const SectionHeader = ({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) => (
    <button type="button" className="flex gap-[4px] items-center py-[8px] w-full cursor-pointer" onClick={onToggle}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "none" : "rotate(-90deg)", transition: "transform 150ms ease" }}>
        <path d="M7 10L12 15L17 10" stroke="var(--secondary-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[16px] flex-1 text-left">{label}</p>
    </button>
  );

  const MetaRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div className="flex items-center justify-between py-[4px]">
      <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[14px]">{label}</p>
      <p className={`font-['Inter',sans-serif] font-normal leading-[150%] text-[14px] ${accent ? "text-accent" : "text-foreground"}`}>{value}</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-[16px] py-[8px]">
      <div className="relative rounded-[var(--radius-card)] w-full flex-1 min-h-0 border border-border/50 overflow-hidden flex flex-col bg-card">
        {/* Toolbar */}
        <div className="bg-[rgba(249,250,251,0.5)] border-b border-border/30 shrink-0">
          <div className="flex items-center px-[12px] py-[8px] w-full gap-[8px]">
            {/* Dataset icon */}
            <div className="shrink-0 size-[24px] rounded-[4px] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="12" height="12" rx="2" stroke="var(--secondary-foreground)" strokeWidth="1.2" />
                <line x1="1" y1="5" x2="13" y2="5" stroke="var(--secondary-foreground)" strokeWidth="1.2" />
                <line x1="5" y1="5" x2="5" y2="13" stroke="var(--secondary-foreground)" strokeWidth="1.2" />
                <line x1="9" y1="5" x2="9" y2="13" stroke="var(--secondary-foreground)" strokeWidth="1.2" />
              </svg>
            </div>
            <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[16px] flex-1">{block.title}</p>
            <ToolbarBtn label="Query" primary />
            <ToolbarBtn label="Edit" />
            <ToolbarMoreMenu items={["Add to Chat", "View Lineage", "Show Sample Data", "Copy Path"]} />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-[8px] px-[16px] py-[8px]">

            {/* ── Overview ──────────────────────────── */}
            <SectionHeader label="Overview" open={overviewOpen} onToggle={() => setOverviewOpen(!overviewOpen)} />
            {overviewOpen && (
              <div className="flex flex-col gap-[8px] pb-[8px]">
                <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[14px]">{d.path}</p>
                {/* Labels */}
                <div className="flex gap-[8px] items-center flex-wrap">
                  {d.labels?.map((label: string) => (
                    <div key={label} className="bg-primary/10 flex h-[24px] items-center justify-center px-[8px] rounded-[var(--radius-button)] shrink-0 relative">
                      <div aria-hidden="true" className="absolute border border-primary/20 border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
                      <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[12px] whitespace-nowrap">{label}</p>
                    </div>
                  ))}
                </div>
                {/* Meta rows */}
                <div className="flex flex-col border-t border-muted pt-[8px]">
                  <MetaRow label="Jobs (last 30 days)" value={String(d.jobs30d)} accent />
                  <MetaRow label="Descendants" value={String(d.descendants)} />
                  <MetaRow label="Created" value={d.created} />
                  <MetaRow label="Owner" value={d.owner} />
                  <MetaRow label="Last updated" value={d.updated} />
                </div>

              </div>
            )}

            <div className="border-t border-muted" />

            {/* ── Semantic ──────────────────────────── */}
            <SectionHeader label="Semantic" open={semanticOpen} onToggle={() => setSemanticOpen(!semanticOpen)} />
            {semanticOpen && (
              <div className="flex flex-col gap-[12px] pb-[8px]">
                <div>
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px] mb-[4px]">Entity</p>
                  <div className="inline-flex h-[28px] items-center px-[8px] rounded-[var(--radius-button)] border border-accent/40 bg-accent/5">
                    <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-accent text-[14px]">{d.entity}</p>
                  </div>
                </div>
                <div>
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px] mb-[4px]">Metrics</p>
                  <div className="flex gap-[8px] items-center flex-wrap">
                    {d.metrics?.map((m: string) => (
                      <div key={m} className="inline-flex h-[28px] items-center px-[8px] rounded-[var(--radius-button)] border border-accent/40 bg-accent/5">
                        <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-accent text-[14px]">{m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-muted" />

            {/* ── Columns ───────────────────────────── */}
            <SectionHeader label={`Columns (${d.columns?.length || 0})`} open={columnsOpen} onToggle={() => setColumnsOpen(!columnsOpen)} />
            {columnsOpen && (
              <div className="pb-[8px]">
                {/* Column header */}
                <div className="flex items-center py-[6px] border-b border-muted">
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px] flex-1">Column name</p>
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px] w-[140px] text-right">Attribute</p>
                </div>
                {/* Column rows */}
                {d.columns?.map((col: { name: string; type: string; attr: string }) => (
                  <div key={col.name} className="flex items-center py-[6px] border-b border-muted/50 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-[8px] flex-1 min-w-0">
                      <span className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px] shrink-0 w-[24px] text-center">{col.type}</span>
                      <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">{col.name}</p>
                    </div>
                    <div className="flex items-center gap-[4px] w-[140px] justify-end">
                      <span className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px] shrink-0">{col.type}</span>
                      <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">{col.attr}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-muted" />

            {/* ── Wiki ──────────────────────────────── */}
            <SectionHeader label="Wiki" open={wikiOpen} onToggle={() => setWikiOpen(!wikiOpen)} />
            {wikiOpen && (
              <div className="flex flex-col gap-[16px] pb-[16px]">
                <div>
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[14px] mb-[4px]">Volume</p>
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px]">{d.wikiVolume}</p>
                </div>
                <div>
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[14px] mb-[4px]">Data Quality</p>
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px]">{d.wikiQuality}</p>
                </div>
                <div>
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[14px] mb-[4px]">Description</p>
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px]">{d.wikiDescription}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── View Profile workspace view ─────────────────────────────── */

function ViewWorkspaceView({ block }: { block: OutputBlock }) {
  const d = block.data?.profile;
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [columnsOpen, setColumnsOpen] = useState(true);
  const [wikiOpen, setWikiOpen] = useState(true);

  if (!d) return <div className="flex-1 flex items-center justify-center"><p className="font-['Inter',sans-serif] font-normal leading-[150%] text-muted-foreground text-[14px]">No profile data</p></div>;

  const SectionHeader = ({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) => (
    <button type="button" className="flex gap-[4px] items-center py-[8px] w-full cursor-pointer" onClick={onToggle}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "none" : "rotate(-90deg)", transition: "transform 150ms ease" }}>
        <path d="M7 10L12 15L17 10" stroke="var(--secondary-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[16px] flex-1 text-left">{label}</p>
    </button>
  );

  const MetaRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div className="flex items-center justify-between py-[4px]">
      <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[14px]">{label}</p>
      <p className={`font-['Inter',sans-serif] font-normal leading-[150%] text-[14px] ${accent ? "text-accent" : "text-foreground"}`}>{value}</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-[16px] py-[8px]">
      <div className="relative rounded-[var(--radius-card)] w-full flex-1 min-h-0 border border-accent/20 overflow-hidden flex flex-col bg-card">
        {/* Toolbar */}
        <div className="bg-[rgba(249,250,251,0.5)] border-b border-border/30 shrink-0">
          <div className="flex items-center px-[12px] py-[8px] w-full gap-[8px]">
            <div className="shrink-0 size-[24px] rounded-[4px] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="12" height="12" rx="2" stroke="var(--accent)" strokeWidth="1.2" />
                <line x1="1" y1="5" x2="13" y2="5" stroke="var(--accent)" strokeWidth="1.2" />
                <line x1="5" y1="5" x2="5" y2="13" stroke="var(--accent)" strokeWidth="1.2" />
                <line x1="9" y1="5" x2="9" y2="13" stroke="var(--accent)" strokeWidth="1.2" />
              </svg>
            </div>
            <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[16px] flex-1">{block.title}</p>
            <ToolbarBtn label="Query" primary />
            <ToolbarBtn label="Edit" />
            <ToolbarMoreMenu items={["Go to dataset", "View Lineage", "Show Sample Data", "Copy Path"]} />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-[8px] px-[16px] py-[8px]">

            {/* ── Overview ──────────────────────────── */}
            <SectionHeader label="Overview" open={overviewOpen} onToggle={() => setOverviewOpen(!overviewOpen)} />
            {overviewOpen && (
              <div className="flex flex-col gap-[8px] pb-[8px]">
                <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[14px]">{d.path}</p>
                <div className="flex gap-[8px] items-center flex-wrap">
                  {d.labels?.map((label: string) => (
                    <div key={label} className="bg-accent/10 flex h-[24px] items-center justify-center px-[8px] rounded-[var(--radius-button)] shrink-0 relative">
                      <div aria-hidden="true" className="absolute border border-accent/20 border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
                      <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-accent text-[12px] whitespace-nowrap">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col border-t border-muted pt-[8px]">
                  <MetaRow label="Created" value={d.created} />
                  <MetaRow label="Owner" value={d.owner} />
                  <MetaRow label="Last updated" value={d.updated} />
                  <MetaRow label="Volume" value={d.volume} />
                </div>
              </div>
            )}

            <div className="border-t border-muted" />

            {/* ── Columns ───────────────────────────── */}
            <SectionHeader label={`Columns (${d.columns?.length || 0})`} open={columnsOpen} onToggle={() => setColumnsOpen(!columnsOpen)} />
            {columnsOpen && (
              <div className="pb-[8px]">
                <div className="flex items-center py-[6px] border-b border-muted">
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px] flex-1">Column name</p>
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px] w-[140px] text-right">Attribute</p>
                </div>
                {d.columns?.map((col: { name: string; type: string; attr: string }) => (
                  <div key={col.name} className="flex items-center py-[6px] border-b border-muted/50 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-[8px] flex-1 min-w-0">
                      <span className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px] shrink-0 w-[24px] text-center">{col.type}</span>
                      <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">{col.name}</p>
                    </div>
                    <div className="flex items-center gap-[4px] w-[140px] justify-end">
                      <span className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px] shrink-0">{col.type}</span>
                      <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[14px] overflow-hidden text-ellipsis whitespace-nowrap">{col.attr}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-muted" />

            {/* ── Wiki ──────────────────────────────── */}
            <SectionHeader label="Wiki" open={wikiOpen} onToggle={() => setWikiOpen(!wikiOpen)} />
            {wikiOpen && (
              <div className="flex flex-col gap-[16px] pb-[16px]">
                <div>
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[14px] mb-[4px]">Volume</p>
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px]">{d.wikiVolume}</p>
                </div>
                <div>
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[14px] mb-[4px]">Data Quality</p>
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px]">{d.wikiQuality}</p>
                </div>
                <div>
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[14px] mb-[4px]">Description</p>
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px]">{d.wikiDescription}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Right sidebar ───────────────────────────────────────────── */

interface AgentStep {
  id: string;
  label: string;
  status: "done" | "running" | "pending";
  detail?: string;
}

function getPlanSteps(bronzeComplete: boolean): AgentStep[] {
  return [
    { id: "s1", label: "Analyze source tables", status: "done", detail: "4 source tables scanned" },
    { id: "s2", label: "Design Bronze schema", status: "done", detail: "4 raw views mapped" },
    { id: "s3", label: "Create Bronze views (DDL)", status: bronzeComplete ? "done" : "running", detail: bronzeComplete ? "4 views created" : "Awaiting approval..." },
    { id: "s4", label: "Design Silver transforms", status: bronzeComplete ? "running" : "pending" },
    { id: "s5", label: "Create Gold: customer_360", status: "pending" },
    { id: "s6", label: "Validate & profile results", status: "pending" },
  ];
}

const MOCK_CONTEXT_ITEMS = [
  { id: "c1", path: "crm.raw_customers", detail: "2.4M rows", type: "table" as const },
  { id: "c2", path: "crm.raw_orders", detail: "18.7M rows", type: "table" as const },
  { id: "c3", path: "crm.raw_interactions", detail: "45.2M rows", type: "table" as const },
  { id: "c4", path: "marketing.campaigns", detail: "124K rows", type: "table" as const },
];

function RightSectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="h-[32px] shrink-0 flex items-center gap-[6px] px-[12px]">
      <p
        className="flex-1 text-secondary-foreground tracking-[0.5px] uppercase"
        style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}
      >
        {label}
      </p>
      {count !== undefined && (
        <div className="bg-muted h-[16px] flex items-center justify-center px-[5px] rounded-[3px]">
          <p className="text-muted-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-normal)", lineHeight: "1" }}>
            {count}
          </p>
        </div>
      )}
    </div>
  );
}

function PlanSection({ bronzeComplete }: { bronzeComplete: boolean }) {
  const steps = getPlanSteps(bronzeComplete);
  return (
    <div className="shrink-0 border-b border-border/40">
      <RightSectionHeader label="Plan" count={steps.length} />
      <div className="flex flex-col pb-[6px]">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-[8px] px-[12px] py-[4px]">
            {/* Status icon */}
            <div className="shrink-0 mt-[3px]">
              {step.status === "done" && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="6" fill="rgba(90,189,74,0.12)" stroke="rgba(90,189,74,0.6)" strokeWidth="0.75" />
                  <path d="M4 6.5L5.8 8.3L9 5" stroke="var(--chart-5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {step.status === "running" && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                  <circle cx="6.5" cy="6.5" r="5.5" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="16 18" strokeLinecap="round" />
                </svg>
              )}
              {step.status === "pending" && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="6" stroke="var(--border)" strokeWidth="0.75" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={step.status === "pending" ? "text-muted-foreground" : "text-foreground"}
                style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}
              >
                {step.label}
              </p>
              {step.detail && (
                <p
                  className="text-muted-foreground"
                  style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}
                >
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutputsSection({
  blocks,
  activeBlockId,
  onSelect,
}: {
  blocks: OutputBlock[];
  activeBlockId: string | null;
  onSelect: (block: OutputBlock) => void;
}) {
  const sorted = [...blocks].reverse();
  return (
    <div className="flex-1 min-h-0 flex flex-col border-b border-border/40">
      <RightSectionHeader label="Outputs" count={blocks.length} />
      <div className="flex-1 overflow-y-auto pb-[4px]">
        {sorted.length === 0 ? (
          <p className="px-[12px] py-[6px] text-muted-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>
            No outputs yet
          </p>
        ) : sorted.map((block) => {
          const isActive = block.id === activeBlockId;
          return (
            <button
              key={block.id}
              type="button"
              className={`w-full flex items-center gap-[8px] px-[12px] py-[6px] cursor-pointer select-none transition-colors text-left ${isActive ? "bg-primary/10" : "hover:bg-background-hover"}`}
              onClick={() => onSelect(block)}
            >
              <BlockTypeBadge type={block.type} />
              <p
                className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
                  lineHeight: "1.5",
                  color: isActive ? "var(--foreground)" : "var(--secondary-foreground)",
                }}
              >
                {block.title}
              </p>
              {isActive && (
                <div className="shrink-0 size-[6px] rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContextSection() {
  return (
    <div className="shrink-0">
      <RightSectionHeader label="Context" count={MOCK_CONTEXT_ITEMS.length} />
      <div className="flex flex-col pb-[8px]">
        {MOCK_CONTEXT_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center gap-[8px] px-[12px] py-[5px] hover:bg-background-hover transition-colors cursor-default">
            {item.type === "view" ? <IconEntityView size={16} /> : <IconEntityTable size={16} />}
            <div className="flex-1 min-w-0">
              <p
                className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap"
                style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}
              >
                {item.path}
              </p>
              <p
                className="text-muted-foreground"
                style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}
              >
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main WorkspacePanel ─────────────────────────────────────── */

export function WorkspacePanel({ activeBlock, blockHistory, onClose, onSelectBlock, onSaveAsView, chatActions, onToggleCatalog, catalogOpen, bronzeComplete = false }: WorkspacePanelProps) {
  return (
    <div className="flex flex-col h-full relative bg-card">
      {/* Left border divider */}
      <div aria-hidden="true" className="absolute border-border/50 border-l border-solid inset-0 pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 w-full relative h-[52px] z-[1]">
        <div aria-hidden="true" className="absolute border-muted border-b border-solid left-0 right-0 bottom-0 pointer-events-none" style={{ height: "1px" }} />
        <div className="flex items-center gap-[8px] px-[16px] h-full w-full">
          <div className="overflow-hidden relative shrink-0 size-[20px]">
            <div className="absolute inset-[12.5%_8.34%_8.33%_8.33%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6657 15.8337">
                <path d={svgPaths.p2a2c9b00} fill="var(--secondary-foreground)" />
              </svg>
            </div>
          </div>
          <p
            className="flex-1 text-foreground whitespace-nowrap"
            style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}
          >
            Workspace
          </p>
          <div className="flex gap-[8px] items-center">
            {/* Catalog toggle */}
            <button
              type="button"
              title={catalogOpen ? "Close catalog" : "Open catalog"}
              className={`relative rounded-[var(--radius-button)] shrink-0 size-[28px] cursor-pointer hover:bg-muted transition-colors flex items-center justify-center ${catalogOpen ? "bg-muted" : ""}`}
              onClick={onToggleCatalog}
            >
              <div aria-hidden="true" className="absolute border border-border/50 border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
              <div className="relative shrink-0 size-[16px]">
                <div className="absolute inset-[8.33%_14.58%_8.33%_16.67%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.75 16.6666">
                    <path d={svgPaths.p3725f00} fill="var(--secondary-foreground)" />
                  </svg>
                </div>
              </div>
            </button>
            {/* Close */}
            <button type="button" className="relative shrink-0 size-[24px] cursor-pointer hover:opacity-70 transition-opacity" onClick={onClose}>
              <div className="absolute inset-1/4">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                  <path d={svgPaths.p35c6a000} fill="var(--secondary-foreground)" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content — left/right split */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left: active block view ── */}
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {activeBlock ? (
            activeBlock.type === "sql" ? (
              <SqlWorkspaceView block={activeBlock} onSaveAsView={onSaveAsView} onRunQuery={chatActions?.runQuery} onExplainQuery={chatActions?.explainQuery} />
            ) : activeBlock.type === "table" ? (
              <TableWorkspaceView block={activeBlock} onSaveAsView={onSaveAsView} />
            ) : activeBlock.type === "chart" ? (
              <ChartWorkspaceView block={activeBlock} onSaveAsView={onSaveAsView} />
            ) : activeBlock.type === "explanation" ? (
              <ExplanationWorkspaceView block={activeBlock} onWikiSave={chatActions?.wikiSave} onWikiDismiss={chatActions?.wikiDismiss} />
            ) : activeBlock.type === "dataset" ? (
              <DatasetWorkspaceView block={activeBlock} />
            ) : activeBlock.type === "view" ? (
              <ViewWorkspaceView block={activeBlock} />
            ) : (
              <div className="flex-1 overflow-auto p-[16px]">
                <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[14px]">{activeBlock.preview}</p>
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-muted-foreground text-[14px]">Click a block to view it here</p>
            </div>
          )}
        </div>

        {/* ── Right: plan / outputs / context ── */}
        <div className="w-[220px] shrink-0 flex flex-col overflow-hidden border-l border-border/40 bg-background/60">
          <PlanSection bronzeComplete={bronzeComplete} />
          <OutputsSection
            blocks={blockHistory}
            activeBlockId={activeBlock?.id || null}
            onSelect={onSelectBlock}
          />
          <ContextSection />
        </div>

      </div>
    </div>
  );
}