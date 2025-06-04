"use client";
import React, { useState, useEffect } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import Image from "next/image";

const carouselTexts = [
  "FREE SHIPPING ON ORDERS ABOVE 4999",
  "CULT OF CYPHER VOLUME 1 IS LIVE NOW",
  "LIMITED TIME DEALS JUST FOR YOU",
  "COD AVAILABLE ACROSS PAKISTAN",
  "FOLLOW US FOR STYLE UPDATES",
];

const Ribon = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselTexts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextText = () => {
    setCurrent((prev) => (prev + 1) % carouselTexts.length);
  };

  const prevText = () => {
    setCurrent(
      (prev) => (prev - 1 + carouselTexts.length) % carouselTexts.length
    );
  };

  return (
    <div className="w-full bg-black text-white text-sm py-2 px-4 flex items-center justify-between gap-4 border-b border-gray-800">      {/* Left Icons */}
      <div className="hidden md:flex gap-2">
        <a
          href="https://www.facebook.com/profile.php?id=61576551254002"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white border border-white rounded-full p-2 hover:bg-white hover:text-black transition"
        >
          <FaFacebookF size={14} />
        </a>
        <a
          href="https://www.instagram.com/century.pk?igsh=aHJvemhjbHdncXhk&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white border border-white rounded-full p-2 hover:bg-white hover:text-black transition"
        >
          <FaInstagram size={14} />
        </a>
        <a
          href="http://www.tiktok.com/@century.pk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white border border-white rounded-full p-2 hover:bg-white hover:text-black transition"
        >
          <SiTiktok size={14} />
        </a>
      </div>

      {/* Middle Text */}
      <div className="flex items-center justify-center gap-2 flex-1 max-w-[90%] mx-auto overflow-hidden h-6 sm:h-7 md:h-8">
        <button
          onClick={prevText}
          className="hidden sm:block text-white hover:bg-white hover:text-black transition px-2 py-1 rounded"
        >
          &#8592;
        </button>
        <div className="relative w-full text-center">
          <div
            key={current}
            className="text-[11px] sm:text-sm md:text-base font-medium animate-slideFade"
          >
            {carouselTexts[current]}
          </div>
        </div>
        <button
          onClick={nextText}
          className="hidden sm:block text-white hover:bg-white hover:text-black transition px-2 py-1 rounded"
        >
          &#8594;
        </button>
      </div>

      {/* Right Logo */}
      <div className="hidden md:block w-[90px] h-[35px] relative">
        <Image
          src="/CENTURY.png"
          alt="Logo"
          fill
          className="object-contain"
          sizes="90px"
          priority
        />
      </div>
    </div>
  );
};

export default Ribon;
