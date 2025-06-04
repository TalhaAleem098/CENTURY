"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaUserCircle, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const BrandBar = ({ onToggleSidebar }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const searchContainerRef = useRef(null);
  const closeSearch = () => setShowSearch(false);
  
  // Handle profile click - redirect to login if not authenticated
  const handleProfileClick = () => {
    if (!session) {
      router.push('/login');
    } else {
      setShowProfile((v) => !v);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update cart count when cart changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    // Initial load
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };  }, []);

  // Handle click outside search to close it (only if no text)
  useEffect(() => {
    if (!showSearch) return;
    
    const handleClickOutside = (e) => {
      // Don't close if there's text in the search input
      if (searchValue.trim()) return;
      
      // Don't close if clicking inside search container
      if (searchContainerRef.current?.contains(e.target) || 
          searchRef.current?.contains(e.target)) return;
      
      setShowSearch(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch, searchValue]);

  // Handle profile dropdown close
  useEffect(() => {
    if (!showProfile) return;
    const handler = (e) => {
      if (!e.target.closest(".profile-dropdown-parent")) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showProfile]);
  return (
    <div className="w-full z-20 sticky top-0 bg-white border-b border-gray-100">
      {/* Mobile Search Overlay */}
      {showSearch && isMobile && (
        <div
          ref={searchContainerRef}
          className="fixed top-0 left-0 w-full py-3 px-4 bg-white shadow-md z-50"
        >
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchValue('');
              }}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center py-3 px-4 sm:px-6 lg:px-12 relative">        <div className="hidden lg:grid lg:grid-cols-3 lg:items-center w-full">
          <div className="flex justify-start">
            <div className="flex items-center relative">
              {showSearch && (
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="absolute left-12 top-1/2 -translate-y-1/2 w-64 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 z-50 shadow-lg"
                  autoFocus
                />
              )}
              <button
                className="p-3 rounded-full hover:bg-gray-100"
                onClick={() => setShowSearch((v) => !v)}
                aria-label="Search products"
              >
                <FaSearch size={20} className="text-gray-700" />
              </button>
            </div>
          </div>

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

          <div className="flex justify-end items-center gap-2">            <button
              className="p-3 rounded-full hover:bg-gray-100 relative"
              aria-label="Shopping cart"
              onClick={() => router.push('/cart')}
              type="button"
            >
              <FaShoppingCart size={22} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>            <div className="relative profile-dropdown-parent">
              <button
                className="p-3 rounded-full hover:bg-gray-100"
                onClick={handleProfileClick}
                aria-label="Profile menu"
              >
                <FaUserCircle size={24} className="text-gray-700" />
              </button>
              {showProfile && session && (
                <div
                  ref={profileRef}
                  className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white border border-gray-200 shadow-lg rounded-xl z-50 py-4 px-5 text-sm"
                >
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
                      className="w-full text-left px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 font-medium"
                      onClick={() => signOut()}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex lg:hidden items-center justify-between w-full">          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle navigation menu"
            >
              <FaBars size={20} className="text-gray-700" />
            </button>
          </div>

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
          </div>          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setShowSearch((v) => !v)}
              aria-label="Search products"
            >
              <FaSearch size={18} className="text-gray-700" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              aria-label="Shopping cart"
              onClick={() => router.push('/cart')}
              type="button"
            >
              <FaShoppingCart size={20} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={handleProfileClick}
              aria-label="Profile menu"
            >
              <FaUserCircle size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandBar;
