"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={cn("text-red-600 hover:text-red-700 cursor-pointer font-medium transition-colors text-sm px-3 py-2 rounded-lg flex items-center gap-3", className)}
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}

