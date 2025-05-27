"use client";
import React from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [], title = "Featured Products", showTitle = true, isHomePage = false }) => {
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-12 0H4m4-8v8m8-8v8" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
          <p className="text-gray-600">Check back later for new arrivals!</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <div className="w-24 h-1 bg-black mx-auto"></div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product._id || product.id || index}
              product={product}
              className="h-full"
              isHomePage={isHomePage}
            />
          ))}
        </div>

        {products.length >= 6 && (
          <div className="text-center mt-8 sm:mt-12">
            <Link 
              href="/shop" 
              className="inline-block bg-black hover:bg-black text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 transform hover:scale-105"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
