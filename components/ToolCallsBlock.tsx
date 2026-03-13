// COMPONENT — Inline collapsible tool calls display for AI agent processing steps
// Modeled after Claude's tool-use UX: subtle muted annotation, auto-collapsed when done
// Collapsed = single 12px muted line; Expanded = lightweight timeline with step details

import { useState, useCallback } from "react";
import type { ToolCallGroup, ToolCallStatus } from "../hooks/useChat";
import toolCallSvgPaths from "../../imports/svg-fskxk9xcpw";
import svgPaths from "../../imports/svg-javaskxvh1";

// COPY
import { TOOL_CALLS } from "../constants/strings";

/* ── Status indicators ──────────────────────────────────────── */

// LAYOUT — Tiny inline status dot/icon (14×14 for completed/failed, 14×14 spinner for running)
function StepDot({ status }: { status: ToolCallStatus }) {
  if (status === "completed") {
    return (
      <svg className="shrink-0 size-[14px]" viewBox="0 0 13.334 13.334" fill="none">
        <path d={toolCallSvgPaths.p353d1680} fill="var(--chart-5)" />
      </svg>
    );
  }
  if (status === "failed") {
    return (
      <svg className="shrink-0 size-[14px]" viewBox="0 0 11.666 13.4212" fill="none">
        <path d={toolCallSvgPaths.p31b07cc0} fill="var(--destructive)" />
      </svg>
    );
  }
  if (status === "running") {
    return (
      <div className="shrink-0 size-[14px] flex items-center justify-center">
        <div className="size-[10px] rounded-full border-[1.5px] border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  // pending
  return (
    <div className="shrink-0 size-[14px] flex items-center justify-center">
      <div className="size-[6px] rounded-full bg-muted-foreground/40" />
    </div>
  );
}

// LAYOUT — Small inline chevron (8×5)
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className="shrink-0"
      width="8"
      height="5"
      viewBox="0 0 10.4397 5.96941"
      fill="none"
      style={{
        transform: open ? "rotate(180deg)" : "none",
        transition: "transform 150ms ease",
      }}
    >
      <path d={svgPaths.p348f4800} fill="var(--muted-foreground)" />
    </svg>
  );
}

// INTERACTION — Copy button (small, for arguments block)
function CopyBtn({ text }: { text: string }) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
  }, [text]);

  return (
    <button
      type="button"
      className="shrink-0 size-[16px] cursor-pointer flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
      onClick={(e) => { e.stopPropagation(); handleCopy(); }}
      aria-label="Copy"
    >
      <svg className="block size-[11px]" fill="none" viewBox="0 0 13.3333 16.67">
        <path d={toolCallSvgPaths.p13f9f0f0} fill="var(--secondary-foreground)" />
      </svg>
    </button>
  );
}

// LAYOUT — Format duration
function fmtDur(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/* ── Step row (expandable) ──────────────────────────────────── */

// LAYOUT — Single step in the timeline
function StepRow({ step }: { step: import("../hooks/useChat").ToolCallStep }) {
  // STATE
  const [open, setOpen] = useState(false);
  const hasDetails = !!(step.description || step.arguments || step.result);

  return (
    <div className="flex flex-col">
      {/* INTERACTION — Step title row */}
      <button
        type="button"
        className={`flex items-center gap-[8px] w-full py-[4px] ${hasDetails ? "cursor-pointer" : "cursor-default"}`}
        onClick={() => hasDetails && setOpen(!open)}
      >
        <StepDot status={step.status} />
        <span
          className="flex-1 text-left text-secondary-foreground truncate"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-normal)",
            lineHeight: "1.5",
          }}
        >
          {step.title}
        </span>
        {step.durationMs != null && (
          <span
            className="text-muted-foreground shrink-0"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-weight-normal)",
              lineHeight: "1.5",
            }}
          >
            {fmtDur(step.durationMs)}
          </span>
        )}
        {hasDetails && <Chevron open={open} />}
      </button>

      {/* LAYOUT — Expanded details (description, arguments, result) */}
      {open && (
        <div className="flex flex-col gap-[4px] pl-[22px] pb-[4px]">
          {/* Description */}
          {step.description && (
            <p
              className="text-muted-foreground"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                lineHeight: "1.5",
              }}
            >
              {step.description}
            </p>
          )}

          {/* Arguments code block */}
          {step.arguments && (
            <div className="bg-background rounded-[var(--radius-button)] overflow-hidden mt-[2px]">
              <div className="flex flex-col gap-[4px] px-[8px] py-[6px]">
                <div className="flex items-center justify-between">
                  <span
                    className="text-muted-foreground"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-weight-normal)",
                      lineHeight: "1.5",
                    }}
                  >
                    {TOOL_CALLS.arguments}
                  </span>
                  <CopyBtn text={step.arguments} />
                </div>
                <pre
                  className="text-fyi whitespace-pre-wrap break-all"
                  style={{
                    fontFamily: "var(--font-code)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-normal)",
                    lineHeight: "1.5",
                  }}
                >
                  {step.arguments}
                </pre>
              </div>
            </div>
          )}

          {/* Result */}
          {step.result && (
            <p
              className="text-secondary-foreground"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                lineHeight: "1.5",
              }}
            >
              {step.result}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */

// LAYOUT — Props
interface ToolCallsBlockProps {
  toolCalls: ToolCallGroup;
}

/** Inline tool calls annotation — collapsed by default, expand to see step timeline */
export function ToolCallsBlock({ toolCalls }: ToolCallsBlockProps) {
  // STATE
  const steps = toolCalls.steps;
  const isRunning = steps.some((s) => s.status === "running");
  const allDone = steps.every((s) => s.status === "completed" || s.status === "failed");
  const [expanded, setExpanded] = useState(isRunning);

  // COPY — Summary text
  const runningStep = steps.find((s) => s.status === "running");
  const summaryText = isRunning
    ? runningStep?.title ?? TOOL_CALLS.running
    : TOOL_CALLS.usedTools(steps.length);

  return (
    <div className="w-full">
      {/* INTERACTION — Toggle row: inline muted annotation */}
      <button
        type="button"
        className="flex items-center gap-[6px] py-[2px] cursor-pointer group w-full"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Status indicator */}
        {isRunning ? (
          <div className="shrink-0 size-[12px] flex items-center justify-center">
            <div className="size-[10px] rounded-full border-[1.5px] border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <svg className="shrink-0 size-[12px]" viewBox="0 0 13.334 13.334" fill="none">
            <path d={toolCallSvgPaths.p353d1680} fill="var(--chart-5)" />
          </svg>
        )}

        {/* Summary text */}
        <span
          className="text-muted-foreground group-hover:text-secondary-foreground transition-colors"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-normal)",
            lineHeight: "1.5",
          }}
        >
          {summaryText}
        </span>

        <Chevron open={expanded} />
      </button>

      {/* LAYOUT — Expanded timeline */}
      {expanded && (
        <div className="flex flex-col pl-[4px] pt-[2px] border-l border-muted ml-[5px]">
          {steps.map((step) => (
            <StepRow key={step.id} step={step} />
          ))}
        </div>
      )}
    </div>
  );
}
