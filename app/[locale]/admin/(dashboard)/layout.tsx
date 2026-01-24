import React from "react";
import { Link } from "@/lib/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 border-b border-gray-100">
            <div className="font-bold text-xl tracking-tight text-gray-900">
              Admin Dashboard
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                Logged in
              </span>
              <LogoutButton />
            </div>
          </div>
          <nav className="flex space-x-8 py-3 -mb-px">
            <Link
              href="/admin/resumes"
              className="text-sm font-medium hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 pb-3 transition-all"
            >
              Resume Builder
            </Link>
            <Link
              href="/admin/virtual-assistance"
              className="text-sm font-medium hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 pb-3 transition-all"
            >
              Virtual Assistance
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
