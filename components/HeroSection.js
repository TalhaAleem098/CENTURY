"use client";
import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="w-full  mx-auto md:px-4 md:py-4">
      <div className="relative rounded-2xl overflow-hidden bg-[#e5e7eb] p-2 md:p-4">
        {/* Hero Image with real aspect ratio and background fill */}
        <div className="relative aspect-[16/9] w-full h-auto rounded-2xl overflow-hidden">
          <Image
            src="/carousel-1.jpg"
            alt="Hero Image"
            fill
            className="object-cover w-full h-full rounded-2xl"
            priority
            quality={90}
            style={{ backgroundColor: '#e5e7eb' }}
          />
          {/* Optional subtle overlay for better image contrast if needed */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
