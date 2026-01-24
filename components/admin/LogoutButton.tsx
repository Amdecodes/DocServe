"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
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
      className="text-red-600 hover:text-red-700 cursor-pointer font-medium transition-colors text-sm"
    >
      Logout
    </button>
  );
}
