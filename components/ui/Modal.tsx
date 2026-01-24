"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const [animate, setAnimate] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setAnimate(true);
    } else {
      document.body.style.overflow = "unset";
      setAnimate(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={cn(
            "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
            animate ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Content */}
      <div 
        className={cn(
            "relative w-full max-w-lg transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all duration-300 flex flex-col max-h-[90vh]",
            animate ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95",
            className
        )}
      >
        <div className="flex items-center justify-between mb-5 shrink-0">
          <h2 className="text-xl font-bold text-gray-900 leading-none">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto pr-1 -mr-1">
             {children}
        </div>
      </div>
    </div>
  );
}
