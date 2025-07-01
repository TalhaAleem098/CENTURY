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
  const [dragX, setDragX] = useState(0); // Track drag offset
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const timeoutRef = useRef(null);
  const delay = 4000; // 4 seconds

  // Auto-slide timer
  useEffect(() => {
    if (isDragging) return; // Don't auto-slide while dragging
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [current, isDragging]);

  // Touch/mouse drag logic for smooth sliding
  const handleTouchStart = (e) => {
    setIsDragging(true);
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    setDragX(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragX(clientX - startX.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 60; // px
    if (dragX < -threshold) {
      setCurrent((prev) => (prev + 1) % images.length);
    } else if (dragX > threshold) {
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
    }
    setDragX(0);
    setIsDragging(false);
  };

  // Mouse events for desktop
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleTouchStart(e);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  const handleMouseMove = (e) => handleTouchMove(e);
  const handleMouseUp = () => {
    handleTouchEnd();
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // Calculate indices for prev/next
  const prevIdx = (current - 1 + images.length) % images.length;
  const nextIdx = (current + 1) % images.length;

  // For smooth sliding, use translateX
  const getSlideStyle = (idx) => {
    let base = 0;
    if (idx === prevIdx) base = -100;
    else if (idx === current) base = 0;
    else if (idx === nextIdx) base = 100;
    else return { display: 'none' };
    // Only show prev, current, next
    return {
      transform: `translateX(${base + (idx === current ? dragX / window.innerWidth * 100 : idx === prevIdx && dragX > 0 ? dragX / window.innerWidth * 100 : idx === nextIdx && dragX < 0 ? dragX / window.innerWidth * 100 : 0)}%)`,
      transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(.4,0,.2,1)',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: idx === current ? 2 : 1,
    };
  };

  return (
    <div className="w-full mx-auto md:px-4 md:py-4">
      <div className="relative overflow-hidden bg-[#e5e7eb]">
        <div
          className="relative aspect-[16/9] w-full h-auto overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          style={{ touchAction: 'pan-y', cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {[prevIdx, current, nextIdx].map((idx) => (
            <div key={idx} style={getSlideStyle(idx)}>
              <Image
                src={images[idx]}
                alt={`Hero Image ${idx + 1}`}
                fill
                className="object-cover w-full h-full"
                priority={idx === current}
                quality={90}
                style={{ backgroundColor: '#e5e7eb' }}
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
