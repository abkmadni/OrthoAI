"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Calendar, Users, FileDigit, Settings, LogOut, Sun, Moon } from "lucide-react";
import { branding, navigation } from "@/config/branding";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AppSidebarProps {
  className?: string;
  onClose?: () => void; 
}

// Map string icon names to components
const iconMap: any = {
  LayoutDashboard,
  Calendar,
  Users,
  FileDigit,
  Settings,
  LogOut
};

export default function AppSidebar({ className = "", onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;
  
  return (
    <div className={`flex h-full flex-col bg-background text-foreground border-r border-border ${className}`}>
      <div className="flex h-16 items-center justify-end border-b border-border px-4 flex-shrink-0">
        {/* Close Button - Visible on ALL screens now */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:bg-secondary p-1 rounded transition-colors"
            title="Close Sidebar"
          >
             <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.sidebar.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-border p-4 flex-shrink-0 space-y-2">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        )}

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
