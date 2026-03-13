// COMPONENT — Left navigation sidebar
// Portable version: no Figma svgPaths imports — uses icon components from ./icons/
// Background: var(--sidebar) (#2A394A dark navy) — NOT var(--background)
// Nav items: icon + label text. Active item: accent color + tinted bg.

import { IconDremioLogo } from "./icons/IconDremioLogo";
import { UserAvatar } from "./UserAvatar";
import { IconNavHome } from "./icons/IconNavHome";
import { IconAiAgent } from "./icons/IconAiAgent";
import { IconNavCatalog } from "./icons/IconNavCatalog";
import { IconNavSqlRunner } from "./icons/IconNavSqlRunner";
import { IconNavSemanticLayer } from "./icons/IconNavSemanticLayer";
import { IconNavSettings } from "./icons/IconNavSettings";
import { IconNavHelp } from "./icons/IconNavHelp";
import { IconNavExpandMenu } from "./icons/IconNavExpandMenu";

// LAYOUT — Dremio logo mark — uses IconDremioLogo from ./icons/
function Logo() {
  return (
    <div className="flex items-center justify-center w-full px-[8px] py-[16px]">
      <IconDremioLogo size={32} />
    </div>
  );
}

// LAYOUT — Props
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasBackground?: boolean;
  bgColor?: string;
}

// LAYOUT — Single nav item (icon + label)
function NavItem({ icon, label, active, hasBackground, bgColor }: NavItemProps) {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full cursor-pointer">
      <div
        className="flex items-center justify-center shrink-0 rounded-[8px]"
        style={{
          padding: "4px",
          backgroundColor: hasBackground ? bgColor : "transparent",
        }}
      >
        <div className="flex items-center justify-center shrink-0 size-[24px]">
          {icon}
        </div>
      </div>
      <p
        className="font-['Inter',sans-serif] text-[12px] text-center w-full px-[4px]"
        style={{
          fontFeatureSettings: "'cv08', 'lnum', 'tnum'",
          fontWeight: active ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
          color: active ? "var(--accent)" : "var(--sidebar-foreground)",
          lineHeight: "14px",
          opacity: active ? 1 : 0.7,
        }}
      >
        {label}
      </p>
    </div>
  );
}

// LAYOUT — LeftNav props
export type LeftNavItem = "home" | "ai-agent" | "catalog" | "sql" | "semantic-layer" | "admin";

interface LeftNavProps {
  /** Which nav item is currently active. Defaults to "ai-agent". */
  activeItem?: LeftNavItem;
  /** User initials shown in the avatar at the bottom. Defaults to "TS". */
  userInitials?: string;
  /** Called when a nav item is clicked, with its item key. */
  onNavigate?: (item: LeftNavItem) => void;
}

// Icon components only accept size/className — not style. Wrap in a span so
// currentColor + opacity apply correctly via CSS inheritance.
function IconWrapper({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "flex",
        color: active ? "var(--accent)" : "var(--sidebar-foreground)",
        opacity: active ? 1 : 0.7,
      }}
    >
      {children}
    </span>
  );
}

// LAYOUT — Main nav container
// ⚠️ Background MUST be var(--sidebar) (#2A394A dark navy), NOT var(--background).
export function LeftNav({ activeItem = "ai-agent", userInitials = "TS", onNavigate }: LeftNavProps = {}) {
  const isActive = (item: LeftNavItem) => activeItem === item;

  return (
    <div
      className="flex flex-col items-center justify-between shrink-0 w-[64px] h-full"
      style={{ background: "var(--sidebar)" }}
    >
      {/* Top section: logo + nav items */}
      <div className="flex flex-col gap-[8px] items-center shrink-0 w-full">
        <Logo />
        <div className="flex flex-col gap-[16px] items-center w-full px-[4px]">
          {/* Home */}
          <div onClick={() => onNavigate?.("home")} className="w-full">
            <NavItem
              label="Home"
              active={isActive("home")}
              hasBackground={isActive("home")}
              bgColor="rgba(33, 132, 128, 0.2)"
              icon={<IconWrapper active={isActive("home")}><IconNavHome size={20} /></IconWrapper>}
            />
          </div>
          {/* AI Agent */}
          <div onClick={() => onNavigate?.("ai-agent")} className="w-full">
            <NavItem
              label="AI Agent"
              active={isActive("ai-agent")}
              hasBackground={isActive("ai-agent")}
              bgColor="rgba(33, 132, 128, 0.2)"
              icon={<IconWrapper active={isActive("ai-agent")}><IconAiAgent size={20} /></IconWrapper>}
            />
          </div>
          {/* Catalog */}
          <div onClick={() => onNavigate?.("catalog")} className="w-full">
            <NavItem
              label="Catalog"
              active={isActive("catalog")}
              hasBackground={isActive("catalog")}
              bgColor="rgba(33, 132, 128, 0.2)"
              icon={<IconWrapper active={isActive("catalog")}><IconNavCatalog size={20} /></IconWrapper>}
            />
          </div>
          {/* SQL Runner */}
          <div onClick={() => onNavigate?.("sql")} className="w-full">
            <NavItem
              label="SQL"
              active={isActive("sql")}
              hasBackground={isActive("sql")}
              bgColor="rgba(33, 132, 128, 0.2)"
              icon={<IconWrapper active={isActive("sql")}><IconNavSqlRunner size={20} /></IconWrapper>}
            />
          </div>
          {/* Semantic Layer */}
          <div onClick={() => onNavigate?.("semantic-layer")} className="w-full">
            <NavItem
              label="Semantic Layer"
              active={isActive("semantic-layer")}
              hasBackground={isActive("semantic-layer")}
              bgColor="rgba(33, 132, 128, 0.2)"
              icon={<IconWrapper active={isActive("semantic-layer")}><IconNavSemanticLayer size={20} /></IconWrapper>}
            />
          </div>
          {/* Admin */}
          <div onClick={() => onNavigate?.("admin")} className="w-full">
            <NavItem
              label="Admin"
              active={isActive("admin")}
              hasBackground={isActive("admin")}
              bgColor="rgba(33, 132, 128, 0.2)"
              icon={<IconWrapper active={isActive("admin")}><IconNavSettings size={20} /></IconWrapper>}
            />
          </div>
        </div>
      </div>

      {/* Bottom section: help, avatar initials, expand toggle */}
      <div className="flex flex-col gap-[4px] items-center pb-[8px] px-[8px] w-full">
        {/* Help */}
        <div className="flex items-center justify-center p-[4px] cursor-pointer">
          <div className="flex items-center justify-center shrink-0 size-[24px]">
            <span style={{ display: "flex", color: "var(--sidebar-foreground)", opacity: 0.7 }}>
              <IconNavHelp size={20} />
            </span>
          </div>
        </div>
        {/* Avatar — initials from prop */}
        <div className="flex items-center justify-center p-[4px]">
          <UserAvatar initials={userInitials} size={24} />
        </div>
        {/* Expand/collapse nav */}
        <div className="flex items-center justify-center p-[4px] cursor-pointer">
          <div className="flex items-center justify-center shrink-0 size-[24px]">
            <span style={{ display: "flex", color: "var(--sidebar-foreground)", opacity: 0.7 }}>
              <IconNavExpandMenu size={20} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}