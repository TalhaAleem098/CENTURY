"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProduct(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex justify-center items-center">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-lg object-contain bg-gray-100"
              priority
            />
          ) : (
            <div className="w-80 h-80 bg-gray-200 flex items-center justify-center rounded-lg">No Image</div>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-lg text-gray-600 mb-2">{product.brand}</div>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-2xl font-semibold text-blue-600">${product.price}</span>
            {product.sale?.percentage > 0 && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                {product.sale.percentage}% OFF
              </span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Material:</span> {product.material || "-"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Color:</span> {product.color || "-"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Gender:</span> {product.gender || "-"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Available Sizes:</span> {product.sizes?.join(", ") || "-"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Stock:</span> {product.stock}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Description:</span>
            <p className="text-gray-700 mt-1">{product.description}</p>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Dimensions:</span>
            <ul className="list-disc ml-6">
              {product.dimensions &&
                Object.entries(product.dimensions).map(([size, dim]) => (
                  <li key={size}>
                    <span className="font-medium">{size}:</span> {dim.height}cm x {dim.width}cm
                  </li>
                ))}
            </ul>
          </div>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold shadow">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
