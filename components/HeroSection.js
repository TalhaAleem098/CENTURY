"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Mobile images (1-6)
  const mobileImages = [
    "/assets/1.webp",
    "/assets/2.webp",
    "/assets/3.webp",
    "/assets/4.webp",
    "/assets/5.webp",
    "/assets/6.webp"
  ];

  // Desktop images (7-12)
  const desktopImages = [
    "/assets/7.webp",
    "/assets/8.webp",
    "/assets/9.webp",
    "/assets/10.webp",
    "/assets/11.webp",
    "/assets/12.webp"
  ];

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  // Auto-slide functionality (every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isDragging, images.length]);

  // Handle touch/mouse start
  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
    setDragDistance(0);
  };

  // Handle touch/mouse move
  const handleMove = (clientX) => {
    if (!isDragging) return;
    
    const distance = clientX - startX;
    setDragDistance(distance);
  };

  // Handle touch/mouse end
  const handleEnd = () => {
    if (!isDragging) return;
    
    const threshold = 50; // Minimum drag distance to change slide
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Dragged right - go to previous image
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else {
        // Dragged left - go to next image
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }
    
    setIsDragging(false);
    setDragDistance(0);
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events
  const handleMouseDown = (e) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative overflow-hidden bg-[#e5e7eb]">
        <div 
          ref={containerRef}
          className="relative w-full h-auto cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Simple image display - no sliding animation */}
          <div className="w-full relative min-h-[200px]">
            <Image
              src={images[currentIndex]}
              alt={`Carousel Image ${currentIndex + 1}`}
              width={1920}
              height={1080}
              className="w-full object-cover"
              priority
              quality={90}
              style={{ backgroundColor: '#e5e7eb' }}
              draggable={false}
            />
          </div>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;