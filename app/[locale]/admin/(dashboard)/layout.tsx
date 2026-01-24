"use client";

import React, { useState } from "react";
import { Link, usePathname } from "@/lib/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import { 
  LayoutDashboard, 
  Printer, 
  Package, 
  Headset, 
  FileText, 
  Settings, 
  Menu,
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/print-orders", label: "Print Orders", icon: Printer },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/virtual-assistance", label: "Virtual Assist", icon: Headset },
  { href: "/admin/resumes", label: "Resumes", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden glass-blur"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
           <span className="font-bold text-xl tracking-tight text-teal-700">Admin</span>
           <button 
             className="ml-auto lg:hidden text-gray-500"
             onClick={() => setSidebarOpen(false)}
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-teal-50 text-teal-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-teal-600" : "text-gray-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
           <LogoutButton className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
         {/* Mobile Header */}
         <header className="lg:hidden h-16 flex items-center px-4 bg-white border-b border-gray-200 sticky top-0 z-30">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="ml-3 font-semibold">Admin Panel</span>
         </header>

         {/* Content Scroll Area */}
         <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
               {children}
            </div>
         </main>
      </div>
    </div>
  );
}
