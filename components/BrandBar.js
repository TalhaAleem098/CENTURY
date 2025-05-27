"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaUserCircle, FaShoppingCart, FaBars } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import gsap from "gsap";

const BrandBar = ({ onToggleSidebar }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const timerRef = useRef(null);

  const closeSearch = () => setShowSearch(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showSearch) {
      gsap.fromTo(
        searchRef.current,
        { opacity: 0, y: isMobile ? -20 : 0 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );

      const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => closeSearch(), 10000);
      };

      const input = searchRef.current?.querySelector("input");
      resetTimer();

      input?.addEventListener("input", resetTimer);
      input?.addEventListener("focus", resetTimer);
      input?.addEventListener("blur", resetTimer);

      const outsideClick = (e) => {
        if (!e.target.closest(".search-bar-parent")) closeSearch();
      };
      document.addEventListener("mousedown", outsideClick);

      return () => {
        input?.removeEventListener("input", resetTimer);
        input?.removeEventListener("focus", resetTimer);
        input?.removeEventListener("blur", resetTimer);
        clearTimeout(timerRef.current);
        document.removeEventListener("mousedown", outsideClick);
      };
    }
  }, [showSearch, isMobile]);

  useEffect(() => {
    if (!showProfile) return;
    const handler = (e) => {
      if (!e.target.closest(".profile-dropdown-parent")) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showProfile]);

  useEffect(() => {
    if (showProfile) {
      gsap.fromTo(
        profileRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [showProfile]);

  return (
    <div className="w-full z-20 sticky top-0 bg-white">
      {/* Search Bar for mobile only */}
      {showSearch && isMobile && (
        <div
          ref={searchRef}
          className="fixed top-0 left-0 w-full py-3 px-4 bg-white shadow-md z-50 search-bar-parent"
        >
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-200 w-3/4 sm:w-2/3 md:w-1/2 transition-all"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* BrandBar */}      <div className="flex items-center py-3 px-4 sm:px-6 lg:px-12 relative">
        
        {/* Desktop Layout: 3-column grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:items-center w-full">
          
          {/* Left Column - Search */}
          <div className="flex justify-start">
            <div className="flex items-center relative">
              {/* Desktop search input */}
              {showSearch && (
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products..."
                  className="absolute right-12 top-1/2 -translate-y-1/2 w-64 px-4 py-2 border border-gray-200 rounded-lg shadow-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 z-50 search-bar-parent transition-all"
                  autoFocus
                />
              )}
              <button
                className="p-3 rounded-full hover:bg-gray-100 transition-colors relative z-10"
                onClick={() => setShowSearch((v) => !v)}
                aria-label="Search products"
              >
                <FaSearch size={20} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Center Column - Brand Logo */}
          <div className="flex justify-center">
            <Image
              src="/CENTURY.png"
              alt="Centuary Logo"
              width={180}
              height={60}
              className="select-none"
              draggable="false"
              priority
            />
          </div>

          {/* Right Column - Profile & Cart */}
          <div className="flex justify-end items-center gap-2">
            {/* Cart Button */}
            <button
              className="p-3 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="Shopping cart"
            >
              <FaShoppingCart size={22} className="text-gray-700" />
              {/* Cart badge (optional) */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 items-center justify-center hidden">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown-parent">
              <button
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowProfile((v) => !v)}
                aria-label="Profile menu"
              >
                <FaUserCircle size={24} className="text-gray-700" />
              </button>
              {showProfile && (
                <div
                  ref={profileRef}
                  className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white border border-gray-200 shadow-lg rounded-xl z-50 py-4 px-5 text-sm"
                >
                  {session ? (
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold text-gray-800 text-base truncate">
                          {session.user.name || "Profile"}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                          {session.user.email}
                        </div>
                      </div>
                      <hr className="border-gray-200" />
                      <button
                        className="w-full text-left px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-all"
                        onClick={() => signOut()}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center">Not signed in</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout: Sidebar toggle + Brand + Search & Cart */}
        <div className="flex lg:hidden items-center justify-between w-full">
          
          {/* Left - Sidebar Toggle */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <FaBars size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Center - Brand Logo */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/CENTURY.png"
              alt="Centuary Logo"
              width={120}
              height={40}
              className="select-none"
              draggable="false"
              priority
            />
          </div>

          {/* Right - Search & Cart */}
          <div className="flex items-center gap-1">
            {/* Search Button */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowSearch((v) => !v)}
              aria-label="Search products"
            >
              <FaSearch size={18} className="text-gray-700" />
            </button>

            {/* Cart Button */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
              aria-label="Shopping cart"
            >
              <FaShoppingCart size={20} className="text-gray-700" />
              {/* Cart badge (optional) */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 items-center justify-center hidden">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandBar;
