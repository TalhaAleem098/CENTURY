"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaShoppingCart, FaHeart, FaEye } from "react-icons/fa";
import gsap from "gsap";

const ProductCard = ({ product, className = "", isHomePage = false }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const imageRef = useRef(null);
  const overlayImageRef = useRef(null);

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image] 
    : [];
  
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex] || images[0] || '';

  const calculateDiscountedPrice = (originalPrice, salePercentage) => {
    return (originalPrice * (1 - salePercentage / 100)).toFixed(2);
  };

  const hasActiveSale = product.sale && product.sale.percentage > 0;  const handleMouseEnter = () => {
    if (!isHomePage) return;
    
    setIsHovered(true);
    if (hasMultipleImages && images.length > 1) {
      if (imageRef.current && overlayImageRef.current) {
        gsap.to(imageRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.set(overlayImageRef.current, { opacity: 0 });
        gsap.to(overlayImageRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });
      }
      setCurrentImageIndex(1);
    } else {
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1.1,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isHomePage) return;
    
    setIsHovered(false);
    if (hasMultipleImages && images.length > 1) {
      if (imageRef.current && overlayImageRef.current) {
        gsap.to(overlayImageRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out"
        });
        gsap.to(imageRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });
      }
      setCurrentImageIndex(0);
    } else {
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    }
  };
  return (
    <div
      className={`group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`relative overflow-hidden bg-gray-100 ${isHomePage ? 'aspect-[4/5]' : 'aspect-square'}`}>
        {hasActiveSale && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm font-bold z-10">
            -{product.sale.percentage}%
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors duration-200">
            <FaHeart className="text-gray-600 hover:text-red-500 text-sm" />
          </button>
          <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors duration-200">
            <FaEye className="text-gray-600 hover:text-green-600 text-sm" />
          </button>
        </div>        {currentImage && !imageError ? (
          <>
            <Image
              ref={imageRef}
              src={currentImage}
              alt={product.name || "Product"}
              fill
              className={`object-cover transition-transform duration-300 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              } ${!isHomePage ? 'group-hover:scale-105' : ''}`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setImageError(true);
                setIsImageLoading(false);
              }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {isHomePage && hasMultipleImages && images[1] && (
              <Image
                ref={overlayImageRef}
                src={images[1]}
                alt={product.name || "Product"}
                fill
                className="object-cover absolute inset-0 opacity-0"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-400">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs sm:text-sm">No Image</p>
            </div>
          </div>
        )}

        {isImageLoading && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-xs sm:text-sm">Loading...</div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 lg:p-5">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base lg:text-lg leading-tight">
          {product.name || "Unnamed Product"}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {hasActiveSale ? (
              <>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                  ${calculateDiscountedPrice(product.price, product.sale.percentage)}
                </span>
                <span className="text-sm sm:text-base text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>
        </div>        <button className="w-full bg-black hover:bg-black text-white font-medium py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base transition-colors duration-200 flex items-center justify-center gap-2 group">
          <FaShoppingCart className="text-sm group-hover:scale-110 transition-transform duration-200" />
          <span>Add to Cart</span>
        </button>

        {product.category && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
