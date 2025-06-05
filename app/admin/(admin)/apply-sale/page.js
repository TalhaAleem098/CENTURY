"use client";
import React, { useState, useEffect } from "react";
import ProductSaleCard from "@/components/ProductSaleCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaTag } from "react-icons/fa";
import Loading from "@/components/loading";
import ApplySaleInstructions from "./ApplySaleInstructions";

const PRODUCTS_PER_PAGE = 12;

const SaleModal = ({ open, onClose, onApply, selectedProducts, loading }) => {
  const [form, setForm] = useState({
    start: "",
    end: "",
    percentage: "",
  });
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-2xl"
          onClick={onClose}
          disabled={loading}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Apply Sale</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onApply(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block font-semibold mb-1">Start Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={form.start}
              onChange={(e) =>
                setForm((f) => ({ ...f, start: e.target.value }))
              }
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={form.end}
              onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Sale Percentage (%)
            </label>
            <input
              type="number"
              min="1"
              max="99"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={form.percentage}
              onChange={(e) =>
                setForm((f) => ({ ...f, percentage: e.target.value }))
              }
              required
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline border border-gray-400 px-4 py-2 rounded-lg"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary bg-black text-white px-4 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? "Applying..." : "Apply Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ApplySalePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products/no-saled-products", {
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
  }, []);

  // Pagination logic
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

  const handleApplySale = async (saleData) => {
    if (selected.length === 0) {
      toast("No products selected.", {
        theme: "colored",
        style: { background: "#000", color: "#fff" },
      });
      return;
    }
    setApplyLoading(true);
    const payload = {
      ids: selected,
      percentage: Number(saleData.percentage),
      start: saleData.start
        ? new Date(saleData.start).toISOString()
        : undefined,
      end: saleData.end ? new Date(saleData.end).toISOString() : undefined,
    };
    try {
      const res = await fetch("/api/apply-sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Failed to apply sale.", {
          theme: "colored",
          style: { background: "#000", color: "#fff" },
        });
        setApplyLoading(false);
        return;
      }
      // Remove products that now have sale applied
      setProducts((prev) => prev.filter((p) => !selected.includes(p._id)));
      setModalOpen(false);
      setSelected([]);
      toast(
        `Sale applied to ${data.modifiedCount || selected.length} products!`,
        { theme: "colored", style: { background: "#000", color: "#fff" } }
      );
    } catch (err) {
      toast(err.message || "Error applying sale.", {
        theme: "colored",
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setApplyLoading(false);
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
    setCurrentPage(page);
    setSelected([]); // Optionally clear selection on page change
  };
  return (
    <div className="min-h-screen bg-white py-8 px-2 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2 text-black text-center tracking-tight">
          Apply Sale to Products
        </h1>
        
        <ApplySaleInstructions />
        
        <div className="border-b border-black mb-10" />
      {loading ? (
        <div className="text-center py-10 text-lg">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : (        <>          {/* Enhanced Selection Controls */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Select All Section */}
              <div className="flex items-center gap-4">
                <label className="flex items-center cursor-pointer select-none group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === paginatedProducts.length &&
                        paginatedProducts.length > 0
                      }
                      onChange={handleSelectAll}
                      className="sr-only"
                    />
                    <div className={`w-8 h-8 rounded-xl border-2 transition-all duration-200 flex items-center justify-center shadow-sm ${
                      selected.length === paginatedProducts.length && paginatedProducts.length > 0
                        ? 'bg-blue-600 border-blue-600 shadow-lg ring-2 ring-blue-300'
                        : 'border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50'
                    }`}>
                      {selected.length === paginatedProducts.length && paginatedProducts.length > 0 && (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-3 font-bold text-black text-lg">
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
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-xl px-4 py-2">
                    <span className="text-blue-800 font-bold text-sm">
                      {selected.length} Product{selected.length !== 1 ? 's' : ''} Selected
                    </span>
                  </div>
                )}
                
                {/* Cancel Selection Button */}
                {selected.length > 0 && (
                  <button
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 border-2 border-red-600"
                    onClick={() => setSelected([])}
                    title="Cancel Selection"
                  >
                    <FaTimes className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear Selection</span>
                    <span className="inline sm:hidden">Clear</span>
                  </button>
                )}
                
                {/* Apply Sale Button */}
                {selected.length > 0 && (
                  <button
                    className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 border-2 border-green-600 relative overflow-hidden"
                    onClick={() => setModalOpen(true)}
                    title="Apply Sale to Selected Products"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform translate-x-[-100%] hover:translate-x-[100%] transition-all duration-700"></div>
                    <FaTag className="w-5 h-5" />
                    <span className="hidden sm:inline">
                      Apply Sale ({selected.length})
                    </span>
                    <span className="inline sm:hidden">
                      Apply ({selected.length})
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
            {paginatedProducts.map((product) => (
              <ProductSaleCard
                key={product._id}
                product={product}
                selected={selected.includes(product._id)}
                onSelect={() => handleSelect(product._id)}
              />
            ))}
          </div>          {/* Enhanced Pagination Controls */}
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
                  Page {currentPage} of {totalPages} • {products.length} total products
                </span>
              </div>
            </div>
          )}
        </>
      )}
      <SaleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={handleApplySale}
        selectedProducts={selected}
        loading={applyLoading}
      />
     
      </div>
    </div>
  );
};

export default ApplySalePage;
