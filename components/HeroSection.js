"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
      if (!isDragging && !isTransitioning) {
        changeSlide((prev) => (prev + 1) % images.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isDragging, isTransitioning, images.length]);

  // Handle slide change with transition
  const changeSlide = (indexOrCallback) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (typeof indexOrCallback === 'function') {
      setCurrentIndex(indexOrCallback);
    } else {
      setCurrentIndex(indexOrCallback);
    }
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Handle touch/mouse start
  const handleStart = (clientX) => {
    if (isTransitioning) return;
    setIsDragging(true);
    setStartX(clientX);
    setDragDistance(0);
  };

  // Handle touch/mouse move
  const handleMove = (clientX) => {
    if (!isDragging || isTransitioning) return;
    
    const distance = clientX - startX;
    setDragDistance(distance);
  };

  // Handle touch/mouse end
  const handleEnd = () => {
    if (!isDragging || isTransitioning) return;
    
    const threshold = 50; // Minimum drag distance to change slide
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Dragged right - go to previous image
        changeSlide((prev) => (prev - 1 + images.length) % images.length);
      } else {
        // Dragged left - go to next image
        changeSlide((prev) => (prev + 1) % images.length);
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

  // Handle dot click
  const handleDotClick = (index) => {
    if (index !== currentIndex) {
      changeSlide(index);
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
          {/* Image container with sliding animation */}
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${-currentIndex * 100 + (isDragging ? (dragDistance / containerRef.current?.offsetWidth) * 100 : 0)}%)`,
              width: `${images.length * 100}%`
            }}
          >
            {images.map((src, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Image
                  src={src}
                  alt={`Carousel Image ${index + 1}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  priority={index === 0}
                  quality={90}
                  style={{ backgroundColor: '#e5e7eb' }}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Overlay for drag feedback */}
          {isDragging && (
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          )}
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/75'
              } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows (optional) */}
        <button
          onClick={() => changeSlide((prev) => (prev - 1 + images.length) % images.length)}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => changeSlide((prev) => (prev + 1) % images.length)}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HeroSection;