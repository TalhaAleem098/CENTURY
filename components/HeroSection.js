"use client";
import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="relative w-full">
      {/* Hero Image */}
      <Image
        src="/carousel-1.jpg"
        alt="Hero Image"
        width={1920}
        height={1080}
        className="w-full h-auto object-cover pointer-events-none"
        priority
        quality={90}
      />
      
      {/* Optional subtle overlay for better image contrast if needed */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
};

export default HeroSection;
