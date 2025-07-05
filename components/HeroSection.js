"use client"
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mobileImages = [
    "/assets/1.webp",
    "/assets/2.webp",
    "/assets/3.webp",
    "/assets/4.webp",
    "/assets/5.webp",
    "/assets/6.webp"
  ];
  const desktopImages = [
    "/assets/7.webp",
    "/assets/8.webp",
    "/assets/9.webp",
    "/assets/10.webp",
    "/assets/11.webp",
    "/assets/12.webp"
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);



  return (
    <div className="w-full mx-auto">
      <div className="relative overflow-hidden bg-[#e5e7eb]">
        <div className="relative w-full h-auto">
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
        {/* No dots/buttons for manual slide selection - fully automatic carousel */}
      </div>
    </div>
  );
};

export default HeroSection;