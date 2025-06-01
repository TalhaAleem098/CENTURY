"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import { GiClothes } from "react-icons/gi";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineInfo } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";

const navItems = [
  { name: "Home", href: "/", icon: <AiOutlineHome size={16} /> },
  { name: "Sale", href: "/sale", icon: <GiClothes size={16} /> },
  { name: "Cart", href: "/cart", icon: <FiShoppingCart size={16} /> },
  { name: "Contact", href: "/contact", icon: <IoCallOutline size={16} /> },
  { name: "About", href: "/about", icon: <MdOutlineInfo size={16} /> },
];

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <nav className="hidden lg:flex w-full bg-white py-4 border-b border-gray-200 shadow-sm z-50 justify-center">
      <ul className="flex gap-2 items-center text-[15px] font-medium text-gray-800">
        {navItems.map((item) => {
          const activeClass = isActive(item.href)
            ? "bg-gray-200 text-black"
            : "hover:bg-gray-100 hover:text-black";

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-[6px] px-4 py-[6px] rounded-md transition-colors ${activeClass}`}
              >
                {item.icon}
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
