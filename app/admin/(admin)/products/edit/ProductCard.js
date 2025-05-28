import Image from "next/image";
import { useState } from "react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const mainImage = product.images?.[0]?.url;
  const hoverImage = product.images?.[1]?.url;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/delete?id=${product._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        setDeleting(false);
        alert("Failed to delete product");
        return;
      }
      // Call the onDelete callback to remove the card from UI
      if (onDelete) onDelete(product._id);
    } catch (err) {
      setDeleting(false);
      alert("Network error while deleting product");
    }
  };

  return (
    <div
      className={`rounded-xl md:p-6 flex flex-col items-center w-full max-w-xs bg-white hover:shadow-sm cursor-pointer transition-shadow duration-300 relative overflow-hidden group ${
        deleting ? "opacity-60 pointer-events-none grayscale" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 via-white to-gray-200 border border-black shadow-sm">
        {mainImage && (
          <>
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                hovered && hoverImage ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 600px) 100vw, 300px"
            />
            {hoverImage && (
              <Image
                src={hoverImage}
                alt={`${product.name} alt`}
                fill
                className={`object-cover absolute top-0 left-0 transition-opacity duration-300 ${
                  hovered ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 600px) 100vw, 300px"
              />
            )}
          </>
        )}
        {/* Trash (delete) icon button, only visible on hover */}
        <button
          className="absolute top-3 right-3 z-10 bg-white bg-opacity-90 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-300 hover:bg-red-100 hover:scale-110 focus:outline-none"
          title="Delete Product"
          tabIndex={-1}
          onClick={handleDelete}
          disabled={deleting}
        >
          {/* Trash icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 11v6M14 11v6"
            />
          </svg>
        </button>
        <div className="absolute inset-0 pointer-events-none rounded-2xl" />
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
        <div className="w-full flex justify-center">
          <button
            className="self-center mt-2 px-6 py-2 rounded-md bg-gradient-to-r from-black to-gray-800 text-white font-semibold shadow hover:from-gray-900 hover:to-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-sm tracking-wide text-center"
            onClick={onEdit}
            disabled={deleting}
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;