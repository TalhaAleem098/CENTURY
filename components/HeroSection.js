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

  const goTo = (idx) => setCurrent(idx);

  return (
    <div className="w-full mx-auto md:px-4 md:py-4">
      <div className="relative rounded-2xl overflow-hidden bg-[#e5e7eb] p-2 md:p-4">
        <div className="relative aspect-[16/9] w-full h-auto rounded-2xl overflow-hidden">
          <Image
            src={images[current]}
            alt={`Hero Image ${current + 1}`}
            fill
            className="object-cover w-full h-full rounded-2xl transition-all duration-700"
            priority
            quality={90}
            style={{ backgroundColor: '#e5e7eb' }}
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-2xl" />
          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-3 h-3 rounded-full border border-white bg-white/70 hover:bg-white transition-all duration-200 ${
                  current === idx ? "bg-blue-500 border-blue-500 scale-110" : ""
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
