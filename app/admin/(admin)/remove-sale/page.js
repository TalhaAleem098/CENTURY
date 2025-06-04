"use client";
import React, { useState, useEffect } from "react";
import ProductSaleCard from "@/components/ProductSaleCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaTag } from "react-icons/fa";
import Loading from "@/components/loading";
import RemoveSaleInstructions from "./RemoveSaleInstructions";

const PRODUCTS_PER_PAGE = 12;

const RemoveSalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [removeLoading, setRemoveLoading] = useState(false);
  // Fetch all products on component mount (no caching)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products/saled-products", {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
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
  }, []); // No dependencies - refetch every time component mounts

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

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
      }      setProducts((prev) => prev.filter((p) => !selected.includes(p._id)));
      setSelected([]);
      
      // Reset to page 1 if current page becomes empty after removal
      const remainingProducts = products.filter((p) => !selected.includes(p._id));
      const newTotalPages = Math.ceil(remainingProducts.length / PRODUCTS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(1);
      }
      
      if (data.message) {
        toast.info(data.message, {
          theme: "colored",
          style: { background: "#000", color: "#fff" },
        });
      }      toast.success(
        `Sale data completely removed from ${data.modifiedCount || selected.length} products!`,
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
      setSelected(paginatedProducts.map((p) => p._id));
    } else {
      setSelected([]);
    }
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Only clear selections if moving to a different page
      // This allows users to select across pages if needed
    }
  };
  return (
    <div className="min-h-screen bg-white py-8 px-2 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2 text-black text-center tracking-tight">
          Remove Sale from Products
        </h1>
        
        <RemoveSaleInstructions />
        
        <div className="border-b border-black mb-10" />
        
        {loading ? (
          <div className="text-center py-10 text-lg">
            <Loading />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : products.length === 0 ? (
          /* No Sale Products State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products with Active Sales</h3>
              <p className="text-gray-600 mb-6">
                There are currently no products with active sales to remove. Products will appear here when they have active sale pricing.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-left">
                    <div className="font-semibold text-blue-800">Tip</div>
                    <div className="text-blue-700 text-sm">You can apply sales to products using the &ldquo;Apply Sale&rdquo; page, then return here to manage them.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (        <>
          {/* Enhanced Selection Controls */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Select All Section */}
              <div className="flex items-center gap-4">
                <label className="flex items-center cursor-pointer select-none group">
                  <div className="relative">                    <input
                      type="checkbox"
                      checked={
                        selected.length === paginatedProducts.length &&
                        paginatedProducts.length > 0
                      }
                      onChange={handleSelectAll}
                      className="sr-only"
                      disabled={removeLoading}
                    />
                    <div className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                      selected.length === paginatedProducts.length && paginatedProducts.length > 0
                        ? 'bg-black border-black'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}>
                      {selected.length === paginatedProducts.length && paginatedProducts.length > 0 && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>                  <span className="ml-3 font-bold text-black text-lg">
                    Select All Products
                    {paginatedProducts.length > 0 && (
                      <span className="text-gray-600 font-medium ml-2">
                        ({paginatedProducts.length} on this page)
                      </span>
                    )}
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Selection Counter */}
                {selected.length > 0 && (
                  <div className="bg-red-100 border-2 border-red-300 rounded-xl px-4 py-2">
                    <span className="text-red-800 font-bold text-sm">
                      {selected.length} Product{selected.length !== 1 ? 's' : ''} Selected
                    </span>
                  </div>
                )}
                
                {/* Cancel Selection Button */}
                {selected.length > 0 && (
                  <button
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold shadow-lg hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 border-2 border-gray-600"
                    onClick={() => setSelected([])}
                    title="Cancel Selection"
                    disabled={removeLoading}
                  >
                    <FaTimes className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear Selection</span>
                    <span className="inline sm:hidden">Clear</span>
                  </button>
                )}
                
                {/* Remove Sale Button */}
                {selected.length > 0 && (
                  <button
                    className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 border-2 border-red-600 relative overflow-hidden"
                    onClick={handleRemoveSale}
                    title="Remove Sale from Selected Products"
                    disabled={removeLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform translate-x-[-100%] hover:translate-x-[100%] transition-all duration-700"></div>
                    <FaTag className="w-5 h-5" />
                    <span className="hidden sm:inline">
                      {removeLoading ? 'Removing...' : `Remove Sale (${selected.length})`}
                    </span>
                    <span className="inline sm:hidden">
                      {removeLoading ? 'Removing...' : `Remove (${selected.length})`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
            {paginatedProducts.map((product) => (
              <ProductSaleCard
                key={product._id}
                product={product}
                selected={selected.includes(product._id)}
                onSelect={() => handleSelect(product._id)}
              />
            ))}
          </div>{/* Enhanced Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 mb-10 shadow-sm">
              <div className="flex justify-center items-center gap-3">
                {/* Previous Button */}
                <button
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 border-2 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50 transform hover:scale-105 shadow-sm'
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNum = i + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        className={`w-12 h-12 rounded-xl font-bold transition-all duration-200 border-2 ${
                          isActive
                            ? 'bg-black text-white border-black shadow-lg transform scale-110'
                            : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50 transform hover:scale-105 shadow-sm'
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                {/* Next Button */}
                <button
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 border-2 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'bg-white text-black border-gray-300 hover:border-black hover:bg-gray-50 transform hover:scale-105 shadow-sm'
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
              
              {/* Page Info */}
              <div className="text-center mt-4">
                <span className="text-gray-600 font-medium">
                  Page {currentPage} of {totalPages} • {products.length} products with sales
                </span>
              </div>
            </div>
          )}        </>
        )}
      </div>
    </div>
  );
};

export default RemoveSalePage;
