// COMPONENT — Chat panel with message list, output blocks, and input
// Delegates all state to useChat hook; renders block views inline

import { useCallback } from "react";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import svgPaths from "../../imports/svg-javaskxvh1";
import approvalSvgPaths from "../../imports/svg-comj3w05wm";

// STATE — Hook + types
import { useChat } from "../hooks/useChat";
import type { OutputBlock, BlockType, ApprovalData, WikiReviewData, CatalogActions } from "../hooks/useChat";

// ICONS
import { IconEntityView } from "./icons/IconEntityView";

// LAYOUT — Shared input component
import { ChatInput } from "./ChatInput";

// LAYOUT — Tool calls block
import { ToolCallsBlock } from "./ToolCallsBlock";

// COPY
import { CHAT_PANEL, BLOCK_TYPE_LABELS, ACTIONS, SQL_OVERFLOW_ITEMS } from "../constants/strings";

// Re-export types for backward compatibility
export type { OutputBlock, BlockType, CatalogActions };

// LAYOUT — Props

interface ChatPanelProps {
  onBlockClick: (block: OutputBlock) => void;
  onBlockHover: (blockId: string | null) => void;
  hoveredBlock: string | null;
  onSaveAsView?: (block: OutputBlock) => void;
  onRegisterActions?: (actions: {
    runQuery: () => void;
    explainQuery: () => void;
    catalogActions: CatalogActions;
    wikiSave: (id: string) => void;
    wikiDismiss: (id: string) => void;
  }) => void;
  chatTitle?: string | null;
  onBlocksCreated?: (blocks: OutputBlock[]) => void;
}

/* ── Shared components ───────────────────────────────────────── */

// LAYOUT — Block type badge
function BlockTypeBadge({ type }: { type: BlockType }) {
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
          fontFamily: "var(--font-sans, 'Inter', sans-serif)",
          fontSize: "9px",
          fontWeight: "var(--font-weight-semibold)",
          lineHeight: "1.5",
        }}
      >
        {BLOCK_TYPE_LABELS[type]}
      </p>
    </div>
  );
}

// LAYOUT — Time badge
function TimeBadge({ time }: { time: string }) {
  return (
    <div className="bg-chart-5/10 flex items-center justify-center px-[6px] py-px rounded-[var(--radius-button)] shrink-0">
      <p
        className="text-chart-5 whitespace-nowrap"
        style={{
          fontFamily: "var(--font-sans, 'Inter', sans-serif)",
          fontSize: "9px",
          fontWeight: "var(--font-weight-semibold)",
          lineHeight: "1.5",
        }}
      >
        {time}
      </p>
    </div>
  );
}

// INTERACTION — Play icon (Fluent-style filled triangle)
function PlayIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="shrink-0">
      <path d="M1.5 1.288a.5.5 0 0 1 .736-.44l7.5 4.212a.5.5 0 0 1 0 .88l-7.5 4.212A.5.5 0 0 1 1.5 9.712V1.288Z" fill="var(--secondary-foreground)" />
    </svg>
  );
}

// INTERACTION — Action button
function ActionButton({ label, onClick, icon }: { label: string; onClick?: () => void; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      className="bg-card h-[28px] relative rounded-[var(--radius-button)] shrink-0 cursor-pointer hover:bg-muted transition-colors"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
      <div className="flex h-full items-center justify-center px-[8px] gap-[4px]">
        {icon}
        <p
          className="text-secondary-foreground whitespace-nowrap"
          style={{
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-normal)",
            lineHeight: "1.5",
          }}
        >
          {label}
        </p>
      </div>
    </button>
  );
}

// INTERACTION — Three-dot overflow menu
function MoreMenuButton({ items, onItemClick }: { items: string[]; onItemClick?: (item: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node) && triggerRef.current && !triggerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.top - 4, left: rect.left });
    }
  }, [open]);

  return (
    <div className="relative shrink-0" ref={triggerRef}>
      <div
        className="bg-card size-[28px] relative rounded-[var(--radius-button)] shrink-0 cursor-pointer hover:bg-muted transition-colors flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
        <svg width="10" height="3" viewBox="0 0 10.3333 2.33333" fill="none">
          <path d={svgPaths.p12e12a80} fill="var(--secondary-foreground)" />
          <path d={svgPaths.p39c2dc00} fill="var(--secondary-foreground)" />
          <path d={svgPaths.p1a349680} fill="var(--secondary-foreground)" />
        </svg>
      </div>
      {open && menuPos && createPortal(
        <div ref={ref} className="fixed z-50 bg-popover overflow-clip py-[4px] rounded-[var(--radius-button)] shadow-dropdown min-w-[8rem]" style={{ top: menuPos.top, left: menuPos.left, transform: "translateY(-100%)" }}>
          {items.map((item) => (
            <div
              key={item}
              className="h-[32px] w-full flex items-center cursor-pointer select-none hover:bg-background-hover transition-colors"
              onClick={(e) => { e.stopPropagation(); setOpen(false); onItemClick?.(item); }}
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
            </div>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

/* ── Approval Block (DDL/DML) ────────────────────────────────── */

// LAYOUT — Approval badge
function ApprovalBadge() {
  return (
    <div className="bg-destructive/10 flex h-[20px] items-center justify-center px-[6px] py-px rounded-[var(--radius-button)] shrink-0 gap-[4px]">
      <div className="relative shrink-0 size-[12px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <path d={approvalSvgPaths.p3d0c7e00} fill="var(--destructive)" />
        </svg>
      </div>
      <p
        className="text-destructive tracking-[0.3px] uppercase whitespace-nowrap"
        style={{
          fontFamily: "var(--font-sans, 'Inter', sans-serif)",
          fontSize: "9px",
          fontWeight: "var(--font-weight-semibold)",
          lineHeight: "1.5",
        }}
      >
        ACTION REQUIRED
      </p>
    </div>
  );
}

// LAYOUT — Approval block view with execute/reject
function ApprovalBlockView({ approval, onExecute, onRequestChanges }: {
  approval: ApprovalData;
  onExecute: (id: string) => void;
  onRequestChanges: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [radioValue, setRadioValue] = useState<"once" | "always">("once");

  if (approval.status === "executed") {
    return (
      <div className="bg-card relative rounded-[var(--radius-card)] shrink-0 w-full">
        <div className="overflow-hidden rounded-[inherit] w-full">
          <div className="flex flex-col items-start p-px w-full">
            <div className="bg-background h-[40px] shrink-0 w-full relative">
              <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
              <div className="flex items-center px-[16px] py-[8px] size-full gap-[8px]">
                <div className="bg-chart-5/10 flex h-[20px] items-center justify-center px-[6px] py-px rounded-[var(--radius-button)] shrink-0 gap-[4px]">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="var(--chart-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <p className="text-chart-5 tracking-[0.3px] uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>EXECUTED</p>
                </div>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>DDL/DML Operation</p>
              </div>
            </div>
            <div className="shrink-0 w-full px-[16px] py-[12px]">
              <p className="text-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>Operation completed successfully. 42 rows were affected.</p>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-chart-5/30 border-solid inset-0 pointer-events-none rounded-[var(--radius-card)]" />
      </div>
    );
  }

  if (approval.status === "rejected") {
    return (
      <div className="bg-card relative rounded-[var(--radius-card)] shrink-0 w-full">
        <div className="overflow-hidden rounded-[inherit] w-full">
          <div className="flex flex-col items-start p-px w-full">
            <div className="bg-background h-[40px] shrink-0 w-full relative">
              <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
              <div className="flex items-center px-[16px] py-[8px] size-full gap-[8px]">
                <div className="bg-muted flex h-[20px] items-center justify-center px-[6px] py-px rounded-[var(--radius-button)] shrink-0">
                  <p className="text-secondary-foreground tracking-[0.3px] uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>CHANGES REQUESTED</p>
                </div>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>DDL/DML Operation</p>
              </div>
            </div>
            <div className="shrink-0 w-full px-[16px] py-[12px]">
              <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>You requested changes. Describe what you'd like modified.</p>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)]" />
      </div>
    );
  }

  return (
    <div className="bg-card relative rounded-[var(--radius-card)] shrink-0 w-full">
      <div className="overflow-hidden rounded-[inherit] w-full">
        <div className="flex flex-col items-start p-px w-full">
          {/* Header */}
          <div className="bg-background h-[40px] shrink-0 w-full relative">
            <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
            <div className="flex items-center px-[16px] py-[8px] size-full gap-[8px]">
              <ApprovalBadge />
              <p className="text-secondary-foreground flex-1" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>DDL/DML Operation</p>
            </div>
          </div>
          {/* Body */}
          <div className="shrink-0 w-full">
            <div className="flex flex-col gap-[12px] px-[16px] py-[12px]">
              <p className="text-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>I need to execute the following SQL statements:</p>
              <div className="relative rounded-[var(--radius-button)] w-full">
                <div className="flex flex-col overflow-hidden rounded-[inherit] w-full">
                  <div className="bg-background shrink-0 w-full">
                    <div className="flex items-center gap-[8px] pl-[12px] pr-[8px] py-[6px] w-full">
                      <p className="text-foreground flex-1 overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "var(--font-mono, 'Fira Code', monospace)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{approval.sql.split("\n")[0]}</p>
                      <button type="button" className="shrink-0 size-[20px] cursor-pointer flex items-center justify-center hover:opacity-70 transition-opacity" onClick={() => setExpanded(!expanded)}>
                        <svg width="10" height="6" viewBox="0 0 10.4397 5.96941" fill="none" style={{ transform: expanded ? "none" : "rotate(180deg)", transition: "transform 150ms ease" }}>
                          <path d={approvalSvgPaths.p348f4800} fill="var(--secondary-foreground)" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {expanded && (
                    <div className="bg-card w-full px-[12px] py-[8px] border-t border-muted">
                      <pre className="text-foreground whitespace-pre-wrap" style={{ fontFamily: "var(--font-mono, 'Fira Code', monospace)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{approval.sql}</pre>
                    </div>
                  )}
                </div>
                <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
              </div>
              {/* Radio options */}
              <div className="flex flex-wrap gap-[12px] items-center">
                <label className="flex gap-[6px] items-center cursor-pointer" onClick={() => setRadioValue("always")}>
                  <div className="relative shrink-0 size-[14px]">
                    <svg className="absolute block size-full" fill="none" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" fill="var(--card)" r="7.25" stroke={radioValue === "always" ? "var(--accent)" : "var(--border)"} strokeWidth="1.5" />
                      {radioValue === "always" && <circle cx="8" cy="8" fill="var(--accent)" r="4" />}
                    </svg>
                  </div>
                  <p className="text-foreground whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>Always allow in {approval.schema}</p>
                </label>
                <label className="flex gap-[6px] items-center cursor-pointer" onClick={() => setRadioValue("once")}>
                  <div className="relative shrink-0 size-[14px]">
                    <svg className="absolute block size-full" fill="none" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" fill="var(--card)" r="7.25" stroke={radioValue === "once" ? "var(--accent)" : "var(--border)"} strokeWidth="1.5" />
                      {radioValue === "once" && <circle cx="8" cy="8" fill="var(--accent)" r="4" />}
                    </svg>
                  </div>
                  <p className="text-foreground whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>Allow once</p>
                </label>
              </div>
            </div>
          </div>
          {/* Action bar */}
          <div className="h-[40px] shrink-0 w-full relative" onClick={(e) => e.stopPropagation()}>
            <div aria-hidden="true" className="absolute border-muted border-solid border-t inset-0 pointer-events-none" />
            <div className="flex items-center gap-[8px] px-[16px] size-full">
              <button type="button" className="bg-accent h-[28px] flex items-center justify-center px-[8px] rounded-[var(--radius-button)] shrink-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => onExecute(approval.id)}>
                <p className="text-accent-foreground whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>{ACTIONS.execute}</p>
              </button>
              <button type="button" className="bg-card h-[28px] relative rounded-[var(--radius-button)] shrink-0 cursor-pointer hover:bg-muted transition-colors" onClick={() => onRequestChanges(approval.id)}>
                <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
                <div className="flex h-full items-center justify-center px-[8px]">
                  <p className="text-secondary-foreground whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{ACTIONS.requestChanges}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-destructive/40 border-solid inset-0 pointer-events-none rounded-[var(--radius-card)]" />
    </div>
  );
}

/* ── Wiki Review Block ───────────────────────────────────────── */

function WikiReviewBlockView({ wikiReview, onSave, onDismiss, onBlockClick, onBlockHover, hoveredBlock }: {
  wikiReview: WikiReviewData;
  onSave: (id: string) => void;
  onDismiss: (id: string) => void;
  onBlockClick?: (block: OutputBlock) => void;
  onBlockHover?: (blockId: string | null) => void;
  hoveredBlock?: string | null;
}) {
  const typeLabels: Record<string, string> = { source: "Source", folder: "Folder", table: "Dataset" };
  const isHovered = hoveredBlock === wikiReview.id;
  const wikiAsBlock: OutputBlock = { id: wikiReview.id, type: "explanation", title: `Wiki · ${wikiReview.nodeLabel}`, version: 1, preview: wikiReview.wikiText, data: { wikiReview } };

  if (wikiReview.status === "saved") {
    return (
      <div className={`bg-card relative rounded-[var(--radius-card)] shrink-0 w-full cursor-pointer transition-all ${isHovered ? "shadow-sm" : ""}`} onClick={() => onBlockClick?.(wikiAsBlock)} onMouseEnter={() => onBlockHover?.(wikiReview.id)} onMouseLeave={() => onBlockHover?.(null)}>
        <div className="overflow-hidden rounded-[inherit] w-full">
          <div className="flex flex-col items-start p-px w-full">
            <div className="bg-background h-[40px] shrink-0 w-full relative">
              <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
              <div className="flex items-center px-[16px] py-[8px] size-full gap-[8px]">
                <div className="bg-chart-5/10 flex h-[20px] items-center justify-center px-[6px] py-px rounded-[var(--radius-button)] shrink-0 gap-[4px]">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="var(--chart-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <p className="text-chart-5 tracking-[0.3px] uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>SAVED</p>
                </div>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>Wiki · {wikiReview.nodeLabel}</p>
              </div>
            </div>
            <div className="shrink-0 w-full px-[16px] py-[12px]">
              <p className="text-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>Wiki saved for {wikiReview.nodeLabel}.</p>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)] transition-colors ${isHovered ? "border-primary" : "border-chart-5/30"}`} />
      </div>
    );
  }

  if (wikiReview.status === "dismissed") {
    return (
      <div className={`bg-card relative rounded-[var(--radius-card)] shrink-0 w-full cursor-pointer transition-all ${isHovered ? "shadow-sm" : ""}`} onClick={() => onBlockClick?.(wikiAsBlock)} onMouseEnter={() => onBlockHover?.(wikiReview.id)} onMouseLeave={() => onBlockHover?.(null)}>
        <div className="overflow-hidden rounded-[inherit] w-full">
          <div className="flex flex-col items-start p-px w-full">
            <div className="bg-background h-[40px] shrink-0 w-full relative">
              <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
              <div className="flex items-center px-[16px] py-[8px] size-full gap-[8px]">
                <div className="bg-muted flex h-[20px] items-center justify-center px-[6px] py-px rounded-[var(--radius-button)] shrink-0">
                  <p className="text-secondary-foreground tracking-[0.3px] uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>DISMISSED</p>
                </div>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>Wiki · {wikiReview.nodeLabel}</p>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)] transition-colors ${isHovered ? "border-primary" : "border-border"}`} />
      </div>
    );
  }

  return (
    <div className={`bg-card relative rounded-[var(--radius-card)] shrink-0 w-full cursor-pointer transition-all ${isHovered ? "shadow-sm" : ""}`} onClick={() => onBlockClick?.(wikiAsBlock)} onMouseEnter={() => onBlockHover?.(wikiReview.id)} onMouseLeave={() => onBlockHover?.(null)}>
      <div className="overflow-hidden rounded-[inherit] w-full">
        <div className="flex flex-col items-start p-px w-full">
          <div className="bg-background h-[40px] shrink-0 w-full relative">
            <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
            <div className="flex items-center px-[16px] py-[8px] size-full gap-[8px]">
              <div className="bg-fyi/10 flex h-[20px] items-center justify-center px-[6px] py-px rounded-[var(--radius-button)] shrink-0 gap-[4px]">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1v2M8 13v2M3.05 3.05l1.414 1.414M11.536 11.536l1.414 1.414M1 8h2M13 8h2M3.05 12.95l1.414-1.414M11.536 4.464l1.414-1.414" stroke="var(--fyi)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <p className="text-fyi tracking-[0.3px] uppercase whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>WIKI</p>
              </div>
              <p className="text-secondary-foreground flex-1" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>{typeLabels[wikiReview.nodeType]} · {wikiReview.nodeLabel}</p>
            </div>
          </div>
          <div className="shrink-0 w-full px-[16px] py-[12px]">
            <p className="text-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{wikiReview.wikiText}</p>
          </div>
          <div className="h-[40px] shrink-0 w-full relative" onClick={(e) => e.stopPropagation()}>
            <div aria-hidden="true" className="absolute border-muted border-solid border-t inset-0 pointer-events-none" />
            <div className="flex items-center gap-[8px] px-[16px] size-full">
              <button type="button" className="bg-accent h-[28px] flex items-center justify-center px-[8px] rounded-[var(--radius-button)] shrink-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => onSave(wikiReview.id)}>
                <p className="text-accent-foreground whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>{ACTIONS.saveWiki}</p>
              </button>
              <button type="button" className="bg-card h-[28px] relative rounded-[var(--radius-button)] shrink-0 cursor-pointer hover:bg-muted transition-colors" onClick={() => onDismiss(wikiReview.id)}>
                <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
                <div className="flex h-full items-center justify-center px-[8px]">
                  <p className="text-secondary-foreground whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{ACTIONS.dismiss}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)] transition-colors ${isHovered ? "border-primary" : "border-fyi/30"}`} />
    </div>
  );
}

/* ── Block views ─────────────────────────────────────────────── */

function SqlBlockView({ block, onBlockClick, onBlockHover, hoveredBlock }: {
  block: OutputBlock; onBlockClick: (block: OutputBlock) => void; onBlockHover: (blockId: string | null) => void; hoveredBlock: string | null;
}) {
  const isHovered = hoveredBlock === block.id;
  return (
    <div className={`bg-card relative rounded-[var(--radius-card)] shrink-0 w-full cursor-pointer transition-all ${isHovered ? "border-primary shadow-sm" : ""}`} onMouseEnter={() => onBlockHover(block.id)} onMouseLeave={() => onBlockHover(null)} onClick={() => onBlockClick(block)}>
      <div className="overflow-hidden rounded-[inherit] w-full">
        <div className="flex flex-col items-start p-px w-full">
          <div className="bg-background h-[40px] shrink-0 w-full relative">
            <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
            <div className="flex items-center px-[16px] py-[8px] size-full justify-between overflow-hidden">
              <div className="flex gap-[8px] items-center flex-1 min-w-0">
                <BlockTypeBadge type="sql" />
                <p className="text-secondary-foreground whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>{block.title}</p>
              </div>
              <TimeBadge time="0.8s" />
            </div>
          </div>
          <div className="shrink-0 w-full">
            <div className="flex items-center px-[16px] py-[12px] w-full">
              <p style={{ fontFamily: "var(--font-mono, 'Fira Code', monospace)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }} className="w-full text-secondary-foreground">{block.preview?.slice(0, 120) ?? "..."}</p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)] transition-colors ${isHovered ? "border-primary" : "border-border"}`} />
    </div>
  );
}

function TableBlockView({ block, onBlockClick, onBlockHover, hoveredBlock }: { block: OutputBlock; onBlockClick: (block: OutputBlock) => void; onBlockHover: (blockId: string | null) => void; hoveredBlock: string | null }) {
  const isHovered = hoveredBlock === block.id;
  return (
    <div className={`bg-card relative rounded-[var(--radius-card)] shrink-0 w-full cursor-pointer transition-all ${isHovered ? "shadow-sm" : ""}`} onMouseEnter={() => onBlockHover(block.id)} onMouseLeave={() => onBlockHover(null)} onClick={() => onBlockClick(block)}>
      <div className="overflow-hidden rounded-[inherit] w-full">
        <div className="flex flex-col items-start p-px w-full">
          <div className="bg-background h-[40px] shrink-0 w-full relative">
            <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
            <div className="flex items-center px-[16px] py-[8px] size-full gap-[8px] overflow-hidden">
              <BlockTypeBadge type="table" />
              <p className="text-secondary-foreground whitespace-nowrap overflow-hidden text-ellipsis min-w-0 shrink-1" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>{block.title}</p>
              <p className="text-secondary-foreground whitespace-nowrap shrink-0" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{block.data?.meta || ""}</p>
              <TimeBadge time="0.8s" />
            </div>
          </div>
          <div className="bg-background shrink-0 w-full relative">
            <div aria-hidden="true" className="absolute border-muted border-b border-l border-solid border-t inset-0 pointer-events-none" />
            <div className="flex items-center h-[32px]">
              <div className="flex-1 flex items-center gap-[8px] px-[8px]">
                <div className="relative shrink-0 size-[16px]"><div className="absolute inset-[12.5%_8.33%_8.33%_8.33%]"><svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 12.6667"><g><path d={svgPaths.p12a67780} fill="var(--secondary-foreground)" /><path d={svgPaths.p20aeb800} fill="var(--secondary-foreground)" /><path clipRule="evenodd" d={svgPaths.p2eceac40} fill="var(--secondary-foreground)" fillRule="evenodd" /></g></svg></div></div>
                <p className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>Pickup_datetime</p>
              </div>
              <div className="flex-1 flex items-center gap-[8px] px-[8px] border-l border-muted">
                <div className="relative shrink-0 size-[16px]"><div className="absolute inset-[29.17%_8.33%_29.75%_8.33%]"><svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3335 6.57256"><g><path clipRule="evenodd" d={svgPaths.p252b4f00} fill="var(--secondary-foreground)" fillRule="evenodd" /><path clipRule="evenodd" d={svgPaths.p2f751880} fill="var(--secondary-foreground)" fillRule="evenodd" /><path d={svgPaths.p2f226800} fill="var(--secondary-foreground)" /></g></svg></div></div>
                <p className="text-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>ID</p>
              </div>
              <div className="w-[80px] flex items-center gap-[8px] px-[8px] border-l border-muted overflow-hidden">
                <p className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}># passenger_count</p>
              </div>
            </div>
          </div>
          {block.data?.rows.map((row: any, i: number) => (
            <div key={i} className="shrink-0 w-full flex h-[28px]">
              <div className="flex-1 flex items-center px-[8px] border-b border-l border-muted overflow-hidden"><p className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{row.pickup_datetime}</p></div>
              <div className="flex-1 flex items-center px-[8px] border-b border-l border-muted overflow-hidden"><p className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{row.id}</p></div>
              <div className="w-[80px] flex items-center px-[8px] border-b border-l border-muted overflow-hidden"><p className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{row.passenger_count}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)] transition-colors ${isHovered ? "border-primary" : "border-border"}`} />
    </div>
  );
}

function ExplanationBlockView({ block, onBlockClick, onBlockHover, hoveredBlock }: { block: OutputBlock; onBlockClick: (block: OutputBlock) => void; onBlockHover: (blockId: string | null) => void; hoveredBlock: string | null }) {
  const isHovered = hoveredBlock === block.id;
  return (
    <div className={`bg-card relative rounded-[var(--radius-card)] shrink-0 w-full cursor-pointer transition-all ${isHovered ? "shadow-sm" : ""}`} onMouseEnter={() => onBlockHover(block.id)} onMouseLeave={() => onBlockHover(null)} onClick={() => onBlockClick(block)}>
      <div className="overflow-hidden rounded-[inherit] w-full">
        <div className="flex flex-col items-start p-px w-full">
          <div className="bg-background h-[40px] shrink-0 w-full relative">
            <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
            <div className="flex items-center px-[16px] py-[8px] size-full justify-between overflow-hidden">
              <div className="flex gap-[8px] items-center flex-1 min-w-0"><BlockTypeBadge type="explanation" /><p className="text-secondary-foreground whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>{block.title}</p></div>
            </div>
          </div>
          <div className="shrink-0 w-full"><div className="px-[16px] py-[12px]"><p className="text-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{block.preview?.slice(0, 120)}...</p></div></div>
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)] transition-colors ${isHovered ? "border-primary" : "border-border"}`} />
    </div>
  );
}

/* ── Lineage mini-preview ─────────────────────────────────── */

function LineagePreview({ nodes }: { nodes: { id: string; label: string; type: string }[] }) {
  return (
    <div className="flex items-center gap-[8px] h-[40px]">
      {nodes.map((node, i) => (
        <div key={node.id} className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[4px] px-[6px] py-[4px] rounded-[4px] border border-border bg-background">
            <div className="shrink-0 size-[14px] rounded-[2px] flex items-center justify-center" style={{ backgroundColor: node.type === "source" ? "var(--fyi)" : "var(--primary)" }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="white" fillOpacity="0.8" /></svg>
            </div>
            <p className="text-foreground whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{node.label}</p>
          </div>
          {i < nodes.length - 1 && (
            <svg width="16" height="8" viewBox="0 0 16 8" fill="none"><path d="M0 4H12M12 4L9 1M12 4L9 7" stroke="var(--secondary-foreground)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </div>
      ))}
    </div>
  );
}

function ChartBlockView({ block, onBlockClick, onBlockHover, hoveredBlock, onSaveAsView }: { block: OutputBlock; onBlockClick: (block: OutputBlock) => void; onBlockHover: (blockId: string | null) => void; hoveredBlock: string | null; onSaveAsView?: (block: OutputBlock) => void }) {
  const isHovered = hoveredBlock === block.id;
  const isLineage = block.data?.lineage;
  return (
    <div className={`bg-card relative rounded-[var(--radius-card)] shrink-0 w-full cursor-pointer transition-all ${isHovered ? "shadow-sm" : ""}`} onMouseEnter={() => onBlockHover(block.id)} onMouseLeave={() => onBlockHover(null)} onClick={() => onBlockClick(block)}>
      <div className="overflow-hidden rounded-[inherit] w-full">
        <div className="flex flex-col items-start p-px w-full">
          <div className="bg-background h-[40px] shrink-0 w-full relative">
            <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
            <div className="flex items-center px-[16px] py-[8px] size-full justify-between overflow-hidden">
              <div className="flex gap-[8px] items-center min-w-0 flex-1"><BlockTypeBadge type="chart" /><p className="text-secondary-foreground whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>{block.title}</p></div>
              <TimeBadge time={isLineage ? "0.3s" : "1.2s"} />
            </div>
          </div>
          <div className="shrink-0 w-full px-[16px] py-[12px]">
            {isLineage ? (
              <LineagePreview nodes={block.data.nodes} />
            ) : (
              <div className="flex items-end gap-[4px] h-[40px]">{[65, 45, 80, 35, 55].map((h, i) => (<div key={i} className="flex-1 bg-accent/60 rounded-t-[2px]" style={{ height: `${h}%` }} />))}</div>
            )}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)] transition-colors ${isHovered ? "border-primary" : "border-border"}`} />
    </div>
  );
}

/* ── Dataset Profile Block (chat) ─────────────────────────────── */

function DatasetBlockView({ block, onBlockClick, onBlockHover, hoveredBlock }: {
  block: OutputBlock; onBlockClick: (block: OutputBlock) => void; onBlockHover: (blockId: string | null) => void; hoveredBlock: string | null;
}) {
  const isHovered = hoveredBlock === block.id;
  const d = block.data?.profile;
  return (
    <div className={`bg-card relative rounded-[var(--radius-card)] shrink-0 w-full cursor-pointer transition-all ${isHovered ? "shadow-sm" : ""}`} onMouseEnter={() => onBlockHover(block.id)} onMouseLeave={() => onBlockHover(null)} onClick={() => onBlockClick(block)}>
      <div className="overflow-hidden rounded-[inherit] w-full">
        <div className="flex flex-col items-start p-px w-full">
          <div className="bg-background h-[40px] shrink-0 w-full relative">
            <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
            <div className="flex items-center px-[16px] py-[8px] size-full gap-[8px] overflow-hidden">
              <BlockTypeBadge type="dataset" />
              <div className="shrink-0 size-[20px] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="12" height="12" rx="2" stroke="var(--secondary-foreground)" strokeWidth="1.2" />
                  <line x1="1" y1="5" x2="13" y2="5" stroke="var(--secondary-foreground)" strokeWidth="1.2" />
                  <line x1="5" y1="5" x2="5" y2="13" stroke="var(--secondary-foreground)" strokeWidth="1.2" />
                  <line x1="9" y1="5" x2="9" y2="13" stroke="var(--secondary-foreground)" strokeWidth="1.2" />
                </svg>
              </div>
              <p className="text-secondary-foreground whitespace-nowrap overflow-hidden text-ellipsis flex-1" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>{block.title}</p>
              {d && <p className="text-secondary-foreground whitespace-nowrap shrink-0" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{d.columnCount} cols</p>}
            </div>
          </div>
          {d && (
            <div className="shrink-0 w-full px-[16px] py-[12px]">
              <p className="text-secondary-foreground mb-[8px]" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{d.path}</p>
              <div className="flex gap-[8px] items-center flex-wrap">
                {d.labels?.map((label: string) => (
                  <div key={label} className="bg-primary/10 flex h-[24px] items-center justify-center px-[8px] rounded-[var(--radius-button)] shrink-0 relative">
                    <div aria-hidden="true" className="absolute border border-primary/20 border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
                    <p className="text-foreground whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{label}</p>
                  </div>
                ))}
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", lineHeight: "1.5" }}>·</p>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", lineHeight: "1.5" }}>{d.columnCount} columns</p>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", lineHeight: "1.5" }}>·</p>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", lineHeight: "1.5" }}>{d.volume}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)] transition-colors ${isHovered ? "border-primary" : "border-border"}`} />
    </div>
  );
}

/* ── View Block (chat) ───────────────────────────────────────── */

function ViewBlockView({ block, onBlockClick, onBlockHover, hoveredBlock }: {
  block: OutputBlock; onBlockClick: (block: OutputBlock) => void; onBlockHover: (blockId: string | null) => void; hoveredBlock: string | null;
}) {
  const isHovered = hoveredBlock === block.id;
  const d = block.data?.profile;
  return (
    <div className={`bg-card relative rounded-[var(--radius-card)] shrink-0 w-full cursor-pointer transition-all ${isHovered ? "shadow-sm" : ""}`} onMouseEnter={() => onBlockHover(block.id)} onMouseLeave={() => onBlockHover(null)} onClick={() => onBlockClick(block)}>
      <div className="overflow-hidden rounded-[inherit] w-full">
        <div className="flex flex-col items-start p-px w-full">
          <div className="bg-background h-[40px] shrink-0 w-full relative">
            <div aria-hidden="true" className="absolute border-muted border-b border-solid inset-0 pointer-events-none" />
            <div className="flex items-center px-[16px] py-[8px] size-full gap-[8px] overflow-hidden">
              <BlockTypeBadge type="view" />
              <div className="shrink-0 size-[20px] flex items-center justify-center">
                <IconEntityView size={20} />
              </div>
              <p className="text-secondary-foreground whitespace-nowrap overflow-hidden text-ellipsis flex-1" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>{block.title}</p>
              {d && <p className="text-secondary-foreground whitespace-nowrap shrink-0" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{d.columnCount} cols</p>}
            </div>
          </div>
          {d && (
            <div className="shrink-0 w-full px-[16px] py-[12px]">
              <p className="text-secondary-foreground mb-[8px]" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{d.path}</p>
              <div className="flex gap-[8px] items-center flex-wrap">
                {d.labels?.map((label: string) => (
                  <div key={label} className="bg-accent/10 flex h-[24px] items-center justify-center px-[8px] rounded-[var(--radius-button)] shrink-0 relative">
                    <div aria-hidden="true" className="absolute border border-accent/20 border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
                    <p className="text-accent whitespace-nowrap" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{label}</p>
                  </div>
                ))}
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", lineHeight: "1.5" }}>·</p>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", lineHeight: "1.5" }}>{d.columnCount} columns</p>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", lineHeight: "1.5" }}>·</p>
                <p className="text-secondary-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", lineHeight: "1.5" }}>{d.volume}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[var(--radius-card)] transition-colors ${isHovered ? "border-primary" : "border-accent/30"}`} />
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */

/** Chat panel — renders messages, output blocks, and gradient-bordered input */
export function ChatPanel({ onBlockClick, onBlockHover, hoveredBlock, onSaveAsView, onRegisterActions, chatTitle, onBlocksCreated }: ChatPanelProps) {
  // STATE — All chat state from custom hook
  const chat = useChat({ onRegisterActions, onBlocksCreated });

  // INTERACTION — Block rendering
  const renderBlock = useCallback(
    (block: OutputBlock) => {
      switch (block.type) {
        case "sql":
          return <SqlBlockView key={block.id} block={block} onBlockClick={onBlockClick} onBlockHover={onBlockHover} hoveredBlock={hoveredBlock} />;
        case "table":
          return <TableBlockView key={block.id} block={block} onBlockClick={onBlockClick} onBlockHover={onBlockHover} hoveredBlock={hoveredBlock} />;
        case "chart":
          return <ChartBlockView key={block.id} block={block} onBlockClick={onBlockClick} onBlockHover={onBlockHover} hoveredBlock={hoveredBlock} onSaveAsView={onSaveAsView} />;
        case "explanation":
          return <ExplanationBlockView key={block.id} block={block} onBlockClick={onBlockClick} onBlockHover={onBlockHover} hoveredBlock={hoveredBlock} />;
        case "dataset":
          return <DatasetBlockView key={block.id} block={block} onBlockClick={onBlockClick} onBlockHover={onBlockHover} hoveredBlock={hoveredBlock} />;
        case "view":
          return <ViewBlockView key={block.id} block={block} onBlockClick={onBlockClick} onBlockHover={onBlockHover} hoveredBlock={hoveredBlock} />;
        default:
          return null;
      }
    },
    [onBlockClick, onBlockHover, hoveredBlock, onSaveAsView],
  );

  return (
    // LAYOUT
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat header — 52px */}
      <div className="shrink-0 w-full relative h-[52px]">
        <div aria-hidden="true" className="absolute border-muted border-b border-solid left-0 right-0 bottom-0 pointer-events-none" style={{ height: "1px" }} />
        <div className="content-stretch flex items-center justify-between px-[20px] py-[8px] relative size-full">
          <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
            <div className="relative shrink-0 size-[30px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
                <path d={svgPaths.p2962b000} fill="url(#paint0_linear_chat_hdr)" />
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_chat_hdr" x1="4.14179" x2="27.1147" y1="9.21348" y2="25.3789">
                    <stop stopColor="#299FB1" /><stop offset="0.55" stopColor="#4FC08B" /><stop offset="1" stopColor="#B7D325" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
              <p className="text-foreground whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-semibold)", lineHeight: "1.5" }}>
                {chatTitle ?? CHAT_PANEL.headerTitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-[16px] py-[16px]">
        <div className="flex flex-col gap-[16px] items-center">
          {chat.messages.map((msg) =>
            msg.role === "user" ? (
              <div key={msg.id} className="flex items-start justify-end w-full">
                <div className="bg-muted rounded-tl-[var(--radius-card)] rounded-tr-[var(--radius-card)] rounded-br-[var(--radius-button)] rounded-bl-[var(--radius-card)] max-w-[80%]">
                  <div className="px-[16px] py-[8px]">
                    <p className="text-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{msg.text}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex flex-col gap-[8px] items-start w-full">
                {msg.text && (
                  <div className="w-full">
                    <div className="py-[4px]">
                      <p className="text-foreground" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: "var(--font-weight-normal)", lineHeight: "1.5" }}>{msg.text}</p>
                    </div>
                  </div>
                )}
                {msg.toolCalls && (
                  <ToolCallsBlock toolCalls={msg.toolCalls} />
                )}
                {msg.approval && (
                  <ApprovalBlockView approval={msg.approval} onExecute={chat.handleApprovalExecute} onRequestChanges={chat.handleApprovalReject} />
                )}
                {msg.wikiReview && (
                  <WikiReviewBlockView wikiReview={msg.wikiReview} onSave={chat.handleWikiSave} onDismiss={chat.handleWikiDismiss} onBlockClick={onBlockClick} onBlockHover={onBlockHover} hoveredBlock={hoveredBlock} />
                )}
                {msg.blocks?.map((block) => renderBlock(block))}
              </div>
            ),
          )}
          {chat.isTyping && (
            <div className="flex items-start w-full">
              <div className="bg-card relative rounded-bl-[var(--radius-button)] rounded-br-[var(--radius-card)] rounded-tl-[var(--radius-card)] rounded-tr-[var(--radius-card)]">
                <div aria-hidden="true" className="absolute border border-border/50 border-solid inset-0 pointer-events-none rounded-bl-[var(--radius-button)] rounded-br-[var(--radius-card)] rounded-tl-[var(--radius-card)] rounded-tr-[var(--radius-card)]" />
                <div className="px-[16px] py-[8px] flex gap-[4px] items-center">
                  <div className="size-[6px] rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="size-[6px] rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="size-[6px] rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chat.messagesEndRef} />
        </div>
      </div>

      {/* Chat input — Figma gradient border */}
      <ChatInput
        inputValue={chat.inputValue}
        onInputChange={chat.setInputValue}
        onSend={chat.handleSend}
        onKeyDown={chat.handleInputKeyDown}
        onInput={chat.handleTextareaInput}
        textareaRef={chat.textareaRef}
        contextChips={chat.contextChips}
        onRemoveChip={chat.removeContextChip}
      />
    </div>
  );
}