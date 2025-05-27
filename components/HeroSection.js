"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const images = ["/assets/carousel-1.webp", "/assets/carousel-2.webp"];

const heroContent = [
  {
    title: "Winter Sale Collection",
    subtitle: "Up to 50% Off on Premium Clothing",
    description:
      "Discover our exclusive winter collection featuring oversized tees, hoodies, and sweatshirts. Limited time offer!",
    ctaText: "Shop Now",
    ctaLink: "/category?type=oversized-tees",
  },
  {
    title: "Premium Quality Fashion",
    subtitle: "Comfort Meets Style",
    description:
      "Experience the perfect blend of comfort and style with our carefully curated collection of premium apparel.",
    ctaText: "Explore Collection",
    ctaLink: "/shop",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image with fade/scale animation */}
      <div
        key={currentSlide}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out animate-hero-fade"
        style={{ backgroundImage: `url(${images[currentSlide]})` }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-700"
        style={{ opacity: 0.5 }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white max-w-4xl mx-auto animate-hero-content">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight animate-hero-title">
            {heroContent[currentSlide].title}
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 text-green-200 animate-hero-subtitle">
            {heroContent[currentSlide].subtitle}
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-hero-desc">
            {heroContent[currentSlide].description}
          </p>
          <Link
            href={heroContent[currentSlide].ctaLink}
            className="inline-block bg-black hover:bg-black text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300 transform hover:scale-105 animate-hero-cta"
          >
            {heroContent[currentSlide].ctaText}
          </Link>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
