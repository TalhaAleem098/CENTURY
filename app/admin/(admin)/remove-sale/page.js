"use client";
import React, { useState, useEffect } from "react";
import ProductSaleCard from "@/components/ProductSaleCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaTag } from "react-icons/fa";
import Loading from "@/components/loading";

const PRODUCTS_PER_PAGE = 12;

const RemoveSalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/products/saled-products?limit=${PRODUCTS_PER_PAGE}&skip=${
            (currentPage - 1) * PRODUCTS_PER_PAGE
          }`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || "Error fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]);

  const totalPages = 1; // You can add a count API for real total pages if needed

  const handleSelect = (id) => {
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]
    );
  };

  const handleRemoveSale = async () => {
    if (selected.length === 0) {
      toast.error("No products selected.", {
        theme: "colored",
        style: { background: "#000", color: "#fff" },
      });
      return;
    }
    setRemoveLoading(true);
    try {
      const res = await fetch("/api/remove-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <-- this is critical for cookie auth!
        body: JSON.stringify({ ids: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to remove sale.", {
          theme: "colored",
          style: { background: "#000", color: "#fff" },
        });
        setRemoveLoading(false);
        return;
      }
      setProducts((prev) => prev.filter((p) => !selected.includes(p._id)));
      setSelected([]);
      if (data.message) {
        toast.info(data.message, {
          theme: "colored",
          style: { background: "#000", color: "#fff" },
        });
      }
      toast.success(
        `Sale removed from ${data.modifiedCount || selected.length} products!`,
        { theme: "colored", style: { background: "#000", color: "#fff" } }
      );
    } catch (err) {
      toast.error(err.message || "Error removing sale.", {
        theme: "colored",
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setRemoveLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(products.map((p) => p._id));
    } else {
      setSelected([]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-2 sm:px-6 lg:px-12">
      <h1 className="text-4xl font-extrabold mb-2 text-black text-center tracking-tight">
        Remove Sale from Products
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Select products with an active sale and remove their sale status.
      </p>
      <div className="border-b border-black mb-10" />
      {loading ? (
        <div className="text-center py-10 text-lg">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6 min-h-[48px]">
            <label className="flex items-center cursor-pointer select-none h-12">
              <input
                type="checkbox"
                checked={
                  selected.length === products.length && products.length > 0
                }
                onChange={handleSelectAll}
                className="form-checkbox h-6 w-6 text-black border-black focus:ring-black rounded transition-all duration-150 mr-2"
                disabled={removeLoading}
              />
              <span className="font-semibold text-black">
                <span className="hidden sm:inline">Select All</span>
                <span className="inline sm:hidden">All</span>
              </span>
            </label>
            <div className="flex gap-4 h-12">
              {selected.length > 0 && (
                <button
                  className="flex items-center gap-2 px-4 py-2 h-12 rounded bg-black text-white font-semibold shadow hover:bg-gray-900 transition"
                  onClick={() => setSelected([])}
                  title="Cancel Selection"
                  style={{ minWidth: 48 }}
                  disabled={removeLoading}
                >
                  <FaTimes className="w-4 h-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              )}
              {selected.length > 0 && (
                <button
                  className="flex items-center gap-2 px-4 py-2 h-12 rounded bg-black text-white font-semibold shadow hover:bg-gray-900 transition"
                  onClick={handleRemoveSale}
                  title="Remove Sale"
                  style={{ minWidth: 48 }}
                  disabled={removeLoading}
                >
                  <FaTag className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Remove Sale ({selected.length})
                  </span>
                  <span className="inline sm:hidden">Remove</span>
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
            {products.map((product) => (
              <ProductSaleCard
                key={product._id}
                product={product}
                selected={selected.includes(product._id)}
                onSelect={() => handleSelect(product._id)}
              />
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-10">
              <button
                className="px-3 py-1 rounded border border-gray-400 bg-white disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded border border-gray-400 ${
                    currentPage === i + 1 ? "bg-black text-white" : "bg-white"
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded border border-gray-400 bg-white disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="rounded-xl shadow-lg bg-black text-base font-semibold"
        bodyClassName="text-gray-900 bg-black"
      />
    </div>
  );
};

export default RemoveSalePage;
