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
  FaTags, // Sale icon
  FaEnvelopeOpenText, // New icon for Subscribers Mail
  FaRegStickyNote, // New icon for Notes/Reminders
  FaRegBell, // Notification icon
  FaClipboardList, // New icon for Orders Viewing
  FaUserCheck, // New icon for Login Logs
} from 'react-icons/fa';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [fullyOpen, setFullyOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
        setFullyOpen(true);
      } else {
        setIsOpen(false); // Keep sidebar closed by default on mobile
        setFullyOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => setFullyOpen(true), 300); // matches transition duration
    } else {
      setFullyOpen(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isMobile) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isOpen]);

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <FaTachometerAlt /> },
    {
      name: 'Products',
      href: '',
      icon: <FaBoxOpen />,
      subLinks: [
        { name: 'Add Product', href: '/admin/products/add' },
        { name: 'Edit/Delete Product', href: '/admin/products/edit' },
        // { name: 'Product Returnings', href: '/admin/products/returns' },
        { name: 'Inventory Check', href: '/admin/products/inventory' },
      ],
    },
    {
      name: 'Sales',
      href: '',
      icon: <FaTags />,
      subLinks: [
        { name: 'Apply Sale', href: '/admin/apply-sale' },
        { name: 'Remove Sale', href: '/admin/remove-sale' },
      ],
    },
    { name: 'Complains/Messages', href: '/admin/contacts', icon: <FaEnvelope /> },
    { name: 'Orders Viewing', href: '/admin/orders', icon: <FaClipboardList /> },
    { name: 'Subscribers Mail', href: '/admin/mail-subscribers', icon: <FaEnvelopeOpenText /> },
    { name: 'Notes/Reminders', href: '/admin/reminders', icon: <FaRegBell /> },
    // { name: 'Login Logs', href: '/admin/login-logs', icon: <FaUserCheck /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleProducts = () => setIsProductsOpen(!isProductsOpen);
  const toggleSales = () => setIsSalesOpen(!isSalesOpen);

  // Close sidebar when overlay is clicked (on mobile)
  const handleOverlayClick = () => setIsOpen(false);

  // Function to clear all cookies and redirect to home
  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });
    // Redirect to home page
    window.location.href = '/';
  };

  // Only render sidebar on client (avoid hydration mismatch)
  if (typeof window === 'undefined') return null;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black z-40 transition-opacity duration-200 lg:hidden"
          style={{ opacity: 0.4 }}
          onClick={handleOverlayClick}
        ></div>
      )}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white flex flex-col shadow-xl transition-all duration-200 z-50
          ${isMobile ? (isOpen ? 'w-75' : 'w-0') : 'w-56'}
          ${isMobile ? 'lg:hidden' : 'lg:static lg:w-66'}
          ${isOpen && isMobile ? '' : 'overflow-hidden'}
        `}
        style={{ minWidth: isMobile ? (isOpen ? undefined : 0) : undefined }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          {fullyOpen && isOpen && <span className="text-xl font-bold tracking-wide">Admin Panel</span>}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-white border border-white hover:text-gray-300 transition text-lg ml-auto focus:outline-none"
              aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <FaBars />
            </button>
          )}
        </div>

        <nav className={`flex-1 px-2 py-4 space-y-1 ${isOpen ? '' : 'hidden'}`}>
          {adminNav.map((item) => (
            <div key={item.name}>
              <div onClick={() => {
                if (item.name === 'Products') toggleProducts();
                if (item.name === 'Sales') toggleSales();
              }}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-all ${
                    pathname.startsWith(item.href) ? 'bg-gray-700' : ''
                  }`}
                >
                  {/* Hide icons on mobile */}
                  <span className={`text-lg min-w-[24px] text-center ${isMobile ? 'hidden' : ''}`}>{item.icon}</span>
                  {fullyOpen && isOpen && <span>{item.name}</span>}
                  {item.subLinks && fullyOpen && isOpen && (
                    <span className="ml-auto">
                      {(item.name === 'Products' && isProductsOpen) || (item.name === 'Sales' && isSalesOpen) ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </Link>
              </div>

              {/* Animated Dropdown */}
              {item.subLinks && (
                <div
                  className={`transition-all duration-200 ${((item.name === 'Products' && isProductsOpen) || (item.name === 'Sales' && isSalesOpen)) && fullyOpen && isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                  style={{ transitionProperty: 'max-height, opacity' }}
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
        {isOpen && (
          <div className="px-4 py-4 border-t border-gray-800">
            <button
              className="flex items-center gap-2 text-red-400 hover:text-red-600 transition font-semibold"
              onClick={handleLogout}
            >
              <FaSignOutAlt className={`text-lg ${isMobile ? 'hidden' : ''}`} />
              {fullyOpen && <span>Logout</span>}
            </button>
          </div>
        )}
      </aside>
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 border border-white bg-gray-900 text-white p-3 rounded-full shadow-lg lg:hidden focus:outline-none"
          aria-label="Open sidebar"
        >
          <FaBars />
        </button>
      )}
    </>
  );
}
