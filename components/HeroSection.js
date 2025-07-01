"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";


// Mobile images (1-6.png) with width and height for aspect ratio
const mobileImages = [
  { src: "/assets/1.png", width: 800, height: 600 },
  { src: "/assets/2.png", width: 900, height: 700 },
  { src: "/assets/3.png", width: 1000, height: 800 },
  { src: "/assets/4.png", width: 1200, height: 900 },
  { src: "/assets/5.png", width: 700, height: 900 },
  { src: "/assets/6.png", width: 1000, height: 500 },
];

// Desktop images (7-12.png) with width and height for aspect ratio
const desktopImages = [
  { src: "/assets/7.png", width: 1920, height: 800 },
  { src: "/assets/8.png", width: 1600, height: 900 },
  { src: "/assets/9.png", width: 1400, height: 700 },
  { src: "/assets/10.png", width: 1200, height: 1000 },
  { src: "/assets/11.png", width: 1000, height: 1200 },
  { src: "/assets/12.png", width: 1800, height: 600 },
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

  // Get current image aspect ratio
  const currentImage = images[current];
  const aspectRatio = currentImage.height / currentImage.width;


  return (
    <div className="w-full mx-auto">
      {/* Mobile Layout */}
      {isMobile && (
        <div className="relative">
          <div
            className="relative overflow-hidden bg-gray-200"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            style={{
              touchAction: 'pan-y',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              width: '100%',
              height: `calc(100vw * ${aspectRatio})`,
              maxHeight: '80vh',
              transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                width: `${images.length * 100}vw`,
                height: '100%',
                display: 'flex',
                transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: getTransform()
              }}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  style={{ width: '100vw', height: '100%', position: 'relative', margin: 0, padding: 0, flex: '0 0 100vw', boxSizing: 'border-box' }}
                >
                  <Image
                    src={img.src}
                    alt={`Mobile Hero ${index + 1}`}
                    width={img.width}
                    height={img.height}
                    style={{ width: '100vw', height: '100%', objectFit: 'contain', margin: 0, padding: 0, display: 'block', boxSizing: 'border-box' }}
                    priority={index === current}
                    quality={95}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Dots Indicator removed */}
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobile && (
        <div className="relative group" tabIndex={0}>
          <div
            className="relative overflow-hidden bg-gray-200 shadow-2xl"
            style={{
              width: '100%',
              height: `calc(100vw * ${aspectRatio})`,
              maxHeight: '70vh',
              transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                width: `${images.length * 100}vw`,
                height: '100%',
                display: 'flex',
                transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${current * 100}vw)`
              }}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  style={{ width: '100vw', height: '100%', position: 'relative', margin: 0, padding: 0, flex: '0 0 100vw', boxSizing: 'border-box' }}
                >
                  <Image
                    src={img.src}
                    alt={`Desktop Hero ${index + 1}`}
                    width={img.width}
                    height={img.height}
                    style={{ width: '100vw', height: '100%', objectFit: 'contain', margin: 0, padding: 0, display: 'block', boxSizing: 'border-box' }}
                    priority={index === current}
                    quality={95}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Navigation Buttons - hidden by default, shown on hover/focus */}
            <button
              onClick={goToPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-400 text-gray-700 rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Previous image"
              style={{ zIndex: 10, pointerEvents: 'auto' }}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-400 text-gray-700 rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Next image"
              style={{ zIndex: 10, pointerEvents: 'auto' }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;