import Image from "next/image";
import React, { useState } from "react";

// Product details modal, now inside this file
const ProductDetailsModal = ({ open, onClose, product }) => {
  if (!open || !product) return null;
  const mainImage = product.images?.[0]?.url;
  const secondaryImages = product.images?.slice(1) || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[95vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-2xl text-black"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          {product.name}
        </h2>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-64 h-64 relative rounded-xl overflow-hidden border border-gray-300 mb-2">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            {secondaryImages.length > 0 && (
              <div className="flex gap-2 mt-2">
                {secondaryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-16 h-16 relative rounded border border-gray-200 overflow-hidden"
                  >
                    <Image
                      src={img.url}
                      alt={product.name + " secondary"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-4 text-base text-black">
              <span>
                <b>Brand:</b> {product.brand || <span className="text-gray-400">N/A</span>}
              </span>
              <span>
                <b>Price:</b> {product.price}
              </span>
              <span>
                <b>Stock:</b> {product.stock}
              </span>
              <span>
                <b>Sold:</b> {product.sold}
              </span>
              <span>
                <b>Category:</b> {product.category}
              </span>
              <span>
                <b>Gender:</b> {product.gender}
              </span>
              <span>
                <b>Material:</b> {product.material}
              </span>
              <span>
                <b>Color:</b> {product.color}
              </span>
              <span>
                <b>Featured:</b> {product.isFeatured ? 'Yes' : 'No'}
              </span>
              <span>
                <b>Rating:</b> {product.rating}
              </span>
              <span>
                <b>Reviews:</b> {product.reviews}
              </span>
            </div>
            <div className="mt-4">
              <b>Description:</b>
              <div className="whitespace-pre-line text-gray-700 mt-1">
                {product.description}
              </div>
            </div>
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <b>Sizes & Dimensions:</b>
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.sizes.map((size) => (
                    <div
                      key={size}
                      className="px-3 py-1 bg-gray-100 rounded text-sm font-semibold flex items-center gap-2"
                    >
                      <span>{size.toUpperCase()}</span>
                      {product.dimensions && product.dimensions[size] && (
                        <span className="text-gray-500">
                          {product.dimensions[size].height} x{" "}
                          {product.dimensions[size].width}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 text-xs text-gray-400">
              <div>
                <b>Created:</b>{" "}
                {product.createdAt?.$date
                  ? new Date(product.createdAt.$date).toLocaleString()
                  : ""}
              </div>
              <div>
                <b>Updated:</b>{" "}
                {product.updatedAt?.$date
                  ? new Date(product.updatedAt.$date).toLocaleString()
                  : ""}
              </div>
              <div>
                <b>ID:</b> {product._id?.$oid || product._id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// props: product (object), selected (bool), onSelect (function)
const ProductSaleCard = ({ product, selected, onSelect }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const mainImage = product.images?.[0]?.url;
  return (
    <div
      className={`rounded-xl md:p-6 flex flex-col items-center w-full max-w-xs bg-white hover:shadow-md cursor-pointer transition-shadow duration-300 relative overflow-hidden group border border-gray-300`}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 via-white to-gray-200 border border-black shadow-sm">
        {mainImage && (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 600px) 100vw, 300px"
          />
        )}
        {/* Selection tick button over image */}
        {typeof onSelect === "function" && (
          <button
            type="button"
            className={`absolute top-3 right-3 z-10 rounded-full p-2 shadow-lg border-2 transition-colors duration-200 focus:outline-none bg-white/90 hover:bg-black flex items-center justify-center ${
              selected ? "border-black" : "border-gray-300"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            aria-label={selected ? "Deselect product" : "Select product"}
            style={{ width: 36, height: 36 }}
          >
            {selected ? (
              <span className="flex items-center justify-center w-full h-full rounded-full bg-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            ) : (
              <span className="flex items-center justify-center w-full h-full rounded-full bg-white border-2 border-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-400"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </span>
            )}
          </button>
        )}
        {/* View Details button */}
        <button
          type="button"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded bg-black text-white font-semibold shadow hover:bg-black transition text-xs flex items-center justify-center gap-2 w-[89%] sm:min-w-[120px]"
          onClick={(e) => {
            e.stopPropagation();
            setDetailsOpen(true);
          }}
          aria-label="View Details"
        >
          {/* Icon: show always, text: hide on xs, show on sm+ */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 sm:mr-1"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-7 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z"
            />
          </svg>
          <span className="">View Details</span>
        </button>
        <ProductDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          product={product}
        />
      </div>
      <div className="flex flex-col items-start w-full flex-1 justify-between py-3">
        <h2
          className="text-lg font-bold mb-1 text-left text-black truncate w-full"
          title={product.name}
        >
          {product.name}
        </h2>
        {product.price && (
          <p
            className="text-left font-semibold mb-2 w-full"
            style={{ fontFamily: "sans-serif", color: "#15803d" }}
          >
            Price: {product.price}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSaleCard;
