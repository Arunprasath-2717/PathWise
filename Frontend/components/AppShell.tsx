import React from "react";
import { NavSidebar } from "./NavSidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <NavSidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden pb-16 md:pb-0">
        {children}
      </div>
      
      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-outline-variant flex justify-around items-center z-20">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="text-[10px] font-medium">Modules</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">timer</span>
          <span className="text-[10px] font-medium">Focus</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
}
