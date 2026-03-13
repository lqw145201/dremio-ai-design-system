import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import svgPaths from "../../imports/svg-javaskxvh1";
import type { BlockType, CatalogActions } from "../hooks/useChat";
import { IconEntityTable } from "./icons/IconEntityTable";
import { IconEntityView } from "./icons/IconEntityView";

interface CatalogPanelProps {
  onCollapse: () => void;
  saveViewMode?: { blockTitle: string; blockType: BlockType } | null;
  onSaveView?: (viewName: string, locationPath: string) => void;
  onCancelSave?: () => void;
  catalogActions?: CatalogActions | null;
}

interface TreeNode {
  id: string;
  label: string;
  type: "source" | "folder" | "table" | "view";
  children?: TreeNode[];
}

const namespaceData: TreeNode[] = [
  {
    id: "dremio-samples",
    label: "Dremio_samples",
    type: "source",
    children: [
      {
        id: "nyc-taxi",
        label: "NYC-taxi-trips",
        type: "folder",
        children: [
          { id: "nyc-trips", label: "trips", type: "table" },
          { id: "nyc-zones", label: "zones", type: "table" },
          { id: "nyc-fares", label: "fares", type: "table" },
        ],
      },
      {
        id: "sf-weather",
        label: "SF-weather",
        type: "folder",
        children: [
          { id: "sf-daily", label: "daily_observations", type: "table" },
          { id: "sf-stations", label: "weather_stations", type: "table" },
        ],
      },
      {
        id: "production",
        label: "Production",
        type: "source",
        children: [
          {
            id: "citibike",
            label: "citibike",
            type: "folder",
            children: [
              { id: "cb-trips", label: "trips", type: "table" },
              { id: "cb-stations", label: "stations", type: "table" },
              { id: "cb-members", label: "members", type: "table" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "analytics-space",
    label: "Analytics",
    type: "source",
    children: [
      {
        id: "reports",
        label: "Reports",
        type: "folder",
        children: [
          { id: "rpt-monthly", label: "monthly_summary", type: "view" },
          { id: "rpt-kpis", label: "kpi_dashboard", type: "view" },
        ],
      },
    ],
  },
];

const connectionData: TreeNode[] = [
  { id: "glue", label: "Glue", type: "source" },
  { id: "unity", label: "Unity", type: "source" },
  { id: "aws", label: "AWS", type: "source" },
  { id: "samples", label: "Samples", type: "source" },
];

/* ── helpers ─────────────────────────────────────────────── */

function findNodePath(nodes: TreeNode[], targetId: string, path: string[] = []): string[] | null {
  for (const node of nodes) {
    const current = [...path, node.label];
    if (node.id === targetId) return current;
    if (node.children) {
      const found = findNodePath(node.children, targetId, current);
      if (found) return found;
    }
  }
  return null;
}

function buildFullPath(nodeId: string): string {
  const allData = [...namespaceData, ...connectionData];
  const parts = findNodePath(allData, nodeId);
  return parts ? parts.join(".") : nodeId;
}

/* ── Mock sample data per table ──────────────────────────── */

const sampleDataMap: Record<string, { columns: string[]; rows: string[][] }> = {
  "nyc-trips": {
    columns: ["pickup_datetime", "dropoff_datetime", "passenger_count", "trip_distance"],
    rows: [
      ["2026-01-15 08:12:00", "2026-01-15 08:34:00", "2", "4.3"],
      ["2026-01-15 09:05:00", "2026-01-15 09:22:00", "1", "2.1"],
      ["2026-01-15 10:30:00", "2026-01-15 10:58:00", "3", "7.8"],
    ],
  },
  "nyc-zones": {
    columns: ["zone_id", "zone_name", "borough", "service_zone"],
    rows: [
      ["1", "Newark Airport", "EWR", "EWR"],
      ["2", "Jamaica Bay", "Queens", "Boro Zone"],
      ["3", "Allerton/Pelham", "Bronx", "Boro Zone"],
    ],
  },
  "nyc-fares": {
    columns: ["trip_id", "fare_amount", "tip_amount", "total_amount"],
    rows: [
      ["a3f2c1", "$12.50", "$2.50", "$18.30"],
      ["b7e4d2", "$8.00", "$1.50", "$12.80"],
      ["c1d8f3", "$22.00", "$5.00", "$31.50"],
    ],
  },
  "sf-daily": {
    columns: ["date", "temp_high", "temp_low", "precipitation"],
    rows: [
      ["2026-02-01", "62°F", "48°F", "0.00 in"],
      ["2026-02-02", "58°F", "45°F", "0.12 in"],
      ["2026-02-03", "65°F", "50°F", "0.00 in"],
    ],
  },
  "sf-stations": {
    columns: ["station_id", "station_name", "latitude", "longitude"],
    rows: [
      ["USW001", "SF Downtown", "37.7749", "-122.4194"],
      ["USW002", "SF Airport", "37.6213", "-122.3790"],
    ],
  },
  "cb-trips": {
    columns: ["trip_id", "started_at", "ended_at", "member_casual"],
    rows: [
      ["T001", "2026-02-10 07:30", "2026-02-10 07:52", "member"],
      ["T002", "2026-02-10 08:15", "2026-02-10 08:40", "casual"],
      ["T003", "2026-02-10 09:00", "2026-02-10 09:18", "member"],
    ],
  },
  "cb-stations": {
    columns: ["station_id", "station_name", "capacity", "status"],
    rows: [
      ["S001", "Grand Central", "45", "active"],
      ["S002", "Union Square", "38", "active"],
      ["S003", "Times Square", "52", "maintenance"],
    ],
  },
  "cb-members": {
    columns: ["member_id", "plan_type", "signup_date", "status"],
    rows: [
      ["M001", "annual", "2025-06-01", "active"],
      ["M002", "monthly", "2025-11-15", "active"],
      ["M003", "annual", "2024-03-20", "expired"],
    ],
  },
  "rpt-monthly": {
    columns: ["month", "total_trips", "revenue", "new_members"],
    rows: [
      ["2026-01", "284,510", "$1.2M", "3,420"],
      ["2026-02", "312,890", "$1.4M", "4,105"],
    ],
  },
  "rpt-kpis": {
    columns: ["kpi_name", "current_value", "target", "status"],
    rows: [
      ["Avg Trip Duration", "14.2 min", "15 min", "on-track"],
      ["Member Retention", "87%", "85%", "exceeded"],
      ["Station Utilization", "72%", "80%", "at-risk"],
    ],
  },
};

/* ── Mock wiki data ──────────────────────────────────────── */

const wikiSnippets: Record<string, string> = {
  "source": "Data source namespace containing curated datasets managed by the platform team.",
  "folder": "Logical grouping of related datasets. Contains tables with consistent schemas.",
  "table": "Queryable dataset. Use AI Agent to explore columns, run queries, or build visualizations.",
};

/* ── Icons ──────────────────────────────────────────────── */

function SourceIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute inset-[12.5%_12.5%_26.39%_26.39%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.2222 12.2222">
          <path clipRule="evenodd" d={svgPaths.p23a8bc00} fill="var(--secondary-foreground)" fillRule="evenodd" />
        </svg>
      </div>
      <div className="absolute inset-[31.94%_31.94%_12.5%_12.5%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.1111 11.1111">
          <path d={svgPaths.p818ce00} fill="var(--secondary-foreground)" />
        </svg>
      </div>
    </div>
  );
}

function FolderIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute inset-[16.67%_8.33%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6666 13.3334">
          <path clipRule="evenodd" d={svgPaths.p3b20af40} fill="var(--secondary-foreground)" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

function TableIcon() {
  return (
    <div className="relative shrink-0 size-[20px] flex items-center justify-center">
      <IconEntityTable size={20} />
    </div>
  );
}

function ViewIcon() {
  return (
    <div className="relative shrink-0 size-[20px] flex items-center justify-center">
      <IconEntityView size={20} />
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[16px] flex items-center justify-center">
      <svg width="10" height="6" viewBox="0 0 10.4397 5.96941" fill="none" style={{ transform: "rotate(180deg)" }}>
        <path d={svgPaths.p348f4800} fill="var(--secondary-foreground)" />
      </svg>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[16px] flex items-center justify-center">
      <svg width="10" height="6" viewBox="0 0 10.4397 5.96941" fill="none" style={{ transform: "rotate(90deg)" }}>
        <path d={svgPaths.p348f4800} fill="var(--secondary-foreground)" />
      </svg>
    </div>
  );
}

function NodeIcon({ type }: { type: "source" | "folder" | "table" | "view" }) {
  if (type === "table") return <TableIcon />;
  if (type === "view") return <ViewIcon />;
  if (type === "source") return <SourceIcon />;
  return <FolderIcon />;
}

/* ── Toast notification ─────────────────────────────────── */

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [onClose]);

  return createPortal(
    <div className="fixed bottom-[16px] left-1/2 -translate-x-1/2 z-[10000] bg-foreground rounded-[var(--radius-card)] px-[16px] py-[8px] shadow-sm">
      <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-card text-[12px] whitespace-nowrap">{message}</p>
    </div>,
    document.body,
  );
}

/* ── Inline sample data preview ─────────────────────────── */

function SampleDataPreview({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
  const data = sampleDataMap[nodeId];
  if (!data) return null;

  return (
    <div className="w-full bg-card border border-border rounded-[var(--radius-button)] overflow-hidden my-[4px] mx-[8px]" style={{ maxWidth: "calc(100% - 16px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-[8px] py-[4px] bg-background border-b border-muted">
        <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-secondary-foreground text-[9px] uppercase tracking-[0.3px]">
          Sample Data · {data.rows.length} rows
        </p>
        <button type="button" className="shrink-0 size-[16px] flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity" onClick={onClose}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1L7 7M7 1L1 7" stroke="var(--secondary-foreground)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-muted">
              {data.columns.map((col) => (
                <th key={col} className="text-left px-[6px] py-[4px] font-['Inter',sans-serif] font-semibold text-foreground text-[9px] leading-[150%] whitespace-nowrap border-r border-muted last:border-r-0">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className="border-b border-muted last:border-b-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-[6px] py-[3px] font-['Inter',sans-serif] font-normal text-foreground text-[9px] leading-[150%] whitespace-nowrap border-r border-muted last:border-r-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Inline wiki preview ────────────────────────────────── */

function WikiPreview({ nodeType, nodeLabel, onClose }: { nodeType: "source" | "folder" | "table" | "view"; nodeLabel: string; onClose: () => void }) {
  return (
    <div className="w-full bg-card border border-border rounded-[var(--radius-button)] overflow-hidden my-[4px] mx-[8px]" style={{ maxWidth: "calc(100% - 16px)" }}>
      <div className="flex items-center justify-between px-[8px] py-[4px] bg-background border-b border-muted">
        <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-secondary-foreground text-[9px] uppercase tracking-[0.3px]">
          Wiki · {nodeLabel}
        </p>
        <button type="button" className="shrink-0 size-[16px] flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity" onClick={onClose}>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1L7 7M7 1L1 7" stroke="var(--secondary-foreground)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="px-[8px] py-[6px]">
        <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[9px]">
          {wikiSnippets[nodeType]} This wiki was auto-generated by the AI Agent based on schema analysis and usage patterns for <span className="font-semibold">{nodeLabel}</span>.
        </p>
      </div>
    </div>
  );
}

/* ── Context menu (the "..." actions) ───────────────────── */

function ItemContextMenu({
  nodeId,
  nodeType,
  nodeLabel,
  triggerRef,
  onClose,
  onAction,
}: {
  nodeId: string;
  nodeType: "source" | "folder" | "table" | "view";
  nodeLabel: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  onAction: (action: string, nodeId: string, nodeLabel: string, nodeType: "source" | "folder" | "table" | "view") => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 2, left: rect.right });
    }
  }, [triggerRef]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, triggerRef]);

  const isDataset = nodeType === "table" || nodeType === "view";

  const items: { label: string; action: string }[] = [
    { label: "Add to chatbot", action: "add-to-chat" },
    ...(isDataset ? [{ label: "Dataset Profile", action: "dataset-profile" }] : []),
    ...(isDataset ? [{ label: "Show sample data", action: "sample-data" }] : []),
    ...(isDataset ? [{ label: "View lineage", action: "view-lineage" }] : []),
    { label: "Generate wiki", action: "generate-wiki" },
    { label: "Copy path", action: "copy-path" },
    ...(isDataset ? [{ label: "Query this table", action: "query-table" }] : []),
  ];

  if (!pos) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 bg-popover overflow-clip py-[4px] rounded-[var(--radius-button)] shadow-dropdown min-w-[8rem]"
      style={{ top: pos.top, left: pos.left, transform: "translateX(-100%)" }}
    >
      {items.map((item) => (
        <button
          key={item.action}
          type="button"
          className="h-[32px] w-full text-left flex items-center cursor-pointer select-none hover:bg-background-hover transition-colors"
          onClick={() => { onClose(); onAction(item.action, nodeId, nodeLabel, nodeType); }}
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
              {item.label}
            </span>
          </div>
        </button>
      ))}
    </div>,
    document.body,
  );
}

/* ── Three-dot trigger button ───────────────────────────── */

function MoreDots({ onClick, btnRef }: { onClick: () => void; btnRef: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <button
      ref={btnRef}
      type="button"
      className="shrink-0 size-[20px] flex items-center justify-center rounded-[var(--radius-button)] hover:bg-border/50 transition-colors cursor-pointer"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <svg width="10" height="3" viewBox="0 0 10.3333 2.33333" fill="none">
        <path d={svgPaths.p12e12a80} fill="var(--secondary-foreground)" />
        <path d={svgPaths.p39c2dc00} fill="var(--secondary-foreground)" />
        <path d={svgPaths.p1a349680} fill="var(--secondary-foreground)" />
      </svg>
    </button>
  );
}

/* ── Tree item (normal mode) ────────────────────────────── */

function TreeItem({
  node,
  depth = 0,
  openMenuId,
  setOpenMenuId,
  onAction,
}: {
  node: TreeNode;
  depth?: number;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onAction: (action: string, nodeId: string, nodeLabel: string, nodeType: "source" | "folder" | "table" | "view") => void;
}) {
  const [expanded, setExpanded] = useState(node.id === "dremio-samples" || node.id === "production");
  const [hovered, setHovered] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isActive = node.id === "dremio-samples";
  const moreRef = useRef<HTMLButtonElement>(null);
  const menuOpen = openMenuId === node.id;

  return (
    <div className="w-full">
      <div
        className={`h-[32px] shrink-0 w-full cursor-pointer transition-colors ${isActive ? "bg-[#e9f5f9]" : "hover:bg-muted/50"}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <div className="flex gap-[4px] items-center pr-[8px] size-full">
          {hasChildren ? (expanded ? <ChevronDown /> : <ChevronRight />) : <div className="w-[16px] shrink-0" />}
          <NodeIcon type={node.type} />
          <p className="flex-1 font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[12px] overflow-hidden text-ellipsis whitespace-nowrap">
            {node.label}
          </p>
          {(hovered || menuOpen) && (
            <MoreDots btnRef={moreRef} onClick={() => setOpenMenuId(menuOpen ? null : node.id)} />
          )}
        </div>
      </div>
      {menuOpen && (
        <ItemContextMenu
          nodeId={node.id}
          nodeType={node.type}
          nodeLabel={node.label}
          triggerRef={moreRef}
          onClose={() => setOpenMenuId(null)}
          onAction={onAction}
        />
      )}
      {expanded && hasChildren && (
        <div className="w-full">
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} onAction={onAction} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Tree item (save / pick-location mode) ──────────────── */

function PickableTreeItem({
  node,
  depth = 0,
  selectedId,
  onSelect,
}: {
  node: TreeNode;
  depth?: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(node.id === "dremio-samples" || node.id === "production");
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;
  const isFolder = node.type === "source" || node.type === "folder";

  return (
    <div className="w-full">
      <div
        className={`h-[32px] shrink-0 w-full cursor-pointer transition-colors ${
          isSelected ? "bg-primary/10" : "hover:bg-muted/50"
        }`}
        onClick={() => {
          if (isFolder) onSelect(node.id);
          if (hasChildren) setExpanded(!expanded);
        }}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <div className="flex gap-[4px] items-center pr-[12px] size-full">
          {hasChildren ? (expanded ? <ChevronDown /> : <ChevronRight />) : <div className="w-[16px] shrink-0" />}
          <NodeIcon type={node.type} />
          <p className={`flex-1 font-['Inter',sans-serif] leading-[150%] text-[12px] overflow-hidden text-ellipsis whitespace-nowrap ${
            isSelected ? "font-semibold text-accent" : "font-normal text-foreground"
          }`}>
            {node.label}
          </p>
          {isSelected && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="w-full">
          {node.children!.map((child) => (
            <PickableTreeItem key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Connection item (normal mode) ──────────────────────── */

function ConnectionItem({
  node,
  openMenuId,
  setOpenMenuId,
  onAction,
}: {
  node: TreeNode;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  onAction: (action: string, nodeId: string, nodeLabel: string, nodeType: "source" | "folder" | "table" | "view") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const moreRef = useRef<HTMLButtonElement>(null);
  const menuOpen = openMenuId === node.id;

  return (
    <div className="w-full">
      <div
        className="h-[32px] shrink-0 w-full cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex gap-[4px] items-center pl-[8px] pr-[8px] size-full">
          {expanded ? <ChevronDown /> : <ChevronRight />}
          <SourceIcon />
          <p className="flex-1 font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[12px] overflow-hidden text-ellipsis whitespace-nowrap">
            {node.label}
          </p>
          {(hovered || menuOpen) && (
            <MoreDots btnRef={moreRef} onClick={() => setOpenMenuId(menuOpen ? null : node.id)} />
          )}
        </div>
      </div>
      {menuOpen && (
        <ItemContextMenu
          nodeId={node.id}
          nodeType={node.type}
          nodeLabel={node.label}
          triggerRef={moreRef}
          onClose={() => setOpenMenuId(null)}
          onAction={onAction}
        />
      )}
    </div>
  );
}

/* ── Pickable connection item (save mode) ───────────────── */

function PickableConnectionItem({
  node,
  selectedId,
  onSelect,
}: {
  node: TreeNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const isSelected = selectedId === node.id;
  return (
    <div className="w-full">
      <div
        className={`h-[32px] shrink-0 w-full cursor-pointer transition-colors ${
          isSelected ? "bg-primary/10" : "hover:bg-muted/50"
        }`}
        onClick={() => onSelect(node.id)}
      >
        <div className="flex gap-[4px] items-center pl-[8px] pr-[12px] size-full">
          <ChevronRight />
          <SourceIcon />
          <p className={`flex-1 font-['Inter',sans-serif] leading-[150%] text-[12px] overflow-hidden text-ellipsis whitespace-nowrap ${
            isSelected ? "font-semibold text-accent" : "font-normal text-foreground"
          }`}>
            {node.label}
          </p>
          {isSelected && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Block type badge (for save banner) ─────────────────── */

function SaveBlockBadge({ type }: { type: BlockType }) {
  const labels: Record<BlockType, string> = { sql: "SQL", table: "TABLE", chart: "VIS", explanation: "TEXT", dataset: "DATASET" };
  const colors: Record<BlockType, string> = {
    sql: "text-secondary-foreground",
    table: "text-secondary-foreground",
    chart: "text-secondary-foreground",
    explanation: "text-secondary-foreground",
    dataset: "text-accent",
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

/* ── Main component ─────────────────────────────────────── */

export function CatalogPanel({ onCollapse, saveViewMode, onSaveView, onCancelSave, catalogActions }: CatalogPanelProps) {
  const isSaveMode = !!saveViewMode;
  const [viewName, setViewName] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Shared menu state — only one "..." menu open at a time
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Inline preview state
  const [samplePreviewId, setSamplePreviewId] = useState<string | null>(null);
  const [wikiPreview, setWikiPreview] = useState<{ nodeType: "source" | "folder" | "table" | "view"; nodeLabel: string } | null>(null);

  /* Reset state when entering/exiting save mode */
  useEffect(() => {
    if (saveViewMode) {
      setViewName(saveViewMode.blockTitle);
      setSelectedLocationId(null);
      setSaveSuccess(false);
      setTimeout(() => inputRef.current?.select(), 80);
    }
  }, [saveViewMode]);

  const selectedPath = selectedLocationId
    ? findNodePath([...namespaceData, ...connectionData.map((c) => ({ ...c, children: undefined }))], selectedLocationId)?.join(" / ") ?? selectedLocationId
    : null;

  const handleSave = () => {
    if (!viewName.trim() || !selectedLocationId || !onSaveView) return;
    setSaveSuccess(true);
    onSaveView(viewName.trim(), selectedPath ?? selectedLocationId);
    setTimeout(() => {
      setSaveSuccess(false);
      onCancelSave?.();
    }, 1600);
  };

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  const handleAction = useCallback((action: string, nodeId: string, nodeLabel: string, nodeType: "source" | "folder" | "table" | "view") => {
    const fullPath = buildFullPath(nodeId);
    switch (action) {
      case "add-to-chat":
        if (catalogActions) {
          catalogActions.addContextChip(fullPath, "context");
          showToast(`Added "${nodeLabel}" to chat input`);
        } else {
          showToast(`Added "${nodeLabel}" context to AI Agent`);
        }
        break;
      case "query-table":
        if (catalogActions) {
          catalogActions.addContextChip(fullPath, "query");
          showToast(`Added "${nodeLabel}" to chat — ask your question`);
        } else {
          showToast(`Opening query editor for "${nodeLabel}"...`);
        }
        break;
      case "sample-data":
        if (catalogActions) {
          catalogActions.showSampleData(nodeId, nodeLabel);
          showToast(`Loading sample data for "${nodeLabel}"...`);
        } else {
          setSamplePreviewId((prev) => (prev === nodeId ? null : nodeId));
          setWikiPreview(null);
        }
        break;
      case "view-lineage":
        if (catalogActions) {
          catalogActions.previewSchema(nodeId, nodeLabel);
          showToast(`Loading lineage for "${nodeLabel}"...`);
        } else {
          showToast(`Lineage not available without chat connection`);
        }
        break;
      case "generate-wiki":
        if (catalogActions) {
          catalogActions.generateWiki(nodeLabel, nodeType);
          showToast(`Generating wiki for "${nodeLabel}"...`);
        } else {
          setSamplePreviewId(null);
          setWikiPreview({ nodeType, nodeLabel });
          showToast(`Wiki generated for "${nodeLabel}"`);
        }
        break;
      case "dataset-profile":
        if (catalogActions) {
          catalogActions.viewDatasetProfile(nodeId, nodeLabel);
          showToast(`Loading profile for "${nodeLabel}"...`);
        } else {
          showToast(`Dataset profile not available without chat connection`);
        }
        break;
      case "copy-path": {
        navigator.clipboard?.writeText(fullPath).catch(() => {});
        showToast(`Copied: ${fullPath}`);
        break;
      }
      default:
        break;
    }
  }, [showToast, catalogActions]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="h-[52px] shrink-0 w-full relative">
        <div aria-hidden="true" className="absolute border-muted border-b border-solid left-0 right-0 bottom-0 pointer-events-none" style={{ height: "1px" }} />
        <div className="flex gap-[8px] items-center pl-[12px] size-full">
          <div className="relative shrink-0 size-[20px]">
            <div className="absolute inset-[8.33%_14.58%_8.33%_16.67%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.75 16.6666">
                <path d={svgPaths.p3725f00} fill="var(--secondary-foreground)" />
              </svg>
            </div>
          </div>
          <p
            className="text-secondary-foreground whitespace-nowrap"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-weight-semibold)",
              lineHeight: "1.5",
            }}
          >
            {isSaveMode ? "Save as View" : "Catalog"}
          </p>
        </div>
      </div>

      {/* ── Save-mode banner ─────────────────────────────── */}
      {isSaveMode && (
        <div className="shrink-0 w-full border-b border-border">
          {saveSuccess ? (
            <div className="px-[12px] py-[16px] flex flex-col gap-[8px] items-center">
              <div className="size-[32px] rounded-full bg-chart-5/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="var(--chart-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[12px] text-center">
                View saved!
              </p>
              <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[9px] text-center">
                {viewName} → {selectedPath}
              </p>
            </div>
          ) : (
            <div className="px-[12px] py-[12px] flex flex-col gap-[12px]">
              <div className="flex items-center gap-[8px]">
                <SaveBlockBadge type={saveViewMode!.blockType} />
                <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[9px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  Saving output as a Dremio view
                </p>
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="font-['Inter',sans-serif] font-semibold leading-[150%] text-secondary-foreground text-[9px] uppercase tracking-[0.3px]">
                  View name
                </label>
                <div className="relative h-[32px]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={viewName}
                    onChange={(e) => setViewName(e.target.value)}
                    placeholder="my_view"
                    className="w-full h-full bg-input-background border border-border rounded-[var(--radius-button)] px-[8px] font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[12px] outline-none focus:border-ring transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="font-['Inter',sans-serif] font-semibold leading-[150%] text-secondary-foreground text-[9px] uppercase tracking-[0.3px]">
                  Location
                </label>
                <div className={`h-[32px] flex items-center px-[8px] rounded-[var(--radius-button)] border transition-colors ${
                  selectedLocationId ? "border-accent bg-primary/5" : "border-border border-dashed bg-muted/30"
                }`}>
                  {selectedLocationId ? (
                    <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-foreground text-[12px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {selectedPath}
                    </p>
                  ) : (
                    <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-muted-foreground text-[12px]">
                      Select a folder below
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <button
                  type="button"
                  disabled={!viewName.trim() || !selectedLocationId}
                  className={`flex-1 h-[32px] flex items-center justify-center rounded-[var(--radius-button)] transition-colors cursor-pointer ${
                    viewName.trim() && selectedLocationId
                      ? "bg-accent text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  onClick={handleSave}
                >
                  <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-[12px]">
                    Save View
                  </p>
                </button>
                <button
                  type="button"
                  className="h-[32px] px-[12px] flex items-center justify-center rounded-[var(--radius-button)] border border-border hover:bg-muted transition-colors cursor-pointer"
                  onClick={onCancelSave}
                >
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px]">
                    Cancel
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Prompt label when in save mode ───────────────── */}
      {isSaveMode && !saveSuccess && (
        <div className="shrink-0 px-[12px] py-[8px] bg-primary/5">
          <p className="font-['Inter',sans-serif] font-semibold leading-[150%] text-accent text-[9px] uppercase tracking-[0.3px]">
            Choose save location
          </p>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Namespaces section */}
        <div className="w-full">
          <div className="flex gap-[6px] items-center px-[12px] py-[8px] w-full">
            <p className="flex-1 font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px]">
              <span>Namespaces </span>
              <span>(2)</span>
            </p>
            {!isSaveMode && (
              <>
                <div className="flex gap-[3px] items-center shrink-0">
                  <div className="relative shrink-0 size-[12px]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                      <path d={svgPaths.p359a0100} fill="var(--accent)" />
                    </svg>
                  </div>
                  <p className="font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[9px]">
                    Powered by Polaris
                  </p>
                </div>
                <div className="flex items-center justify-center shrink-0 size-[22px] cursor-pointer hover:bg-muted rounded-[var(--radius-button)] transition-colors">
                  <div className="relative shrink-0 size-[20px]">
                    <div className="absolute inset-[16.67%]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
                        <path d={svgPaths.p1d28cf00} fill="var(--secondary-foreground)" />
                        <path clipRule="evenodd" d={svgPaths.pb2a7c00} fill="var(--secondary-foreground)" fillRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Tree */}
          <div className="flex flex-col items-start w-full">
            {isSaveMode
              ? namespaceData.map((node) => (
                  <PickableTreeItem key={node.id} node={node} selectedId={selectedLocationId} onSelect={setSelectedLocationId} />
                ))
              : namespaceData.map((node) => (
                  <TreeItem key={node.id} node={node} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} onAction={handleAction} />
                ))
            }
          </div>
        </div>

        {/* Inline previews (shown below namespace tree when active) */}
        {!isSaveMode && samplePreviewId && (
          <SampleDataPreview nodeId={samplePreviewId} onClose={() => setSamplePreviewId(null)} />
        )}
        {!isSaveMode && wikiPreview && (
          <WikiPreview nodeType={wikiPreview.nodeType} nodeLabel={wikiPreview.nodeLabel} onClose={() => setWikiPreview(null)} />
        )}

        {/* Connections section */}
        <div className="w-full mt-[8px]">
          <div className="flex gap-[6px] items-center px-[12px] py-[8px] w-full">
            <p className="flex-1 font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[12px]">
              <span>Connections </span>
              <span>(4)</span>
            </p>
            {!isSaveMode && (
              <div className="flex items-center justify-center shrink-0 size-[22px] cursor-pointer hover:bg-muted rounded-[var(--radius-button)] transition-colors">
                <div className="relative shrink-0 size-[20px]">
                  <div className="absolute inset-[16.67%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
                      <path d={svgPaths.p1d28cf00} fill="var(--secondary-foreground)" />
                      <path clipRule="evenodd" d={svgPaths.pb2a7c00} fill="var(--secondary-foreground)" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start w-full">
            {isSaveMode
              ? connectionData.map((node) => (
                  <PickableConnectionItem key={node.id} node={node} selectedId={selectedLocationId} onSelect={setSelectedLocationId} />
                ))
              : connectionData.map((node) => (
                  <ConnectionItem key={node.id} node={node} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} onAction={handleAction} />
                ))
            }
          </div>
        </div>
      </div>


      {/* Toast */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}