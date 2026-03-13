import svgPaths from "../../imports/svg-javaskxvh1";

export function TopNav() {
  return (
    <div className="bg-background flex h-[48px] items-center justify-between px-[16px] py-[8px] shrink-0 w-full">
      <div className="bg-[var(--input-background)] flex gap-[8px] h-[32px] items-center px-[8px] relative rounded-[var(--radius-button)] shrink-0 w-[200px]">
        <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
        <p className="flex-1 font-['Inter',sans-serif] font-semibold leading-[150%] text-foreground text-[14px]">
          First Lakehouse
        </p>
        <div className="relative shrink-0 size-[24px]">
          <div className="absolute flex inset-[39.71%_28.25%_35.42%_28.25%] items-center justify-center">
            <div className="flex-none h-[5.969px] rotate-180 w-[10.44px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.4397 5.96941">
                <path d={svgPaths.p348f4800} fill="var(--secondary-foreground)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bg-[var(--input-background)] flex gap-[4px] h-[32px] items-center px-[8px] rounded-[var(--radius-button)] w-[525px]">
        <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[var(--radius-button)]" />
        <div className="relative shrink-0 size-[24px]">
          <div className="absolute inset-[11.46%_13.54%_13.54%_11.46%]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.0003 18.0011">
              <path d={svgPaths.p296b5100} fill="var(--secondary-foreground)" />
            </svg>
          </div>
        </div>
        <p className="flex-1 font-['Inter',sans-serif] font-normal leading-[150%] text-secondary-foreground text-[14px]">
          Search data, scripts, recent jobs and more...
        </p>
      </div>
    </div>
  );
}
