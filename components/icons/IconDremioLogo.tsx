import React from 'react';

// ICON — Dremio logo mark (concentric circles)
// Use in LeftNav header, loading screens, or anywhere the Dremio brand mark is needed.
// Size controls both width and height. The logo uses fixed brand colors (not currentColor).

interface IconDremioLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function IconDremioLogo({ size = 32, className, style }: IconDremioLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <circle cx="16" cy="16" r="16" fill="#2E3336" />
      <circle cx="16" cy="16" r="12" fill="#31D3DB" />
      <circle cx="16" cy="16" r="8" fill="#FFFFFE" />
      <circle cx="16" cy="16" r="4" fill="#2FA69F" />
    </svg>
  );
}
