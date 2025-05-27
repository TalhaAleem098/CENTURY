"use client";
import { useState, useCallback } from "react";
import BrandBar from "./BrandBar";
import Navbar from "./Navbar";
import Sidebar from "./sidebar";
import Footer from "./Footer";

export default function LayoutClient({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (isToggling) return; // Prevent rapid toggling
    
    setIsToggling(true);
    setIsSidebarOpen(prev => !prev);
    
    // Reset toggling state after animation completes
    setTimeout(() => {
      setIsToggling(false);
    }, 1300); // Slightly longer than the 1.2s animation
  }, [isToggling]);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <BrandBar onToggleSidebar={toggleSidebar} />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
