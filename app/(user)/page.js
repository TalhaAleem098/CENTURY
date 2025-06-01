'use client';
import { useState, useEffect, useRef } from 'react';
import HeroSection from '../../components/HeroSection';
import Image from 'next/image';

// Fetch featured products from API
async function fetchFeaturedProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products?featured=true&limit=12`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

// Product Card Component
function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex]?.url || images[0]?.url || '/assets/carousel-1.webp';
  
  // Calculate discounted price
  const hasDiscount = product.sale?.percentage > 0;
  const originalPrice = product.price;
  const discountedPrice = hasDiscount ? originalPrice * (1 - product.sale.percentage / 100) : originalPrice;

  // Handle image hover animation - just transition, no zoom
  useEffect(() => {
    let timeout;
    if (isHovered && hasMultipleImages) {
      timeout = setTimeout(() => {
        setCurrentImageIndex(1);
      }, 300);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearTimeout(timeout);
  }, [isHovered, hasMultipleImages]);

  // Add to cart function
  const addToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: discountedPrice,
      originalPrice: originalPrice,
      image: currentImage,
      size: selectedSize,
      category: product.category,
      quantity: 1,
      addedAt: new Date().toISOString()
    };

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists with same size
    const existingItemIndex = existingCart.findIndex(
      item => item.id === product._id && item.size === selectedSize
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show success message
    const event = new CustomEvent('cartUpdated', { detail: existingCart });
    window.dispatchEvent(event);
    
    alert('Product added to cart!');
  };

  return (
    <div 
      className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - Larger */}
      <div className="relative h-96 overflow-hidden rounded-t-lg">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="320px"
          priority={index < 6}
        />
        
        {/* Category Overlay */}
        <div className={`absolute top-3 left-3 bg-black/90 text-white px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          {product.category}
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-gray-800 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{product.sale.percentage}%
          </div>
        )}
      </div>

      {/* Product Info - Smaller */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₨{discountedPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              ₨{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Sizes - Single Row */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {product.sizes.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 py-1 border rounded text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedSize === size
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-500'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={addToCart}
            className="flex-1 bg-gray-900 text-white py-2 px-3 rounded text-xs font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            Add to Cart
          </button>
          <button
            onClick={() => window.location.href = `/product/${product.slug || product._id}`}
            className="flex-1 border border-gray-900 text-gray-900 py-2 px-3 rounded text-xs font-medium hover:bg-gray-900 hover:text-white transition-all duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// Products Scroll Container with Navigation
function ProductsScrollContainer({ products }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons);
      return () => scrollElement.removeEventListener('scroll', checkScrollButtons);
    }
  }, [products]);

  return (
    <div className="relative w-full">
      {/* Navigation Buttons */}
      <button
        onClick={scrollLeft}
        disabled={!canScrollLeft}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center transition-all duration-200 ${
          canScrollLeft 
            ? 'hover:bg-gray-100 hover:border-gray-900 text-gray-900' 
            : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={scrollRight}
        disabled={!canScrollRight}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center transition-all duration-200 ${
          canScrollRight 
            ? 'hover:bg-gray-100 hover:border-gray-900 text-gray-900' 
            : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Products Container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-4 py-2 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map((product, index) => (
          <ProductCard 
            key={product._id || index} 
            product={product} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

// Main Products Section Component
function ProductsSection({ products }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="text-gray-700">Products</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked collection of premium fashion items. Each product is carefully selected 
            for quality, style, and comfort to elevate your wardrobe.
          </p>
          <div className="w-24 h-1 bg-gray-900 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Products Display */}
        {products && products.length > 0 ? (
          <ProductsScrollContainer products={products} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Available</h3>
            <p className="text-gray-500">Check back soon for amazing deals!</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featuredProducts = await fetchFeaturedProducts();
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div>
        <HeroSection />
        <section className="py-16 bg-gray-50">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading amazing products...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <ProductsSection products={products} />
    </div>
  );
}
