"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const heroImages = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/4.png",
  "/assets/5.png",
  "/assets/6.png"
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let timeout;
    const nextImage = () => {
      setFade(false);
      timeout = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % heroImages.length);
        setFade(true);
        timeout = setTimeout(nextImage, 5000);
      }, 400); // fade out duration
    };
    timeout = setTimeout(nextImage, 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full mx-auto">
      <div className="relative overflow-hidden bg-[#e5e7eb]">
        <div className="relative w-full h-auto overflow-hidden min-h-[100vh]" style={{ maxHeight: '100vh' }}>
          <Image
            key={current}
            src={heroImages[current]}
            alt="Hero Image"
            fill
            className={`object-cover w-full h-full transition-opacity duration-400 ${fade ? 'opacity-100' : 'opacity-0'}`}
            priority
            quality={90}
            style={{ backgroundColor: '#e5e7eb', maxHeight: '100vh' }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
