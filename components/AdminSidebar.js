'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaBars,
} from 'react-icons/fa';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [fullyOpen, setFullyOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const pathname = usePathname();

  // Delay showing text until transition ends
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => setFullyOpen(true), 300); // matches transition duration
    } else {
      setFullyOpen(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <FaTachometerAlt /> },
    {
      name: 'Products',
      href: '#',
      icon: <FaBoxOpen />,
      subLinks: [
        { name: 'Add Product', href: '/admin/products/add' },
        { name: 'Edit Product', href: '/admin/products/edit' },
        { name: 'Delete Product', href: '/admin/products/delete' },
      ],
    },
    { name: 'Contact Messages', href: '/admin/contacts', icon: <FaEnvelope /> },
    { name: 'Check Orders', href: '/admin/orders', icon: <FaBoxOpen /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleProducts = () => setIsProductsOpen(!isProductsOpen);

  return (
    <aside
      className={`h-screen bg-gray-900 text-white flex flex-col shadow-xl transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        {fullyOpen && <span className="text-xl font-bold tracking-wide">Admin Panel</span>}
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-gray-300 transition text-lg ml-auto"
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {adminNav.map((item) => (
          <div key={item.name}>
            <div onClick={() => item.subLinks && toggleProducts()}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all ${
                  pathname.startsWith(item.href) ? 'bg-gray-700' : ''
                }`}
              >
                <span className="text-lg min-w-[24px] text-center">{item.icon}</span>
                {fullyOpen && <span>{item.name}</span>}
                {item.subLinks && fullyOpen && (
                  <span className="ml-auto">
                    {isProductsOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                )}
              </Link>
            </div>

            {/* Animated Dropdown */}
            {item.subLinks && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isProductsOpen && fullyOpen ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <div className="pl-8 pr-2 space-y-1">
                  {item.subLinks.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className={`block px-3 py-1.5 rounded-md text-sm hover:bg-gray-700 transition ${
                        pathname === sub.href ? 'bg-gray-600' : ''
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <button className="flex items-center gap-2 text-red-400 hover:text-red-600 transition font-semibold">
          <FaSignOutAlt className="text-lg" />
          {fullyOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
