"use client";
import { SignOutButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <SignOutButton>
      <button
        className={cn(
          "text-red-600 hover:text-red-700 cursor-pointer font-medium transition-colors text-sm px-3 py-2 rounded-lg flex items-center gap-3",
          className,
        )}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </SignOutButton>
  );
}
