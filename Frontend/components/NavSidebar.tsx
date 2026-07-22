"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mockUser } from "@/lib/mock-data";
import { motion } from "framer-motion";

export function NavSidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const studentLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "#", label: "Modules", icon: "menu_book" }, // Note: /modules is not a requested screen to convert, but part of UI
    { href: "/study-plan", label: "Study Tools", icon: "architecture" },
    { href: "#", label: "Resources", icon: "folder_open" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "#", label: "Students", icon: "group" },
    { href: "#", label: "Performance", icon: "analytics" },
    { href: "#", label: "Reports", icon: "assignment" },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="hidden md:flex flex-col h-full w-64 bg-surface-container-low border-r border-outline-variant py-lg px-md shrink-0 sticky top-0">
      <div className="mb-xl px-sm">
        <h1 className="font-headline-md text-headline-md font-black text-on-surface tracking-tighter">Pathwise</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70 uppercase tracking-widest mt-1">
          {isAdmin ? "Admin Portal" : "Student Portal"}
        </p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link key={link.href} href={link.href} passHref>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors duration-150 ${
                  isActive
                    ? "bg-secondary-fixed text-on-secondary-fixed-variant font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-label-md text-label-md">{link.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-lg border-t border-outline-variant space-y-4">
        {!isAdmin && (
          <Link href="/profile" passHref>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors duration-150 ${
                pathname === "/profile" ? "bg-secondary-fixed text-on-secondary-fixed-variant font-bold" : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-md text-label-md">Settings</span>
            </motion.div>
          </Link>
        )}
        
        {isAdmin && (
          <div className="flex items-center gap-3 px-3">
             <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhGFft9t-Gu9vsJ8fgU98BYKfY4FHAA1TcJB1uuKTEs0OH1OMSy1DBrcpeZbmqDU6MGV_CWScV-xkLGq9bEpmOQzEN4ThoUfnRGJ19x1Z2esyaTiPOnkxbGC9-UUyIMJ6btLy0UA3PEEWh_U_PuLdMoydIb-D302onlJxviBNYjgP5l7_q3lukajO23-bIyKvBzivwcVW9GzLJcThMrqF8CV1k3vb9WgEh1phYSb3STqQsrD0NTCKsN9E8qpsFdj1D2Rf-qz-dMz1S" alt="Admin" />
             </div>
             <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-on-surface">Dr. Sarah Chen</span>
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Administrator</span>
             </div>
          </div>
        )}

        {!isAdmin && (
          <div className="p-3 mt-md flex items-center gap-3 bg-surface-container-high rounded-xl border border-outline-variant">
            <img className="w-10 h-10 rounded-full border border-primary object-cover" src={mockUser.avatar} alt={mockUser.name} />
            <div className="overflow-hidden">
              <p className="font-label-md text-label-md font-bold truncate">{mockUser.name}</p>
              <p className="text-[10px] text-on-surface-variant opacity-70">{mockUser.major}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
