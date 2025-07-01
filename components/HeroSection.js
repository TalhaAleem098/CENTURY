"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mobile images (1-6.png)
const mobileImages = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
  "/assets/5.png",
  "/assets/6.png",
];

// Desktop images (7-12.png)
const desktopImages = [
  "/assets/7.png",
  "/assets/8.png",
  "/assets/9.png",
  "/assets/10.png",
  "/assets/11.png",
  "/assets/12.png",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const startX = useRef(0);
  const timeoutRef = useRef(null);
  const delay = 5000; // 5 seconds

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get current image set based on screen size
  const images = isMobile ? mobileImages : desktopImages;

  // Auto-slide timer
  useEffect(() => {
    if (isDragging) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [current, isDragging, images.length]);

  // Reset current index when switching between mobile/desktop
  useEffect(() => {
    setCurrent(0);
  }, [isMobile]);

  // Navigation functions
  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Touch/drag handlers for mobile
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
    setDragX(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isMobile) return;
    const clientX = e.touches[0].clientX;
    setDragX(clientX - startX.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isMobile) return;
    const threshold = 80;
    if (dragX < -threshold) {
      goToNext();
    } else if (dragX > threshold) {
      goToPrev();
    }
    setDragX(0);
    setIsDragging(false);
  };

  // Mouse handlers for desktop drag (optional)
  const handleMouseDown = (e) => {
    if (!isMobile) return; // Disable drag on desktop, use buttons instead
    e.preventDefault();
    setIsDragging(true);
    startX.current = e.clientX;
    setDragX(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setDragX(e.clientX - startX.current);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const threshold = 80;
    if (dragX < -threshold) {
      goToNext();
    } else if (dragX > threshold) {
      goToPrev();
    }
    setDragX(0);
    setIsDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Calculate transform for smooth sliding
  const getTransform = () => {
    const baseTransform = -current * 100;
    const dragOffset = isDragging ? (dragX / window.innerWidth) * 100 : 0;
    return `translateX(${baseTransform + dragOffset}%)`;
  };

  return (
    <div className="w-full mx-auto">
      {/* Mobile Layout */}
      {isMobile && (
        <div className="relative">
          <div
            className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-gray-200"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            style={{ 
              touchAction: 'pan-y',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
          >
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{
                transform: getTransform(),
                transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {images.map((src, index) => (
                <div key={index} className="min-w-full h-full relative">
                  <Image
                    src={src}
                    alt={`Mobile Hero ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === current}
                    quality={95}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === current 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="relative group">
          <div className="relative aspect-[21/9] overflow-hidden bg-gray-200 shadow-2xl">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${current * 100}%)`
              }}
            >
              {images.map((src, index) => (
                <div key={index} className="min-w-full h-full relative">
                  <Image
                    src={src}
                    alt={`Desktop Hero ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === current}
                    quality={95}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Desktop Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === current
                    ? 'w-12 h-3 bg-blue-600'
                    : 'w-3 h-3 bg-gray-400 hover:bg-gray-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / images.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;