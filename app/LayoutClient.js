"use client";
import { useState, useEffect } from "react";
import BrandBar from "@/components/BrandBar";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar";

export default function LayoutClient({ children }) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Background analytics: send a beacon on every page load and navigation
  useEffect(() => {
    // Helper to send analytics
    const sendAnalytics = () => {
      try {
        const data = {
          url: window.location.pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        };
        // Send as a single 'data' field for minimal schema
        const blob = new Blob([JSON.stringify({ data })], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics', blob);
      } catch (e) {
        // Fail silently
      }
    };

    // Send on first mount
    sendAnalytics();

    // Listen for client-side navigation (Next.js router events)
    let router;
    try {
      // Dynamically import router only on client
      import('next/navigation').then(({ usePathname }) => {
        // Listen for path changes
        let lastPath = window.location.pathname;
        const checkPath = () => {
          const currentPath = window.location.pathname;
          if (currentPath !== lastPath) {
            lastPath = currentPath;
            sendAnalytics();
          }
        };
        window.addEventListener('popstate', checkPath);
        window.addEventListener('pushstate', checkPath);
        window.addEventListener('replacestate', checkPath);
      });
    } catch (e) {}

    // Also listen for Next.js router events if available
    if (typeof window !== 'undefined' && window.next) {
      try {
        window.next.router?.events?.on?.('routeChangeComplete', sendAnalytics);
      } catch (e) {}
    }

    return () => {
      // Clean up listeners if needed
      window.removeEventListener('popstate', sendAnalytics);
      window.removeEventListener('pushstate', sendAnalytics);
      window.removeEventListener('replacestate', sendAnalytics);
    };
  }, []);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <BrandBar onToggleSidebar={toggleSidebar} />
      <Navbar />
      {children}
    </>
  );
}
