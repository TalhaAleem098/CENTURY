"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Product Card (copied and adapted from ProductsClient.js)
function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;
  const currentImage =
    images[currentImageIndex]?.url ||
    images[0]?.url ||
    "/assets/carousel-1.webp";
  const hasDiscount = product.sale?.percentage > 0;
  const originalPrice = product.price;
  const discountedPrice = hasDiscount
    ? originalPrice * (1 - product.sale.percentage / 100)
    : originalPrice;

  useEffect(() => {
    if (isHovered && hasMultipleImages) {
      setCurrentImageIndex(1);
    } else {
      setCurrentImageIndex(0);
    }
  }, [isHovered, hasMultipleImages]);

  return (
    <Link
      href={`/product/${product._id}`}
      className="block w-full rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-[320px] sm:h-[400px] lg:h-[480px] overflow-hidden rounded-t-lg">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
          <div
            className={`absolute top-3 left-3 bg-black/90 text-white px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            }`}
          >
            {product.category}
          </div>
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-white text-gray-900 px-2 py-1 rounded-md text-xs font-bold shadow-md border border-gray-200 rotate-3 flex items-center gap-1 select-none">
              <span className="text-red-500">-{product.sale.percentage}%</span>
              <span className="hidden sm:inline text-[10px] font-normal text-gray-500 ml-1">OFF</span>
            </div>
          )}
        </div>
        <div className="p-4 bg-white/90 backdrop-blur-sm rounded-b-lg">
          <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {product.name}
          </h3>
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
        </div>
      </div>
    </Link>
  );
}

export default function SearchResultsPage({ params }) {
  const pathname = usePathname();
  let query = "";
  if (pathname) {
    const match = pathname.match(/\/search\/q=\"(.+?)\"$/);
    if (match) {
      query = decodeURIComponent(match[1]);
    } else {
      const altMatch = pathname.match(/q=\"(.+)\"/);
      if (altMatch) query = decodeURIComponent(altMatch[1]);
    }
  }
  // Prevent query from being set as document.title or meta
  useEffect(() => {
    // Do nothing: don't set document.title or meta for query
  }, []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Results for <span className="text-blue-700">&quot;{query}&quot;</span>
        </h1>
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-lg">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
