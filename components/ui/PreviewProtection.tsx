"use client";

import React from "react";
import { cn } from "@/lib/utils";
import disableDevtool from "disable-devtool";

interface PreviewProtectionProps {
  children: React.ReactNode;
  className?: string;
  isPaid?: boolean;
}

export function PreviewProtection({
  children,
  className,
  isPaid = false,
}: PreviewProtectionProps) {
  React.useEffect(() => {
    if (isPaid) return;

    // Basic DevTools and copy protection
    disableDevtool({
      clearIntervalWhenDevOpenTrigger: true,
      disableMenu: true,
      clearLog: true,
      disableSelect: true,
      disableCopy: true,
      disableCut: true,
      disablePaste: true,
    });
  }, [isPaid]);

  // If paid, render children without any protection overlay
  if (isPaid) {
    return <>{children}</>;
  }

  return (
    <div 
      className={cn("relative", className)}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {/* Logo Watermark Pattern - Dense repeating pattern across all pages */}
      <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden select-none">
        <div className="absolute inset-x-[-50%] inset-y-[-50%] flex flex-wrap items-center justify-center gap-16 origin-center -rotate-[25deg] scale-125">
          {Array.from({ length: 150 }).map((_, i) => (
            <img 
              key={i}
              src="/images/Logo/senedx logo.svg" 
              alt="" 
              className="w-32 h-32 object-contain select-none opacity-[0.15] scale-110"
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
