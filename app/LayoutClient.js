"use client";
import { useState } from "react";
import BrandBar from "@/components/BrandBar";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar";

export default function LayoutClient({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <BrandBar onToggleSidebar={toggleSidebar} />
      <Navbar />
      {children}
    </>
  );
}
