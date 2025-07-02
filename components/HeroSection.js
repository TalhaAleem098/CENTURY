"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('next');

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

  // Timer ref for auto-slide
  const intervalRef = useRef(null);

  // Calculate next/prev indices
  const getNextImageIndex = (currentIdx) => currentIdx === images.length - 1 ? 0 : currentIdx + 1;
  const getPrevImageIndex = (currentIdx) => currentIdx === 0 ? images.length - 1 : currentIdx - 1;

  // Animate to next
  const animateToNext = useCallback(() => {
    if (isAnimating) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const newNextIndex = getNextImageIndex(currentIndex);
    setNextIndex(newNextIndex);
    setIsAnimating(true);
    setAnimationDirection('next');
    
    // Complete animation after duration
    setTimeout(() => {
      setCurrentIndex(newNextIndex);
      setIsAnimating(false);
      startAutoSlide();
    }, 600);
  }, [isAnimating, currentIndex, images.length]);

  // Function to start the auto-slide interval
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      animateToNext();
    }, 3000);
  }, [animateToNext]);

  const animateToPrev = useCallback(() => {
    if (isAnimating) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const newNextIndex = getPrevImageIndex(currentIndex);
    setNextIndex(newNextIndex);
    setIsAnimating(true);
    setAnimationDirection('prev');
    
    setTimeout(() => {
      setCurrentIndex(newNextIndex);
      setIsAnimating(false);
      startAutoSlide();
    }, 600);
  }, [isAnimating, currentIndex, images.length, startAutoSlide]);

  // Auto-slide functionality
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  const goToSlide = (index) => {
    if (index !== currentIndex && !isAnimating) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      setNextIndex(index);
      setIsAnimating(true);
      setAnimationDirection(index > currentIndex ? 'next' : 'prev');
      
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
        startAutoSlide();
      }, 600);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative overflow-hidden bg-[#e5e7eb]">
        {/* Main carousel container */}
        <div className="relative w-full h-auto">
          {/* Container for animated images */}
          <div className="relative w-full h-auto">
            {/* Current Image - always at base level */}
            <div 
              className={`relative w-full transition-all duration-600 ease-in-out ${
                isAnimating 
                  ? animationDirection === 'next' 
                    ? 'animate-slide-out-left' 
                    : 'animate-slide-out-right'
                  : ''
              }`}
              style={{ zIndex: 1 }}
            >
              <Image
                src={images[currentIndex]}
                alt={`Carousel Image ${currentIndex + 1}`}
                width={1920}
                height={1080}
                className="w-full h-auto object-cover"
                priority
                quality={90}
                style={{ backgroundColor: '#e5e7eb' }}
              />
            </div>

            {/* Incoming Image - always on top during animation */}
            {isAnimating && (
              <div 
                className={`absolute top-0 left-0 w-full transition-all duration-600 ease-in-out ${
                  animationDirection === 'next' 
                    ? 'animate-slide-in-right' 
                    : 'animate-slide-in-left'
                }`}
                style={{ zIndex: 2 }}
              >
                <Image
                  src={images[nextIndex]}
                  alt={`Carousel Image ${nextIndex + 1}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  quality={90}
                  style={{ backgroundColor: '#e5e7eb' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={animateToPrev}
          disabled={isAnimating}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 flex items-center justify-center transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:scale-110 active:scale-95"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={animateToNext}
          disabled={isAnimating}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 flex items-center justify-center transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:scale-110 active:scale-95"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-out-left {
          0% { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: translateX(-100%) scale(0.9); 
            opacity: 0; 
          }
        }
        
        @keyframes slide-in-right {
          0% { 
            transform: translateX(100%) scale(0.9); 
            opacity: 0; 
          }
          100% { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
        }
        
        @keyframes slide-out-right {
          0% { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: translateX(100%) scale(0.9); 
            opacity: 0; 
          }
        }
        
        @keyframes slide-in-left {
          0% { 
            transform: translateX(-100%) scale(0.9); 
            opacity: 0; 
          }
          100% { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
        }

        .animate-slide-out-left { 
          animation: slide-out-left 0.6s ease-in-out forwards; 
        }
        .animate-slide-in-right { 
          animation: slide-in-right 0.6s ease-in-out forwards; 
        }
        .animate-slide-out-right { 
          animation: slide-out-right 0.6s ease-in-out forwards; 
        }
        .animate-slide-in-left { 
          animation: slide-in-left 0.6s ease-in-out forwards; 
        }
      `}</style>
    </div>
  );
};

export default HeroSection;