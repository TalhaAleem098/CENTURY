"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingCart, Eye, Check, X, Star, Clock, Package, Truck } from "lucide-react";

function ProductCard({ product, index, onCartSuccess }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [show, setShow] = useState(false);

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const currentImage =
    images[currentImageIndex]?.url ||
    images[0]?.url ||
    "/assets/carousel-1.webp";

  // Calculate discounted price
  const hasDiscount = product.sale?.percentage > 0;
  const originalPrice = product.price;
  const discountedPrice = hasDiscount
    ? originalPrice * (1 - product.sale.percentage / 100)
    : originalPrice;

  // Handle image hover animation - quick transition, no delay
  useEffect(() => {
    if (isHovered && hasMultipleImages) {
      setCurrentImageIndex(1);
    } else {
      setCurrentImageIndex(0);
    }
  }, [isHovered, hasMultipleImages]);

  // Show animation on mount
  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 60 * index);
    return () => clearTimeout(timeout);
  }, [index]);

  // Add to cart function
  const addToCart = (e) => {
    // Prevent event bubbling to the link
    e.preventDefault();
    e.stopPropagation();
    
    // Create cart item object
    const cartItem = {
      id: product._id,
      name: product.name,
      price: discountedPrice,
      originalPrice: originalPrice,
      image: currentImage,
      category: product.category,
      quantity: 1,
      addedAt: new Date().toISOString(),
    };

    // Only add size if one is selected
    if (selectedSize) {
      cartItem.size = selectedSize;
    }

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if item already exists (with same size if size is selected)
    const existingItemIndex = existingCart.findIndex(
      (item) =>
        item.id === product._id &&
        (selectedSize ? item.size === selectedSize : !item.size)
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
      toast("Quantity updated in cart! 🛒", {});
      // Show modal for quantity update
      onCartSuccess({
        ...cartItem,
        quantity: existingCart[existingItemIndex].quantity,
        isUpdate: true,
      });
    } else {
      existingCart.push(cartItem);
      toast("Product added to cart successfully! 🎉", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Show modal for new item
      onCartSuccess({
        ...cartItem,
        isUpdate: false,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Show success message
    const event = new CustomEvent("cartUpdated", { detail: existingCart });
    window.dispatchEvent(event);
  };

  // Handle view details button click
  const handleViewDetails = (e) => {
    // Prevent event bubbling to the link
    e.preventDefault();
    e.stopPropagation();
    router.push(`/product/${product._id}`);
  };

  // Handle size selection
  const handleSizeSelect = (e, size) => {
    // Prevent event bubbling to the link
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  return (
    <Link
      href={`/product/${product._id}`}
      className={`block w-full rounded-lg shadow-md hover:shadow-xl transition-all duration-700 group cursor-pointer ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container - 1.5:1 aspect ratio */}
        <div className="relative h-[320px] sm:h-[400px] lg:h-[480px] overflow-hidden rounded-t-lg">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 6}
          />

          {/* Category Overlay */}
          <div
            className={`absolute top-3 left-3 bg-black/90 text-white px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            {product.category}
          </div>

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-white text-gray-900 px-2 py-1 rounded-md text-xs font-bold shadow-md border border-gray-200 rotate-3 flex items-center gap-1 select-none">
              <span className="text-red-500">-{product.sale.percentage}%</span>
              <span className="hidden sm:inline text-[10px] font-normal text-gray-500 ml-1">OFF</span>
            </div>
          )}
        </div>

        {/* Product Info - Smaller */}
        <div className="p-4 bg-white/90 backdrop-blur-sm rounded-b-lg">
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
                    onClick={(e) => handleSizeSelect(e, size)}
                    className={`px-2 py-1 border rounded text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
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
              className="flex-1 bg-gray-900 text-white py-2 px-3 rounded text-xs font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <ShoppingCart size={12} />
              Add to Cart
            </button>
            <button
              onClick={handleViewDetails}
              className="flex-1 border border-gray-900 text-gray-900 py-2 px-3 rounded text-xs font-medium hover:bg-gray-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-1"
            >
              <Eye size={12} />
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Products Grid Container
function ProductsGridContainer({ products, onCartSuccess }) {
  const [showAll, setShowAll] = useState(false);
  const productsToShow = showAll ? products : products.slice(0, 9); // Show 9 products initially (3 rows)

  return (
    <div className="w-full">
      {/* Products Grid - 3 products per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-2">
        {productsToShow.map((product, index) => (
          <ProductCard
            key={product._id || index}
            product={product}
            index={index}
            onCartSuccess={onCartSuccess}
          />
        ))}
      </div>

      {/* Show More Button */}
      {products.length > 9 && !showAll && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            Show More Products ({products.length - 9} more)
          </button>
        </div>
      )}

      {/* Show Less Button */}
      {showAll && products.length > 9 && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setShowAll(false);
              // Scroll to products section
              document
                .querySelector(".products-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-200 font-medium"
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
}

// Sold Out State Component
function SoldOutState() {
  return (
    <div className="text-center py-20 px-4">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
          <Package size={48} className="text-gray-400" />
        </div>
        
        {/* Main Message */}
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          All Items Sold Out!
        </h3>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Thank you for the overwhelming response! All our current collection items are sold out. 
          We&apos;re working hard to bring you exciting new arrivals.
        </p>
        
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center p-4  rounded-lg">
            <Clock size={24} className="text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">New Arrivals</span>
            <span className="text-xs text-gray-600">Coming Soon</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg">
            <Star size={24} className="text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Premium Quality</span>
            <span className="text-xs text-gray-600">Always Guaranteed</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg">
            <Truck size={24} className="text-gray-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Fast Delivery</span>
            <span className="text-xs text-gray-600">Nationwide</span>
          </div>
        </div>
       
      </div>
    </div>
  );
}

// Main Products Section Component
function ProductsSection({ products, onCartSuccess }) {
  return (
    <section className="py-8 bg-gray-50 products-section">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            VOLUME <span className="text-gray-700">I-C100</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The First Chapter Of Your Century
          </p>
          <div className="w-24 h-1 bg-gray-900 mx-auto mt-6 rounded-full"></div>
        </div>
        {products && products.length > 0 ? (
          <ProductsGridContainer
            products={products}
            onCartSuccess={onCartSuccess}
          />
        ) : (
          <SoldOutState />
        )}
      </div>
    </section>
  );
}

// Video Section Component
function VideoSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {});
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
        <source
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm"
          type="video/webm"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Experience Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Story
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Dive into the world of premium fashion. Watch how we craft
            excellence, one product at a time, bringing you the finest
            collection curated with passion.
          </p>
        </div>
      </div>
    </section>
  );
}

// Cart Success Modal Component
function CartSuccessModal({ isOpen, onClose, cartItem }) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Calculate total cart items
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    }
  }, [isOpen]);

  if (!isOpen || !cartItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-green-50 px-6 py-4 border-b border-green-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  {cartItem.isUpdate ? "Cart Updated!" : "Added to Cart!"}
                </h3>
                <p className="text-sm text-green-600">
                  {cartItem.isUpdate
                    ? "Quantity increased"
                    : "Product successfully added"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={cartItem.image}
                alt={cartItem.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">
                {cartItem.name}
              </h4>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">
                  ₨{cartItem.price.toLocaleString()}
                </span>
                {cartItem.originalPrice !== cartItem.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₨{cartItem.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {cartItem.size && (
                  <span>
                    Size: <span className="font-medium">{cartItem.size}</span>
                  </span>
                )}
                <span>
                  Qty: <span className="font-medium">{cartItem.quantity}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total items in cart:</span>
              <span className="font-semibold text-gray-900">{cartCount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => {
                onClose();
                router.push("/cart");
              }}
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Client Component that handles all interactive parts
export default function ProductsClient({ products }) {
  // console.log('Products from database:', products);

  const [showCartModal, setShowCartModal] = useState(false);
  const [cartModalData, setCartModalData] = useState(null);

  const handleCartSuccess = (cartItem) => {
    setCartModalData(cartItem);
    setShowCartModal(true);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
    setCartModalData(null);
  };

  return (
    <>
      <ProductsSection products={products} onCartSuccess={handleCartSuccess} />
      <VideoSection />
      <CartSuccessModal
        isOpen={showCartModal}
        onClose={closeCartModal}
        cartItem={cartModalData}
      />
      <ToastContainer />
    </>
  );
}