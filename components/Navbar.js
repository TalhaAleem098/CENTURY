"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import { GiClothes } from "react-icons/gi";
import { IoCallOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { MdOutlineInfo } from "react-icons/md";

const navItems = [
  { name: "Home", href: "/", icon: <AiOutlineHome size={18} /> },
  {
    name: "Winter Sale Tops",
    icon: <GiClothes size={18} />,
    dropdown: [
      { name: "Oversized Tees", href: "/category?type=oversized-tees" },
      { name: "Cropped Tees", href: "/category?type=cropped-tees" },
      { name: "CORE Blanks", href: "/category?type=core-blanks" },
      { name: "Foxy Fit Tees", href: "/category?type=foxy-fit-tees" },
      { name: "Oversized Hoodies", href: "/category?type=oversized-hoodies" },
      { name: "Oversized Sweatshirts", href: "/category?type=oversized-sweatshirts" },
    ],
  },
  { name: "Contact", href: "/contact", icon: <IoCallOutline size={18} /> },
  { name: "Shop All", href: "/shop", icon: <FiShoppingBag size={18} /> },
  { name: "About", href: "/about", icon: <MdOutlineInfo size={18} /> },
];

const Navbar = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleClose = (e) => {
    if (!e.target.closest(".dropdown-parent")) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    if (openDropdown) {
      document.addEventListener("mousedown", handleClose);
      return () => document.removeEventListener("mousedown", handleClose);
    }
  }, [openDropdown]);

  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <nav className="hidden lg:flex w-full bg-white py-4 border-b border-gray-200 shadow-sm z-50 justify-center">
      <ul className="flex gap-1 items-center text-[16px] font-semibold text-gray-700 relative">
        {navItems.map((item) => {
          const activeClass = isActive(item.href)
            ? "bg-black-100 text-green-800"
            : "hover:bg-gray-100 hover:text-green-600";

          return (
            <li
              key={item.name}
              className={`relative ${item.dropdown ? "dropdown-parent" : ""}`}
            >
              {item.dropdown ? (
                <>
                  <button
                    type="button"
                    className={`cursor-pointer flex items-center gap-1 px-3 py-2 rounded-md transition-colors focus:outline-none ${
                      openDropdown === item.name
                        ? "bg-black-100 text-green-800"
                        : "hover:bg-gray-100 hover:text-green-600"
                    }`}
                    onClick={() => handleDropdown(item.name)}
                    aria-expanded={openDropdown === item.name}
                  >
                    {item.icon}
                    {item.name}
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform ${
                        openDropdown === item.name ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <ul
                    className={`absolute left-1/2 -translate-x-1/2 mt-3 w-[220px] bg-white border border-gray-100 shadow-lg rounded-xl transition-all duration-200 z-50 py-2 ${
                      openDropdown === item.name
                        ? "opacity-100 pointer-events-auto visible"
                        : "opacity-0 pointer-events-none invisible"
                    }`}
                  >
                    {item.dropdown.map((drop) => (
                      <li key={drop.name}>
                        <Link
                          href={drop.href}
                          className={`block px-5 py-2 text-[15px] text-gray-600 hover:bg-black-100 hover:text-green-800 transition rounded-lg ${
                            pathname === drop.href
                              ? "bg-black-100 text-green-800"
                              : ""
                          }`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {drop.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${activeClass}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
