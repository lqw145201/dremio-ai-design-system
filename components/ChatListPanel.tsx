// COMPONENT — Chat list panel with recent chats, hover "more" menu, rename/delete dialogs
// Follows design system: bg-popover, shadow-dropdown, rounded-[var(--radius-button)], hover:bg-background-hover

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import svgPaths from "../../imports/svg-javaskxvh1";
import closeSvgPaths from "../../imports/svg-ye44z423jp";
import warningSvgPaths from "../../imports/svg-4mzkarf672";

// COPY
import { CHAT_LIST, CHAT_LIST_ITEMS } from "../constants/strings";

// STATE — Chat item type (mutable for rename)
interface ChatItem {
  id: number;
  title: string;
}

interface ChatListPanelProps {
  selectedChat: number;
  onSelectChat: (id: number) => void;
  onCollapse: () => void;
  onChatTitleChange?: (title: string | null) => void;
}

/* ── More button (three dots) ─────────────────────────────────── */

// LAYOUT — Three-dot icon for "more" actions
function MoreIcon() {
  return (
    <svg width="10" height="3" viewBox="0 0 10.3333 2.33333" fill="none">
      <path d={svgPaths.p12e12a80} fill="var(--secondary-foreground)" />
      <path d={svgPaths.p39c2dc00} fill="var(--secondary-foreground)" />
      <path d={svgPaths.p1a349680} fill="var(--secondary-foreground)" />
    </svg>
  );
}

/* ── Context menu dropdown ────────────────────────────────────── */

// LAYOUT — Dropdown menu for chat item actions (rename, delete)
function ChatContextMenu({
  anchorRect,
  onRename,
  onDelete,
  onClose,
}: {
  anchorRect: DOMRect;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  // STATE
  const menuRef = useRef<HTMLDivElement>(null);

  // INTERACTION — Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // LAYOUT — Position below the anchor button
  const top = anchorRect.bottom + 4;
  const left = anchorRect.right;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 bg-popover overflow-clip py-[4px] rounded-[var(--radius-button)] shadow-dropdown min-w-[120px]"
      style={{ top, left, transform: "translateX(-100%)" }}
    >
      {/* Rename */}
      <button
        type="button"
        className="h-[32px] w-full text-left flex items-center cursor-pointer select-none hover:bg-background-hover transition-colors"
        onClick={() => { onRename(); onClose(); }}
      >
        <div className="flex items-center gap-[8px] pl-[16px] pr-[8px] size-full">
          <span
            className="flex-1 whitespace-nowrap text-popover-foreground"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-weight-normal)",
              lineHeight: "1.5",
            }}
          >
            {CHAT_LIST.rename}
          </span>
        </div>
      </button>
      {/* Delete */}
      <button
        type="button"
        className="h-[32px] w-full text-left flex items-center cursor-pointer select-none hover:bg-background-hover transition-colors"
        onClick={() => { onDelete(); onClose(); }}
      >
        <div className="flex items-center gap-[8px] pl-[16px] pr-[8px] size-full">
          <span
            className="flex-1 whitespace-nowrap text-destructive"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-weight-normal)",
              lineHeight: "1.5",
            }}
          >
            {CHAT_LIST.delete}
          </span>
        </div>
      </button>
    </div>,
    document.body,
  );
}

/* ── Delete confirmation dialog ───────────────────────────────── */

// LAYOUT — Delete chat dialog matching Figma ExampleDialog spec
function DeleteDialog({
  chatName,
  onConfirm,
  onCancel,
}: {
  chatName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/20">
      <div
        className="flex flex-col items-start w-[400px] bg-card rounded-[var(--radius-button)] overflow-hidden"
        style={{ boxShadow: "var(--elevation-dropdown)" }}
      >
        {/* LAYOUT — Header with warning icon */}
        <div className="relative shrink-0 w-full rounded-t-[var(--radius-button)]">
          <div className="bg-card h-[55px] relative rounded-t-[var(--radius-button)] shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="flex gap-[8px] items-center px-[16px] py-[10px] size-full">
                {/* Warning icon */}
                <div className="relative shrink-0 size-[24px]">
                  <div className="absolute inset-[8.33%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                      <path d={warningSvgPaths.p3d0c7e00} fill="var(--secondary-foreground)" />
                    </svg>
                  </div>
                </div>
                {/* Title */}
                <p
                  className="flex-1 text-foreground"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--font-weight-semibold)",
                    lineHeight: "1.5",
                  }}
                >
                  {CHAT_LIST.deleteTitle}
                </p>
                {/* Close button */}
                <button
                  type="button"
                  className="relative shrink-0 size-[24px] cursor-pointer rounded-[var(--radius-button)] hover:bg-muted transition-colors"
                  onClick={onCancel}
                >
                  <div className="absolute inset-[17.67%_17.67%_17.71%_17.71%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.5094 15.5094">
                      <path d={closeSvgPaths.pcf7f70} fill="var(--secondary-foreground)" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
          {/* Hairline */}
          <div className="h-px w-full bg-muted absolute bottom-0 left-0" />
        </div>

        {/* LAYOUT — Body: confirmation text */}
        <div className="bg-card shrink-0 w-full">
          <div className="flex flex-col items-start p-[16px] w-full">
            <p
              className="text-foreground"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-weight-normal)",
                lineHeight: "1.5",
              }}
            >
              Are you sure you want to delete{" "}
              <span
                style={{ fontWeight: "var(--font-weight-semibold)" } as React.CSSProperties}
              >
                {chatName}
              </span>
              ?
            </p>
          </div>
        </div>

        {/* LAYOUT — Footer: Cancel + Delete buttons */}
        <div className="bg-card h-[56px] relative rounded-b-[var(--radius-button)] shrink-0 w-full">
          <div className="flex flex-col items-end justify-end overflow-clip rounded-[inherit] size-full">
            <div className="flex gap-[8px] h-[55px] items-center justify-end px-[16px] shrink-0">
              {/* Cancel */}
              <button
                type="button"
                className="bg-card relative h-[32px] w-[100px] rounded-[var(--radius-button)] cursor-pointer hover:bg-muted transition-colors"
                onClick={onCancel}
              >
                <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
                <div className="flex items-center justify-center size-full">
                  <p
                    className="text-secondary-foreground whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-base)",
                      fontWeight: 500,
                      lineHeight: "1.5",
                    }}
                  >
                    {CHAT_LIST.cancel}
                  </p>
                </div>
              </button>
              {/* Delete */}
              <button
                type="button"
                className="bg-destructive h-[32px] w-[100px] rounded-[var(--radius-button)] cursor-pointer hover:opacity-90 transition-opacity"
                onClick={onConfirm}
              >
                <div className="flex items-center justify-center size-full">
                  <p
                    className="text-destructive-foreground whitespace-nowrap"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-base)",
                      fontWeight: 500,
                      lineHeight: "1.5",
                    }}
                  >
                    {CHAT_LIST.delete}
                  </p>
                </div>
              </button>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border-muted border-solid border-t inset-0 pointer-events-none rounded-b-[var(--radius-button)]" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ── Single chat row ──────────────────────────────────────────── */

// LAYOUT — Chat list item with hover "more" button and inline rename
function ChatItemRow({
  chat,
  isSelected,
  isRenaming,
  onSelect,
  onRename,
  onDelete,
  onRenameCommit,
}: {
  chat: ChatItem;
  isSelected: boolean;
  isRenaming: boolean;
  onSelect: () => void;
  onRename: (id: number) => void;
  onDelete: (id: number) => void;
  onRenameCommit: (newName: string | null) => void;
}) {
  // STATE
  const [menuOpen, setMenuOpen] = useState(false);
  const moreRef = useRef<HTMLButtonElement>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const committedRef = useRef(false);

  // INTERACTION — Reset commit flag when entering rename mode
  useEffect(() => {
    if (isRenaming) committedRef.current = false;
  }, [isRenaming]);

  // INTERACTION — Open context menu
  const handleMore = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (moreRef.current) {
      setAnchorRect(moreRef.current.getBoundingClientRect());
    }
    setMenuOpen(true);
  }, []);

  return (
    <div
      className={`group relative rounded-[var(--radius-button)] shrink-0 w-full transition-colors ${
        isRenaming ? "bg-muted" : isSelected ? "bg-muted cursor-pointer" : "hover:bg-muted/50 cursor-pointer"
      }`}
      onClick={isRenaming ? undefined : onSelect}
    >
      <div className="flex items-center px-[12px] py-[8px] w-full">
        {isRenaming ? (
          // INTERACTION — Inline rename input
          <input
            type="text"
            defaultValue={chat.title}
            autoFocus
            className="flex-1 min-w-0 bg-transparent outline-none text-foreground"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              fontWeight: isSelected ? 500 : "var(--font-weight-normal)",
              lineHeight: "1.5",
            }}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                committedRef.current = true;
                onRenameCommit(e.currentTarget.value.trim() || null);
              } else if (e.key === "Escape") {
                committedRef.current = true;
                onRenameCommit(null);
              }
            }}
            onBlur={(e) => {
              if (committedRef.current) return;
              committedRef.current = true;
              onRenameCommit(e.target.value.trim() || null);
            }}
          />
        ) : (
          <p
            className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-foreground min-w-0"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              fontWeight: isSelected ? 500 : "var(--font-weight-normal)",
              lineHeight: "1.5",
            }}
          >
            {chat.title}
          </p>
        )}

        {/* INTERACTION — More button (hidden during rename) */}
        {!isRenaming && (
          <button
            ref={moreRef}
            type="button"
            className={`shrink-0 size-[24px] flex items-center justify-center rounded-[var(--radius-button)] cursor-pointer hover:bg-muted transition-all ${
              menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            onClick={handleMore}
          >
            <MoreIcon />
          </button>
        )}
      </div>

      {/* LAYOUT — Context menu dropdown */}
      {menuOpen && anchorRect && (
        <ChatContextMenu
          anchorRect={anchorRect}
          onRename={() => onRename(chat.id)}
          onDelete={() => onDelete(chat.id)}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────── */

export function ChatListPanel({ selectedChat, onSelectChat, onCollapse, onChatTitleChange }: ChatListPanelProps) {
  // STATE — Local mutable chat list for rename/delete
  const [chats, setChats] = useState<ChatItem[]>(
    CHAT_LIST_ITEMS.map((c) => ({ id: c.id, title: c.title })),
  );

  // STATE — Inline rename and delete
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChatItem | null>(null);

  // INTERACTION — Start inline rename
  const handleRenameRequest = useCallback((id: number) => {
    setRenamingId(id);
  }, []);

  // INTERACTION — Commit inline rename (null = cancelled)
  const handleRenameCommit = useCallback(
    (newName: string | null) => {
      if (newName && renamingId !== null) {
        setChats((prev) =>
          prev.map((c) => (c.id === renamingId ? { ...c, title: newName } : c)),
        );
        if (renamingId === selectedChat && onChatTitleChange) {
          onChatTitleChange(newName);
        }
      }
      setRenamingId(null);
    },
    [renamingId, onChatTitleChange, selectedChat],
  );

  // INTERACTION — Delete
  const handleDeleteRequest = useCallback(
    (id: number) => {
      const chat = chats.find((c) => c.id === id);
      if (chat) setDeleteTarget(chat);
    },
    [chats],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      setChats((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  }, [deleteTarget]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col gap-[8px] items-start px-[16px] py-[12px] flex-1 overflow-hidden">
        {/* LAYOUT — New chat button */}
        <div
          className={`h-[32px] shrink-0 w-full rounded-[var(--radius-card)] cursor-pointer hover:bg-muted transition-colors ${selectedChat === -1 ? "bg-muted" : ""}`}
          onClick={() => { onSelectChat(-1); onChatTitleChange?.(null); }}
        >
          <div className="flex items-center size-full px-[6px] gap-[8px]">
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute inset-[8.33%]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6675">
                  <path d={svgPaths.p4d89000} fill="var(--secondary-foreground)" />
                </svg>
              </div>
            </div>
            <p
              className="text-secondary-foreground"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                fontWeight: 500,
                lineHeight: "1.5",
              }}
            >
              {CHAT_LIST.newChat}
            </p>
          </div>
        </div>

        {/* LAYOUT — Search chats button */}
        <div className="h-[32px] shrink-0 w-full rounded-[var(--radius-card)] cursor-pointer hover:bg-muted transition-colors">
          <div className="flex items-center size-full px-[6px] gap-[8px]">
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute inset-[11.46%_13.54%_13.54%_11.46%]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0003 15.0009">
                  <path d={svgPaths.p162ebe00} fill="var(--secondary-foreground)" />
                </svg>
              </div>
            </div>
            <p
              className="text-secondary-foreground"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                fontWeight: 500,
                lineHeight: "1.5",
              }}
            >
              {CHAT_LIST.searchChats}
            </p>
          </div>
        </div>

        {/* LAYOUT — Divider */}
        <div className="w-full shrink-0">
          <div className="bg-muted h-px w-full" />
        </div>

        {/* COPY — Recent chats label */}
        <p
          className="text-secondary-foreground w-full shrink-0"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semibold)",
            lineHeight: "1.5",
          }}
        >
          {CHAT_LIST.recentChats}
        </p>

        {/* LAYOUT — Chat list */}
        <div className="flex flex-col gap-[4px] items-start flex-1 overflow-y-auto w-full">
          {chats.map((chat) => (
            <ChatItemRow
              key={chat.id}
              chat={chat}
              isSelected={selectedChat === chat.id}
              isRenaming={renamingId === chat.id}
              onSelect={() => { onSelectChat(chat.id); onChatTitleChange?.(chat.title); }}
              onRename={handleRenameRequest}
              onDelete={handleDeleteRequest}
              onRenameCommit={handleRenameCommit}
            />
          ))}
        </div>
      </div>

      {/* LAYOUT — Collapse button */}
      <div className="shrink-0 w-full border-t border-muted">
        <div
          className="h-[40px] w-full cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={onCollapse}
        >
          <div className="flex items-center gap-[8px] px-[12px] size-full">
            <div className="relative shrink-0 size-[20px]">
              <div className="absolute inset-[16.67%_8.33%]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 13.3333">
                  <path d={svgPaths.p3fca0170} fill="var(--secondary-foreground)" />
                </svg>
              </div>
            </div>
            <p
              className="text-secondary-foreground whitespace-nowrap"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-normal)",
                lineHeight: "1.5",
              }}
            >
              {CHAT_LIST.collapse}
            </p>
          </div>
        </div>
      </div>

      {/* LAYOUT — Delete dialog */}
      {deleteTarget && (
        <DeleteDialog
          chatName={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}