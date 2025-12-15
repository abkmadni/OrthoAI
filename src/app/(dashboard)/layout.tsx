"use client"

import { useState } from "react";
import AppSidebar from "@/components/shared/app-sidebar";
import { Menu } from "lucide-react";
import { branding } from "@/config/branding";
import { RoleProvider } from "@/components/providers/role-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State for Desktop Sidebar
  const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  // State for Mobile Sidebar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <RoleProvider>
    <div className="flex min-h-screen w-full bg-gray-50 relative">
      
      {/* --- MOBILE SIDEBAR (Overlay) --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] bg-white h-full shadow-xl animate-in slide-in-from-left duration-200">
            {/* Mobile Sidebar has Close Button */}
            <AppSidebar onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR (Push/Collapse) --- */}
      {/* Only render the container if open or animating. For simplicity, we use CSS transform. */}
      <aside 
        className={`hidden md:block fixed inset-y-0 z-30 transition-all duration-300 border-r bg-white overflow-hidden shadow-lg ${
          isDesktopSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full opacity-0"
        }`}
      >
         <div className="w-64 h-full"> 
            {/* Desktop Sidebar has Close Button */}
            <AppSidebar onClose={() => setDesktopSidebarOpen(false)} />
         </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isDesktopSidebarOpen ? "md:ml-64" : "md:ml-0"
        }`}
      >
        {/* HEADER */}
        <header className="flex items-center justify-between h-16 px-4 border-b bg-white sticky top-0 z-20">
           <div className="flex items-center gap-3">
             
             {/* HAMBURGER BUTTON */}
             {/* Only visible if the sidebar is CLOSED (Desktop) or ALWAYS on Mobile (since mobile sidebar is overlay) */}
             {/* Logic: 
                 - Mobile: Always show (unless menu open, but menu is overlay so z-index covers it) 
                 - Desktop: Show ONLY if !isDesktopSidebarOpen 
             */}
             <button 
               onClick={() => {
                 if (window.innerWidth < 768) {
                   setIsMobileMenuOpen(true);
                 } else {
                   setDesktopSidebarOpen(true);
                 }
               }}
               className={`p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                 // Hide on desktop if sidebar is open
                 isDesktopSidebarOpen ? "md:hidden" : "block"
               }`}
             >
               <Menu className="w-6 h-6" />
             </button>
             
             {/* Branding / Logo */}
             {(branding.logo as any).image ? (
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={(branding.logo as any).image} alt={branding.logo.text} className="h-8 w-auto object-contain" />
                  <span className="text-xl font-bold text-primary">{branding.logo.text}</span>
                </div>
             ) : (
               <span className="text-xl font-bold text-primary">{branding.logo.text}</span>
             )}
           </div>

           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                DR
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
    </RoleProvider>
  );
}