"use client";
import React from "react";
import Image from "next/image";


import { useState, useEffect, useRef } from "react";

const images = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
  "/assets/5.png",
  "/assets/6.png",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const delay = 4000; // 4 seconds

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  // Touch/mouse drag logic
  const startX = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = startX.current;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    lastX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    const diff = lastX.current - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        // Next image
        setCurrent((prev) => (prev + 1) % images.length);
      } else {
        // Previous image
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    isDragging.current = false;
  };

  // Mouse events for desktop
  const handleMouseDown = (e) => handleTouchStart(e);
  const handleMouseMove = (e) => handleTouchMove(e);
  const handleMouseUp = () => handleTouchEnd();
  const handleMouseLeave = () => { if (isDragging.current) handleTouchEnd(); };

  return (
    <div className="w-full mx-auto md:px-4 md:py-4">
      <div className="relative rounded-2xl overflow-hidden bg-[#e5e7eb] p-2 md:p-4">
        <div
          className="relative aspect-[16/9] w-full h-auto rounded-2xl overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ touchAction: 'pan-y', cursor: 'grab' }}
        >
          <Image
            src={images[current]}
            alt={`Hero Image ${current + 1}`}
            fill
            className="object-cover w-full h-full rounded-2xl transition-all duration-700"
            priority
            quality={90}
            style={{ backgroundColor: '#e5e7eb' }}
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
