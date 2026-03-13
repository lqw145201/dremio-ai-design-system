import svgPaths from "../../imports/svg-vf3gc3o0dr";

function Logo() {
  return (
    <div className="flex items-center justify-center w-full px-[8px] py-[16px]">
      <div className="relative shrink-0 size-[32px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g>
            <path clipRule="evenodd" d={svgPaths.p19d87680} fill="var(--fill-0, #2E3336)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p12125e00} fill="var(--fill-0, #31D3DB)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p3669f700} fill="var(--fill-0, #FFFFFE)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p13ef2600} fill="var(--fill-0, #31D3DB)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p2421cc00} fill="var(--fill-0, #2E3336)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p3499a00} fill="var(--fill-0, #31D3DB)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p6850c80} fill="var(--fill-0, #FFFFFE)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p5d891c0} fill="var(--fill-0, #2FA69F)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p266ef980} fill="var(--fill-0, #2FA69F)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p3819ed20} fill="var(--fill-0, #2FA69F)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p2c5af500} fill="var(--fill-0, #2FA69F)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p310a8980} fill="var(--fill-0, #2FA69F)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.pcfb7380} fill="var(--fill-0, #2FA69F)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p37de5580} fill="var(--fill-0, #2FA69F)" fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasBackground?: boolean;
  bgColor?: string;
}

function NavItem({ icon, label, active, hasBackground, bgColor }: NavItemProps) {
  return (
    <div className="flex flex-col gap-[4px] items-center w-full">
      <div
        className="flex items-center justify-center shrink-0 rounded-[8px]"
        style={{
          padding: "4px",
          backgroundColor: hasBackground ? bgColor : "transparent",
        }}
      >
        {/* flex container — icon is sized naturally; no forced square that distorts proportions */}
        <div className="flex items-center justify-center shrink-0 size-[24px]">
          {icon}
        </div>
      </div>
      <p
        className="font-['Inter',sans-serif] text-[12px] text-center w-full px-[4px]"
        style={{
          fontFeatureSettings: "'cv08', 'lnum', 'tnum'",
          fontWeight: active ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
          color: active ? "var(--accent)" : "var(--foreground)",
          lineHeight: "14px",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export function LeftNav() {
  return (
    <div className="bg-background flex flex-col items-center justify-between shrink-0 w-[64px] h-full">
      {/* Top section */}
      <div className="flex flex-col gap-[8px] items-center shrink-0 w-full">
        <Logo />
        <div className="flex flex-col gap-[16px] items-center w-full">
          {/* Home — viewBox 18×19.49, render at natural proportions */}
          <NavItem
            label="Home"
            icon={<svg fill="none" viewBox="0 0 18 19.4945" width="18" height="19">
              <path d={svgPaths.p156b49c0} fill="var(--secondary-foreground)" />
            </svg>}
          />
          {/* AI Agent - active — viewBox ~20×20 */}
          <NavItem
            label="AI Agent"
            active
            hasBackground
            bgColor="rgba(33, 132, 128, 0.1)"
            icon={<svg fill="none" viewBox="0 0 19.9067 19.9056" width="20" height="20">
              <path d={svgPaths.p3d8e2800} fill="var(--accent)" />
            </svg>}
          />
          {/* Catalog — viewBox 20×16, wider than tall */}
          <NavItem
            label="Catalog"
            icon={<svg fill="none" viewBox="0 0 20 16" width="20" height="16">
              <path clipRule="evenodd" d={svgPaths.p37aae100} fill="var(--secondary-foreground)" fillRule="evenodd" />
            </svg>}
          />
          {/* SQL — viewBox 20×16 */}
          <NavItem
            label="SQL"
            icon={<svg fill="none" viewBox="0 0 20 16" width="20" height="16">
              <path d={svgPaths.p35ae5e80} fill="var(--secondary-foreground)" />
              <path d={svgPaths.p90a2780} fill="var(--secondary-foreground)" />
              <path clipRule="evenodd" d={svgPaths.p350c4d00} fill="var(--secondary-foreground)" fillRule="evenodd" />
            </svg>}
          />
          {/* Semantic Layer — viewBox ~20×20 */}
          <NavItem
            label="Sematic Layer"
            icon={<svg fill="none" viewBox="0 0 19.9996 20.0119" width="20" height="20">
              <path d={svgPaths.p2876bf70} fill="var(--secondary-foreground)" />
            </svg>}
          />
          {/* Admin — viewBox 18.72×19.5 */}
          <NavItem
            label="Admin"
            icon={<svg fill="none" viewBox="0 0 18.7241 19.4995" width="19" height="19">
              <path d={svgPaths.p1258cf0} fill="var(--secondary-foreground)" />
            </svg>}
          />
        </div>
      </div>
      {/* Bottom section */}
      <div className="flex flex-col gap-[4px] items-center pb-[8px] px-[8px] w-full">
        {/* Help — viewBox 20×20 */}
        <div className="flex items-center justify-center p-[4px]">
          <div className="flex items-center justify-center shrink-0 size-[24px]">
            <svg fill="none" viewBox="0 0 20 20" width="20" height="20">
              <path d={svgPaths.pd9a5200} fill="var(--secondary-foreground)" />
            </svg>
          </div>
        </div>
        {/* Avatar */}
        <div className="flex items-center justify-center p-[4px]">
          <div className="relative shrink-0 size-[24px]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" fill="var(--primary)" r="12" />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center font-['Inter',sans-serif] text-foreground text-[12px]"
              style={{ fontFeatureSettings: "'cv08', 'lnum', 'tnum'", fontWeight: "var(--font-weight-semibold)" as any }}
            >
              TS
            </div>
          </div>
        </div>
        {/* Expand menu — viewBox 20×16, wider than tall */}
        <div className="flex items-center justify-center p-[4px]">
          <div className="flex items-center justify-center shrink-0 size-[24px]">
            <svg fill="none" viewBox="0 0 20 16" width="20" height="16">
              <path d={svgPaths.p27c55880} fill="var(--secondary-foreground)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}