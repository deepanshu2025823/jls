"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const services = [
  "City-To-City Rides",
  "Chauffeur Hailing",
  "Airport Transfers",
  "Hourly Hire",
  "Chauffeur Services",
  "Limousine Services",
];

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ✅ Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("jls_token");
    const user = localStorage.getItem("jls_user");
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserEmail(userData.email || "");
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ✅ Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("jls_token");
    localStorage.removeItem("jls_user");
    setIsLoggedIn(false);
    setUserEmail("");
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  // ✅ Get user initials for avatar
  const getUserInitial = () => {
    if (userEmail) {
      return userEmail.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">

          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="JLS"
              width={70}
              height={32}
              priority
              className="cursor-pointer sm:w-[90px] sm:h-[40px]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-white text-sm">
            {/* Services */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setOpen(true)}
            >
              <button className="flex items-center gap-1 hover:text-gray-300 transition-colors whitespace-nowrap">
                Services <span className="text-xs">▾</span>
              </button>

              {open && (
                <div className="absolute top-full mt-3 w-64 bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden">
                  {services.map((item) => (
                    <div
                      key={item}
                      className="px-5 py-3 text-sm text-white/90 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a className="hover:text-gray-300 transition-colors cursor-pointer whitespace-nowrap">For Chauffeurs</a>
            <a className="hover:text-gray-300 transition-colors cursor-pointer">About</a>
            <a className="hover:text-gray-300 transition-colors cursor-pointer whitespace-nowrap">Contact Us</a>
            <a className="hover:text-gray-300 transition-colors cursor-pointer">Blogs</a>
          </nav>

          {/* Desktop Auth Button */}
          {!isLoggedIn ? (
            <Link href="/login">
              <button className="hidden lg:flex items-center gap-2 border border-white/60 text-white px-4 xl:px-5 py-2.5 xl:py-3 rounded-full text-sm hover:bg-white/10 transition-all whitespace-nowrap">
                <Image src="/icons/account.svg" alt="" width={18} height={18} />
                Sign In
              </button>
            </Link>
          ) : (
            <div className="hidden lg:block relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 xl:gap-3 border border-white/60 text-white px-3 xl:px-4 py-2 xl:py-2.5 rounded-full text-sm hover:bg-white/10 transition-all"
              >
                <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
                  {getUserInitial()}
                </div>
                <span className="max-w-[100px] xl:max-w-[150px] truncate">{userEmail}</span>
                <span className="text-xs">▾</span>
              </button>

              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-[#1a1a1a] rounded-xl shadow-xl overflow-hidden">
                  <Link href="/bookings">
                    <div className="px-5 py-3 text-sm text-white/90 hover:bg-white/10 cursor-pointer transition-colors">
                      My Bookings
                    </div>
                  </Link>
                  <Link href="/profile">
                    <div className="px-5 py-3 text-sm text-white/90 hover:bg-white/10 cursor-pointer transition-colors">
                      Profile
                    </div>
                  </Link>
                  <div className="border-t border-white/10"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button
            className="lg:hidden text-white text-2xl p-2 hover:bg-white/10 rounded-lg transition-all"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black z-[100] text-white overflow-y-auto">
          <div className="min-h-full p-4 sm:p-6 flex flex-col">

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 sm:mb-10">
              <Image 
                src="/logo.svg" 
                alt="JLS" 
                width={70} 
                height={32}
                className="sm:w-[90px] sm:h-[40px]"
              />
              <button
                className="text-2xl sm:text-3xl p-2 hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* User Info (if logged in) */}
            {isLoggedIn && (
              <div className="mb-6 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0">
                    {getUserInitial()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-white/60">Logged in as</p>
                    <p className="font-medium truncate text-sm sm:text-base">{userEmail}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu */}
            <div className="flex-1 space-y-4 sm:space-y-6 text-base sm:text-lg">

              {/* Services */}
              <button
                onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
                className="flex justify-between w-full hover:text-gray-300 transition-colors py-2"
              >
                Services <span className={`transition-transform ${mobileServiceOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {mobileServiceOpen && (
                <div className="pl-3 sm:pl-4 space-y-2 sm:space-y-3 text-white/80 text-sm sm:text-base">
                  {services.map((item) => (
                    <div 
                      key={item} 
                      className="cursor-pointer hover:text-white transition-colors py-1.5"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}

              <div className="cursor-pointer hover:text-gray-300 transition-colors py-2">For Chauffeurs</div>
              <div className="cursor-pointer hover:text-gray-300 transition-colors py-2">About</div>
              <div className="cursor-pointer hover:text-gray-300 transition-colors py-2">Contact Us</div>
              <div className="cursor-pointer hover:text-gray-300 transition-colors py-2">Blogs</div>

              {/* Mobile User Menu Items */}
              {isLoggedIn && (
                <>
                  <div className="border-t border-white/20 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                    <Link href="/bookings" onClick={() => setMobileOpen(false)}>
                      <div className="cursor-pointer hover:text-gray-300 transition-colors py-2">
                        My Bookings
                      </div>
                    </Link>
                    <Link href="/profile" onClick={() => setMobileOpen(false)}>
                      <div className="cursor-pointer hover:text-gray-300 transition-colors py-2">
                        Profile
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Auth Button */}
            {!isLoggedIn ? (
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <button className="mt-6 sm:mt-10 border border-white/40 rounded-full py-3 sm:py-4 flex items-center justify-center gap-2 hover:bg-white/10 transition-all w-full text-sm sm:text-base">
                  <Image src="/icons/account.svg" alt="" width={18} height={18} />
                  Sign In
                </button>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="mt-6 sm:mt-10 border border-red-400/40 text-red-400 rounded-full py-3 sm:py-4 flex items-center justify-center gap-2 hover:bg-red-400/10 transition-all w-full text-sm sm:text-base"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}