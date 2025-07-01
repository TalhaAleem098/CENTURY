"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('next');
  const [animationType, setAnimationType] = useState('zoomSlide');

  // Drag/Touch state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const dragThreshold = 25; // Much lower threshold for easier navigation
  const velocityThreshold = 0.3; // Lower velocity threshold for quick swipes

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
  const dragStartTime = useRef(0);
  const carouselRef = useRef(null);

  // Animate to next must be defined before startAutoSlide to avoid ReferenceError
  const animateToNext = useCallback(() => {
    if (isAnimating || isDragging) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsAnimating(true);
    setAnimationDirection('next');
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
      startAutoSlide();
    }, 600);
  }, [isAnimating, isDragging, images.length]);

  const animateToPrev = useCallback(() => {
    if (isAnimating || isDragging) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsAnimating(true);
    setAnimationDirection('prev');
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
      startAutoSlide();
    }, 600);
  }, [isAnimating, isDragging, images.length]);

  // Function to start the auto-slide interval
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      animateToNext();
    }, 3000);
  }, [animateToNext]);

  // Auto-slide functionality with reset on manual navigation
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  // Drag/Touch handlers
  const handleDragStart = (clientX, clientY) => {
    if (isAnimating) return;
    
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setDragCurrent({ x: clientX, y: clientY });
    setDragOffset(0);
    dragStartTime.current = Date.now();
    
    // Pause auto-slide while dragging
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDragging) return;

    const deltaX = clientX - dragStart.x;
    const deltaY = Math.abs(clientY - dragStart.y);
    
    // Only process horizontal swipes (allow some vertical tolerance)
    if (deltaY > 30 && Math.abs(deltaX) < 20) return;
    
    setDragCurrent({ x: clientX, y: clientY });
    setDragOffset(deltaX);

    // Prevent default to avoid page scrolling during horizontal drag
    if (Math.abs(deltaX) > 10) {
      document.body.style.overflow = 'hidden';
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const deltaX = dragCurrent.x - dragStart.x;
    const deltaTime = Date.now() - dragStartTime.current;
    const velocity = Math.abs(deltaX) / deltaTime;

    // Re-enable body scroll
    document.body.style.overflow = '';

    // Much more sensitive slide detection
    const shouldChangeSlide = Math.abs(deltaX) > dragThreshold || velocity > velocityThreshold;

    if (shouldChangeSlide) {
      if (deltaX > 0) {
        // Dragged right - go to previous (immediate update)
        setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
      } else {
        // Dragged left - go to next (immediate update)
        setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
      }
      // Restart auto-slide after drag
      startAutoSlide();
    } else {
      // Snap back to current slide
      startAutoSlide();
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 1) return; // Ignore multi-touch
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    
    // Prevent default scrolling if horizontal movement is detected
    if (Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
    
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleDragEnd();
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleMouseMove(e);
      const handleGlobalMouseUp = () => handleMouseUp();

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStart, dragCurrent]);

  const goToSlide = (index) => {
    if (index !== currentIndex && !isAnimating && !isDragging) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsAnimating(true);
      setAnimationDirection(index > currentIndex ? 'next' : 'prev');
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
        startAutoSlide();
      }, 600);
    }
  };

  // Get the previous and next image indices
  const getPrevIndex = () => currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  const getNextIndex = () => currentIndex === images.length - 1 ? 0 : currentIndex + 1;

  // Animation styles based on type
  const getAnimationClasses = () => {
    if (!isAnimating) return { current: '', incoming: '' };

    switch (animationType) {
      case 'flipCube':
        return {
          current: animationDirection === 'next' 
            ? 'animate-flip-out-right' 
            : 'animate-flip-out-left',
          incoming: animationDirection === 'next' 
            ? 'animate-flip-in-right' 
            : 'animate-flip-in-left'
        };
      case 'zoomSlide':
        return {
          current: animationDirection === 'next' 
            ? 'animate-zoom-slide-out-left' 
            : 'animate-zoom-slide-out-right',
          incoming: animationDirection === 'next' 
            ? 'animate-zoom-slide-in-right' 
            : 'animate-zoom-slide-in-left'
        };
      case 'rotateScale':
        return {
          current: 'animate-rotate-scale-out',
          incoming: 'animate-rotate-scale-in'
        };
      case 'elastic':
        return {
          current: animationDirection === 'next' 
            ? 'animate-elastic-out-right' 
            : 'animate-elastic-out-left',
          incoming: animationDirection === 'next' 
            ? 'animate-elastic-in-right' 
            : 'animate-elastic-in-left'
        };
      default:
        return { current: '', incoming: '' };
    }
  };

  const { current: currentAnimation, incoming: incomingAnimation } = getAnimationClasses();

  // Calculate drag transform with enhanced sensitivity
  const getDragTransform = () => {
    if (!isDragging || isAnimating) return '';
    // Increased sensitivity - less resistance, more responsive
    const sensitivity = 1.2; // Multiply drag distance for more responsive feel
    const maxOffset = 200; // Increased maximum drag distance
    const enhancedOffset = dragOffset * sensitivity;
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, enhancedOffset));
    return `translateX(${clampedOffset}px)`;
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative overflow-hidden bg-[#e5e7eb]" style={{ perspective: '1000px' }}>
        {/* Main carousel container */}
        <div 
          ref={carouselRef}
          className="relative w-full h-auto select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            touchAction: 'pan-y pinch-zoom',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
        >
          {/* Container for animated images */}
          <div className="relative w-full h-auto overflow-hidden">
            {/* Current Image */}
            <div 
              className={`relative w-full transition-transform duration-150 ease-out ${currentAnimation}`}
              style={{ 
                transform: isDragging && !isAnimating ? getDragTransform() : '',
                opacity: isDragging ? Math.max(0.8, 1 - Math.abs(dragOffset) / 300) : 1
              }}
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
                draggable={false}
              />
            </div>

            {/* Incoming Image */}
            {isAnimating && (
              <div className={`absolute top-0 left-0 w-full ${incomingAnimation}`}>
                <Image
                  src={images[animationDirection === 'next' ? getNextIndex() : getPrevIndex()]}
                  alt={`Carousel Image ${(animationDirection === 'next' ? getNextIndex() : getPrevIndex()) + 1}`}
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-cover"
                  quality={90}
                  style={{ backgroundColor: '#e5e7eb' }}
                  draggable={false}
                />
              </div>
            )}

            {/* Drag preview images */}
            {isDragging && !isAnimating && (
              <>
                {/* Previous image preview (shown when dragging right) */}
                {dragOffset > 15 && (
                  <div 
                    className="absolute top-0 left-0 w-full transition-all duration-150 ease-out"
                    style={{ 
                      transform: `translateX(${-100 + (dragOffset * 1.2 / 2)}%)`,
                      opacity: Math.min(0.6, dragOffset / 100),
                      zIndex: -1
                    }}
                  >
                    <Image
                      src={images[getPrevIndex()]}
                      alt={`Previous Image ${getPrevIndex() + 1}`}
                      width={1920}
                      height={1080}
                      className="w-full h-auto object-cover"
                      quality={90}
                      style={{ backgroundColor: '#e5e7eb' }}
                      draggable={false}
                    />
                  </div>
                )}
                
                {/* Next image preview (shown when dragging left) */}
                {dragOffset < -15 && (
                  <div 
                    className="absolute top-0 left-0 w-full transition-all duration-150 ease-out"
                    style={{ 
                      transform: `translateX(${100 + (dragOffset * 1.2 / 2)}%)`,
                      opacity: Math.min(0.6, Math.abs(dragOffset) / 100),
                      zIndex: -1
                    }}
                  >
                    <Image
                      src={images[getNextIndex()]}
                      alt={`Next Image ${getNextIndex() + 1}`}
                      width={1920}
                      height={1080}
                      className="w-full h-auto object-cover"
                      quality={90}
                      style={{ backgroundColor: '#e5e7eb' }}
                      draggable={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Navigation arrows - Only show on larger screens (md and up) */}
        <button
          onClick={animateToPrev}
          disabled={isAnimating || isDragging}
          className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 items-center justify-center transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:scale-110 active:scale-95"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={animateToNext}
          disabled={isAnimating || isDragging}
          className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-12 h-12 items-center justify-center transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:scale-110 active:scale-95"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Enhanced image counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 text-sm backdrop-blur-sm rounded-full">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Drag indicator for mobile */}
        {isMobile && !isDragging && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 text-xs backdrop-blur-sm rounded-full animate-pulse">
            Swipe to navigate
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes flip-out-right {
          0% { transform: rotateY(0deg) scale(1); }
          100% { transform: rotateY(-90deg) scale(0.8); }
        }
        @keyframes flip-in-right {
          0% { transform: rotateY(90deg) scale(0.8); }
          100% { transform: rotateY(0deg) scale(1); }
        }
        @keyframes flip-out-left {
          0% { transform: rotateY(0deg) scale(1); }
          100% { transform: rotateY(90deg) scale(0.8); }
        }
        @keyframes flip-in-left {
          0% { transform: rotateY(-90deg) scale(0.8); }
          100% { transform: rotateY(0deg) scale(1); }
        }
        
        @keyframes zoom-slide-out-left {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(-100%) scale(0.8); opacity: 0; }
        }
        @keyframes zoom-slide-in-right {
          0% { transform: translateX(100%) scale(0.8); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes zoom-slide-out-right {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(100%) scale(0.8); opacity: 0; }
        }
        @keyframes zoom-slide-in-left {
          0% { transform: translateX(-100%) scale(0.8); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        
        @keyframes rotate-scale-out {
          0% { transform: rotate(0deg) scale(1); opacity: 1; }
          100% { transform: rotate(180deg) scale(0); opacity: 0; }
        }
        @keyframes rotate-scale-in {
          0% { transform: rotate(-180deg) scale(0); opacity: 0; }
          100% { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        
        @keyframes elastic-out-right {
          0% { transform: translateX(0) scale(1); }
          25% { transform: translateX(-10%) scale(1.1); }
          100% { transform: translateX(100%) scale(0.8); }
        }
        @keyframes elastic-in-right {
          0% { transform: translateX(100%) scale(0.8); }
          75% { transform: translateX(-5%) scale(1.05); }
          100% { transform: translateX(0) scale(1); }
        }
        @keyframes elastic-out-left {
          0% { transform: translateX(0) scale(1); }
          25% { transform: translateX(10%) scale(1.1); }
          100% { transform: translateX(-100%) scale(0.8); }
        }
        @keyframes elastic-in-left {
          0% { transform: translateX(-100%) scale(0.8); }
          75% { transform: translateX(5%) scale(1.05); }
          100% { transform: translateX(0) scale(1); }
        }

        .animate-flip-out-right { animation: flip-out-right 0.6s ease-in-out forwards; }
        .animate-flip-in-right { animation: flip-in-right 0.6s ease-in-out forwards; }
        .animate-flip-out-left { animation: flip-out-left 0.6s ease-in-out forwards; }
        .animate-flip-in-left { animation: flip-in-left 0.6s ease-in-out forwards; }
        
        .animate-zoom-slide-out-left { animation: zoom-slide-out-left 0.6s ease-in-out forwards; }
        .animate-zoom-slide-in-right { animation: zoom-slide-in-right 0.6s ease-in-out forwards; }
        .animate-zoom-slide-out-right { animation: zoom-slide-out-right 0.6s ease-in-out forwards; }
        .animate-zoom-slide-in-left { animation: zoom-slide-in-left 0.6s ease-in-out forwards; }
        
        .animate-rotate-scale-out { animation: rotate-scale-out 0.6s ease-in-out forwards; }
        .animate-rotate-scale-in { animation: rotate-scale-in 0.6s ease-in-out forwards; }
        
        .animate-elastic-out-right { animation: elastic-out-right 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-elastic-in-right { animation: elastic-in-right 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-elastic-out-left { animation: elastic-out-left 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-elastic-in-left { animation: elastic-in-left 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
      `}</style>
    </div>
  );
};

export default HeroSection;