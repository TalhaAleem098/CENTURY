"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('next');
  const [animationType, setAnimationType] = useState('zoomSlide'); // flipCube, zoomSlide, rotateScale, elastic

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

  // Animate to next must be defined before startAutoSlide to avoid ReferenceError
  const animateToNext = useCallback(() => {
    if (isAnimating) return;
    if (intervalRef.current) clearInterval(intervalRef.current); // Reset timer
    setIsAnimating(true);
    setAnimationDirection('next');
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
      startAutoSlide(); // Restart timer after animation
    }, 600);
  }, [isAnimating, images.length]);

  // Function to start the auto-slide interval
  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      animateToNext();
    }, 3000);
  }, [animateToNext]);

  // ...existing code...

  const animateToPrev = useCallback(() => {
    if (isAnimating) return;
    if (intervalRef.current) clearInterval(intervalRef.current); // Reset timer
    setIsAnimating(true);
    setAnimationDirection('prev');
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
      startAutoSlide(); // Restart timer after animation
    }, 600);
  }, [isAnimating, images.length, startAutoSlide]);

  // Auto-slide functionality with reset on manual navigation
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  const goToSlide = (index) => {
    if (index !== currentIndex && !isAnimating) {
      if (intervalRef.current) clearInterval(intervalRef.current); // Reset timer
      setIsAnimating(true);
      setAnimationDirection(index > currentIndex ? 'next' : 'prev');
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
        startAutoSlide(); // Restart timer after animation
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

  return (
    <div className="w-full mx-auto">
      {/* Animation Type Selector (hidden)
      <div className="bg-gray-100 p-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setAnimationType('flipCube')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            animationType === 'flipCube' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          3D Flip
        </button>
        <button
          onClick={() => setAnimationType('zoomSlide')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            animationType === 'zoomSlide' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          Zoom Slide
        </button>
        <button
          onClick={() => setAnimationType('rotateScale')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            animationType === 'rotateScale' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rotate Scale
        </button>
        <button
          onClick={() => setAnimationType('elastic')}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            animationType === 'elastic' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          Elastic
        </button>
      </div> */}
     

      <div className="relative overflow-hidden bg-[#e5e7eb]" style={{ perspective: '1000px' }}>
        {/* Main carousel container */}
        <div className="relative w-full h-auto">
          {/* Container for animated images */}
          <div className="relative w-full h-auto overflow-hidden">
            {/* Current Image */}
            <div className={`relative w-full ${currentAnimation}`}>
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
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation arrows with enhanced design */}
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

        {/* Enhanced dots indicator (hidden)
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`w-3 h-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                index === currentIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/60 hover:bg-white/80 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        */}

        {/* Enhanced image counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 text-sm backdrop-blur-sm rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
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