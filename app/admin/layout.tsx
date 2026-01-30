"use client";
import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

const useUser = () => {
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch(() => setUserData({
        firstName: "Deepanshu",
        lastName: "Joshi",
        profileImage: null,
        role: "ADMIN"
      }));
  }, []);
  return userData;
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false); 
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F7F7]">
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[82px] bg-black flex flex-col items-center py-4 px-2 shrink-0 transition-transform duration-300 lg:relative lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mb-6 px-1">
          <Image src="/logo.svg" alt="JLS" width={56} height={28} priority />
        </div>

        <nav className="flex flex-col w-full gap-2">
          <NavItem href="/admin/quotes" iconPath="/admin/quotes.svg" active />
          <NavItem href="/admin/reservations" iconPath="/admin/reservations.svg" />
          <NavItem href="/admin/dispatch" iconPath="/admin/dispatch.svg" />
          <NavItem href="/admin/chauffeur" iconPath="/admin/chauffeur.svg" />
          <NavItem href="/admin/invoices" iconPath="/admin/invoice.svg" />
          <NavItem href="/admin/settings" iconPath="/admin/settings.svg" />
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <header className="h-[64px] bg-white shadow flex items-center justify-between px-4 lg:px-6 shrink-0 gap-4">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <div className="w-6 h-0.5 bg-black mb-1"></div>
            <div className="w-6 h-0.5 bg-black mb-1"></div>
            <div className="w-6 h-0.5 bg-black"></div>
          </button>

          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[450px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Image src="/admin/search.svg" alt="Search" width={16} height={16} />
              </span>
              <input
                type="text"
                placeholder="Search"
                className="w-full h-[38px] rounded-full bg-[#F2F2F2] pl-10 pr-4 text-sm outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <button 
              onClick={() => setChatOpen(true)}
              className="h-9 w-9 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
            >
              <Image src="/admin/notification.svg" alt="Notification" width={34} height={34} />
            </button>

            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                  <img
                    src={user?.profileImage || "/admin/profile.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className={`hidden sm:block transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <Image src="/admin/bottom-arrow.svg" alt="Arrow" width={10} height={10} />
                </span>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-[999]">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-sm font-bold text-black truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">Admin</p>
                  </div>

                  <Link 
                    href="/admin/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Logout Clicked");
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-white">{children}</main>
      </div>

      {isChatOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-[1000]" 
            onClick={() => setChatOpen(false)}
          />
          
          <div className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-white z-[1001] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-lg font-bold">Chat</h2>
              <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="p-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7" cy="7" r="5"/><path d="m11 11 4 4"/></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search name or number" 
                  className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="flex flex-col py-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">(808) 436-6182</span>
                      <span className="bg-red-500 text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full">2</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Today at 11:23 AM</span>
                  </div>
                  <p className="text-sm text-gray-500">Okay i reserved it!</p>
                </div>
              ))}
            </div>

            <div className="p-4 flex gap-3 border-t border-gray-100">
              <button 
                onClick={() => setChatOpen(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 bg-black text-white rounded-xl font-medium text-sm hover:opacity-90">
                Compose
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NavItem({ href, iconPath, active = false }: { href: string; iconPath: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center justify-center w-full h-[56px] lg:h-[64px] transition-all rounded-xl ${
        active ? "bg-white/10" : "bg-transparent opacity-60 hover:opacity-100"
      }`}
    >
      <div className="relative w-20 h-20">
        <Image src={iconPath} alt="nav-icon" fill className="object-contain" />
      </div>
    </Link>
  );
}