import svgPaths from "../../imports/svg-javaskxvh1";
import svgPathsCollapsed from "../../imports/svg-rnh4o0zom3";
import svgPathsCatalog from "../../imports/svg-6et6q691ow";

interface CollapsedPanelStripProps {
  side: "left" | "right";
  onExpand: () => void;
}

export function CollapsedPanelStrip({ side, onExpand }: CollapsedPanelStripProps) {
  if (side === "left") {
    return (
      <button
        className="bg-background cursor-pointer relative rounded-[8px] shrink-0 w-[48px] h-full"
        onClick={onExpand}
      >
        <div className="flex flex-col items-start overflow-clip rounded-[inherit] size-full">
          <div className="flex flex-col flex-1 items-start min-h-0 overflow-clip w-full">
            <div className="flex-1 min-h-0 w-[48px]">
              <div className="flex flex-col items-center size-full">
                <div className="flex flex-col gap-[6px] items-center py-[12px] size-full">
                  {/* Top buttons */}
                  <div className="flex-1 min-h-0">
                    <div className="flex flex-col gap-[8px] h-full items-start">
                      {/* New chat icon */}
                      <div className="flex items-center justify-center rounded-[10px] shrink-0 size-[32px] hover:bg-muted transition-colors">
                        <div className="relative shrink-0 size-[20px]">
                          <div className="absolute inset-[8.33%]">
                            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6675">
                              <path d={svgPathsCollapsed.p4d89000} fill="var(--secondary-foreground)" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Search icon */}
                      <div className="flex items-center justify-center rounded-[10px] shrink-0 size-[32px] hover:bg-muted transition-colors">
                        <div className="relative shrink-0 size-[20px]">
                          <div className="absolute inset-[11.46%_13.54%_13.54%_11.46%]">
                            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0003 15.0009">
                              <path d={svgPathsCollapsed.p162ebe00} fill="var(--secondary-foreground)" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Expand button at bottom */}
                  <div className="rounded-[10px] shrink-0 size-[32px] flex items-center justify-center hover:bg-muted transition-colors">
                    <div className="relative shrink-0 size-[20px]">
                      <div className="overflow-clip rounded-[inherit] size-full">
                        <div className="absolute inset-[16.67%_8.33%]">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 13.3333">
                            <path d={svgPathsCollapsed.p2f2ce00} fill="var(--secondary-foreground)" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[8px]" />
      </button>
    );
  }

  // Right side - Catalog collapsed panel
  return (
    <button
      className="bg-background cursor-pointer relative rounded-[8px] shrink-0 w-[48px] h-full"
      onClick={onExpand}
    >
      <div className="flex flex-col items-start overflow-clip rounded-[inherit] size-full">
        <div className="flex flex-col flex-1 items-start min-h-0 overflow-clip w-full">
          <div className="flex-1 min-h-0 w-[48px]">
            <div className="flex flex-col items-center size-full">
              <div className="flex flex-col gap-[6px] items-center py-[12px] size-full">
                {/* Top button - Catalog icon */}
                <div className="flex-1 min-h-0">
                  <div className="flex flex-col gap-[8px] h-full items-start">
                    <div className="flex items-center justify-center rounded-[10px] shrink-0 size-[32px] hover:bg-muted transition-colors">
                      <div className="relative shrink-0 size-[20px]">
                        <div className="absolute inset-[8.33%]">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.75 16.6667">
                            <path d={svgPathsCatalog.p2a7adb80} fill="var(--secondary-foreground)" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Expand button at bottom */}
                <div className="rounded-[10px] shrink-0 size-[32px] flex items-center justify-center hover:bg-muted transition-colors">
                  <div className="relative shrink-0 size-[20px]">
                    <div className="absolute inset-[16.67%_8.33%]">
                      <svg className="absolute block size-full scale-x-[-1]" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
                        <path d={svgPathsCatalog.p27c55880} fill="var(--secondary-foreground)" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[8px]" />
    </button>
  );
}