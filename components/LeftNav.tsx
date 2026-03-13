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

// LAYOUT — Main nav container
// ⚠️ Background MUST be var(--sidebar) (#2A394A dark navy), NOT var(--background).
export function LeftNav() {
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
          <NavItem
            label="Home"
            icon={<IconNavHome size={20} style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }} />}
          />
          {/* AI Agent — active state */}
          <NavItem
            label="AI Agent"
            active
            hasBackground
            bgColor="rgba(33, 132, 128, 0.2)"
            icon={<IconAiAgent size={20} style={{ color: "var(--accent)" }} />}
          />
          {/* Catalog */}
          <NavItem
            label="Catalog"
            icon={<IconNavCatalog size={20} style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }} />}
          />
          {/* SQL Runner */}
          <NavItem
            label="SQL"
            icon={<IconNavSqlRunner size={20} style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }} />}
          />
          {/* Semantic Layer */}
          <NavItem
            label="Semantic Layer"
            icon={<IconNavSemanticLayer size={20} style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }} />}
          />
          {/* Admin */}
          <NavItem
            label="Admin"
            icon={<IconNavSettings size={20} style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }} />}
          />
        </div>
      </div>

      {/* Bottom section: help, avatar initials, expand toggle */}
      <div className="flex flex-col gap-[4px] items-center pb-[8px] px-[8px] w-full">
        {/* Help */}
        <div className="flex items-center justify-center p-[4px] cursor-pointer">
          <div className="flex items-center justify-center shrink-0 size-[24px]">
            <IconNavHelp size={20} style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }} />
          </div>
        </div>
        {/* Avatar — initials circle */}
        <div className="flex items-center justify-center p-[4px]">
          <UserAvatar initials="TS" size={24} />
        </div>
        {/* Expand/collapse nav */}
        <div className="flex items-center justify-center p-[4px] cursor-pointer">
          <div className="flex items-center justify-center shrink-0 size-[24px]">
            <IconNavExpandMenu size={20} style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }} />
          </div>
        </div>
      </div>
    </div>
  );
}