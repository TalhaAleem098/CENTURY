"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FaHome,
  FaEnvelope,
  FaInfoCircle,
  FaUserCircle,
  FaSignOutAlt,
  FaQuestionCircle,
  FaShieldAlt,
  FaFileContract,
} from "react-icons/fa";

// Only the required nav items
const navItems = [
  { name: "Home", href: "/", icon: <FaHome /> },
  { name: "Contact", href: "/contact", icon: <FaEnvelope /> },
  { name: "FAQ", href: "/faq", icon: <FaQuestionCircle /> },
  { name: "About", href: "/about", icon: <FaInfoCircle /> },
  { name: "Privacy Policy", href: "/privacy", icon: <FaShieldAlt /> },
  { name: "Terms & Conditions", href: "/terms", icon: <FaFileContract /> },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const { data: session } = useSession();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onToggle();
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onToggle();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onToggle]);

  const handleLinkClick = () => {
    onToggle();
  };

  return (
    <>
      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ willChange: "transform" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="text-lg font-bold tracking-wide text-green-700">Menu</div>
          <button
            aria-label="Close sidebar menu"
            onClick={handleLinkClick}
            className="p-2 rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-110"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <ul className="flex flex-col overflow-y-auto flex-grow sidebar-scroll">
          {navItems.map((item) => (
            <li key={item.name} className="border-b border-gray-100">
              <Link
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 hover:text-green-700 transition-all duration-300 hover:pl-8"
              >
                <span className="text-green-700">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* Account Section - Mobile Only */}
        <div className="mt-auto p-4 border-t border-gray-200">
          {session ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2 py-2">
                <FaUserCircle size={24} className="text-green-700" />
                <div>
                  <div className="font-semibold text-gray-800 text-sm truncate">
                    {session.user.name || "Profile"}
                  </div>
                  <div className="text-gray-500 text-xs truncate">
                    {session.user.email}
                  </div>
                </div>
              </div>
              <button
                className="flex items-center gap-3 w-full px-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition-all duration-300 hover:pl-4"
                onClick={() => {
                  signOut();
                  onToggle();
                }}
              >
                <FaSignOutAlt size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-500 text-sm mb-2">Not signed in</div>
              <Link
                href="/login"
                className="text-green-600 font-medium text-sm hover:text-green-700 transition-all duration-300 hover:scale-105"
                onClick={handleLinkClick}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </nav>
      {/* Overlay */}
      <div
  onClick={onToggle}
  className={`fixed inset-0 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
></div>
    </>
  );
};

export default Sidebar;
