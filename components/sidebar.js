"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useSession, signOut } from "next-auth/react";
import {
  FaHome,
  FaSnowflake,
  FaEnvelope,
  FaStore,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaTshirt,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { name: "Home", href: "/", icon: <FaHome /> },
  {
    name: "Winter Sale Tops",
    icon: <FaSnowflake />,
    dropdown: [
      { name: "Oversized Tees", href: "/category?type=oversized-tees", icon: <FaTshirt /> },
      { name: "Cropped Tees", href: "/category?type=cropped-tees", icon: <FaTshirt /> },
      { name: "CORE Blanks", href: "/category?type=core-blanks", icon: <FaTshirt /> },
      { name: "Foxy Fit Tees", href: "/category?type=foxy-fit-tees", icon: <FaTshirt /> },
      { name: "Oversized Hoodies", href: "/category?type=oversized-hoodies", icon: <FaTshirt /> },
      { name: "Oversized Sweatshirts", href: "/category?type=oversized-sweatshirts", icon: <FaTshirt /> },
    ],
  },
  { name: "Contact", href: "/contact", icon: <FaEnvelope /> },
  { name: "Shop All", href: "/shop", icon: <FaStore /> },
  { name: "About", href: "/about", icon: <FaInfoCircle /> },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: session } = useSession();
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const timelineRef = useRef(null);
  // Initialize sidebar position on mount
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.set(sidebarRef.current, { x: "-100%" });
    }
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { opacity: 0 });
    }
    
    // Clear menu items ref array on mount
    menuItemsRef.current = [];
  }, []);

  useEffect(() => {
    // Kill any existing timeline to prevent conflicts
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
      
      // Ensure refs are populated
      const menuItems = menuItemsRef.current.filter(item => item !== null);
      
      // Set initial states
      gsap.set(menuItems, { x: -30, opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });
      
      // Create timeline for opening animation
      timelineRef.current = gsap.timeline({
        onComplete: () => setIsAnimating(false)
      });
      
      timelineRef.current
        .to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(sidebarRef.current, {
          x: 0,
          duration: 1.2,
          ease: "power3.out",
        }, "-=0.1")
        .to(menuItems, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        }, "-=0.6");
        
    } else {
      setIsAnimating(true);
      setOpenDropdown(null);
      
      const menuItems = menuItemsRef.current.filter(item => item !== null);
      
      // Create timeline for closing animation
      timelineRef.current = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          document.body.style.overflow = "auto";
        }
      });
      
      timelineRef.current
        .to(menuItems, {
          x: -30,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.in",
        })
        .to(sidebarRef.current, {
          x: "-100%",
          duration: 1.2,
          ease: "power3.in",
        }, "-=0.2")
        .to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        }, "-=0.8");
    }

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isOpen]);  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !isAnimating && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onToggle();
      }
    };
    
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen && !isAnimating) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, isAnimating, onToggle]);

  const toggleDropdown = (name) => {
    if (!isAnimating) {
      setOpenDropdown(openDropdown === name ? null : name);
    }
  };

  const handleLinkClick = () => {
    if (!isAnimating) {
      onToggle();
    }
  };
  // Function to add refs to menu items
  const addToRefs = (el) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current.push(el);
    }
  };

  // Function to clear refs when component unmounts
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      // Reset body overflow on unmount
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <>      <nav
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform -translate-x-full lg:hidden flex flex-col"
        style={{ willChange: "transform" }}
      >        <div 
          className="flex items-center justify-between p-4 border-b border-gray-200"
          ref={addToRefs}
        >
          <div className="text-lg font-bold">Menu</div>
          <button
            aria-label="Close sidebar menu"
            onClick={handleLinkClick}
            disabled={isAnimating}
            className="p-2 rounded-md hover:bg-gray-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes size={24} />
          </button>
        </div><ul className="flex flex-col overflow-y-auto flex-grow sidebar-scroll">
          {navItems.map((item, index) => (
            <li key={item.name} className="border-b border-gray-100" ref={addToRefs}>
              {item.dropdown ? (
                <>                  <button
                    className="flex items-center justify-between w-full px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 hover:pl-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => toggleDropdown(item.name)}
                    disabled={isAnimating}
                    aria-expanded={openDropdown === item.name}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-green-700">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 ml-2 transition-transform duration-300 ${openDropdown === item.name ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <ul
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openDropdown === item.name ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    } bg-gray-50`}
                  >
                    {item.dropdown.map((drop) => (
                      <li key={drop.name}>                        <Link
                          href={drop.href}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-10 py-2 text-gray-600 hover:bg-gray-100 hover:text-green-700 transition-all duration-300 hover:pl-12"
                        >
                          <span className="text-green-700">{drop.icon}</span>
                          {drop.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 hover:text-green-700 transition-all duration-300 hover:pl-8"
                >
                  <span className="text-green-700">{item.icon}</span>
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>        {/* Account Section - Mobile Only */}
        <div className="mt-auto p-4 border-t border-gray-200" ref={addToRefs}>
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
              </div>              <button
                className="flex items-center gap-3 w-full px-2 py-2 text-red-600 hover:bg-red-50 rounded-md transition-all duration-300 hover:pl-4 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (!isAnimating) {
                    signOut();
                    onToggle();
                  }
                }}
                disabled={isAnimating}
              >
                <FaSignOutAlt size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-500 text-sm mb-2">Not signed in</div>              <button 
                className="text-green-600 font-medium text-sm hover:text-green-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleLinkClick}
                disabled={isAnimating}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </nav>      {isOpen && (
        <div
          ref={overlayRef}
          onClick={handleLinkClick}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
