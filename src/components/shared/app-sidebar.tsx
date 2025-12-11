"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Calendar, Users, FileDigit, Settings, LogOut } from "lucide-react";

interface AppSidebarProps {
  className?: string;
  onClose?: () => void; 
}

export default function AppSidebar({ className = "", onClose }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  
  const links = [
    { href: "/dentist", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dentist/schedule", label: "Schedule", icon: Calendar },
    { href: "/dentist/patients", label: "Patients", icon: Users },
    { href: "/dentist/xray-lab", label: "X-Ray Lab", icon: FileDigit },
    { href: "/dentist/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={`flex h-full flex-col bg-white text-gray-900 border-r ${className}`}>
      <div className="flex h-16 items-center justify-between border-b px-4 flex-shrink-0">
        <span className="text-xl font-bold text-blue-600">Dental Clinic</span>
        
        {/* Close Button - Visible on ALL screens now */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors"
            title="Close Sidebar"
          >
             <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              // Optional: If you want clicking a link to close the sidebar on mobile ONLY, keep the check.
              // If you want it to stay open on desktop, we might need to conditionally call onClose.
              // For now, I'll leave it to close on mobile overlay, but typically desktop persistent sidebar stays open.
              // Since you requested "Cross sign to close it", maybe you want it to stay open until explicitly closed?
              // I will NOT attach onClose here for desktop, only mobile overlay handles this usually.
              // But since we are sharing the component, let's just let the user decide via the Cross button.
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-blue-600" : "text-gray-400"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t p-4 flex-shrink-0">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
