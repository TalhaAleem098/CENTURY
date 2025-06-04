"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
];

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <nav className="hidden lg:flex w-full bg-white py-4 border-b border-gray-200 shadow-sm z-50 justify-center">
      <ul className="flex  items-center text-[15px] font-medium text-gray-800">
        {navItems.map((item) => {
          const activeClass = isActive(item.href)
            ? "bg-gray-200 text-black"
            : "hover:bg-gray-100 hover:text-black";

          return (            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeClass}`}
              >
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
