// COMPONENT — Toast notification
// Appears bottom-right of the screen. Auto-dismisses after `duration` ms (default 3000).
// Three variants: default (neutral), success (green), error (red).
// Placement: bottom-right — away from the chat input (bottom-left panel) and workspace content.
// Use useToast() hook below to trigger toasts imperatively from any component.

import { useState, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export type ToastVariant = "default" | "success" | "error";

export interface ToastProps {
  /** Message text shown inside the toast */
  message: string;
  /** Visual style. Default: "default" (neutral) */
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Default: 3000. Pass 0 to never auto-dismiss. */
  duration?: number;
  /** Called when the toast finishes dismissing */
  onDismiss?: () => void;
}

// ── Variant config ─────────────────────────────────────────────────────────

interface VariantConfig {
  icon: React.ReactNode;
}

function SuccessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke="var(--chart-5, #5ABD4A)" strokeWidth="1.5" />
      <path
        d="M5 8L7 10L11 6"
        stroke="var(--chart-5, #5ABD4A)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke="var(--destructive, #CA3F32)" strokeWidth="1.5" />
      <path
        d="M8 5V8.5M8 10.5V11"
        stroke="var(--destructive, #CA3F32)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
        stroke="var(--secondary-foreground, #505862)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Toast component ────────────────────────────────────────────────────────

export function Toast({ message, variant = "default", duration = 3000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    // Wait for fade-out before calling onDismiss
    setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 200);
  }, [onDismiss]);

  useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  if (!visible) return null;

  return (
    // LAYOUT — Fixed bottom-right anchor
    // Fixed positioning is relative to the viewport so the toast always appears
    // in the same corner regardless of scroll or panel layout.
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 200ms ease, transform 200ms ease",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          height: "40px",
          padding: "0 12px",
          borderRadius: "8px",
          backgroundColor: "var(--card, #ffffff)",
          border: "1px solid var(--muted, #EEEFF1)",
          boxShadow: "0px 2px 4px rgba(16,18,20,0.10)",
          minWidth: "200px",
          maxWidth: "360px",
        }}
      >
        {/* Icon — only shown for success and error variants */}
        {variant === "success" && (
          <span style={{ display: "flex", flexShrink: 0 }}>
            <SuccessIcon />
          </span>
        )}
        {variant === "error" && (
          <span style={{ display: "flex", flexShrink: 0 }}>
            <ErrorIcon />
          </span>
        )}

        {/* Message */}
        <p
          style={{
            flex: 1,
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "1.5",
            color: "var(--foreground, #202124)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {message}
        </p>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: "20px",
            height: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            opacity: 0.6,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

// ── useToast hook ──────────────────────────────────────────────────────────
// Minimal imperative toast hook. Renders a single toast at a time.
// For multiple concurrent toasts use a full toast provider (out of scope here).
//
// Usage:
//   const { showToast, ToastOutlet } = useToast();
//   showToast("Copied to clipboard", "success");
//   return <><YourUI /><ToastOutlet /></>;

interface ToastState {
  id: number;
  message: string;
  variant: ToastVariant;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, variant: ToastVariant = "default") => {
    setToast({ id: Date.now(), message, variant });
  }, []);

  const ToastOutlet = useCallback(() => {
    if (!toast) return null;
    return (
      <Toast
        key={toast.id}
        message={toast.message}
        variant={toast.variant}
        onDismiss={() => setToast(null)}
      />
    );
  }, [toast]);

  return { showToast, ToastOutlet };
}
