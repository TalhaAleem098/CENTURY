"use client";
import React, { useState, useEffect } from "react";
import ProductSaleCard from "@/components/ProductSaleCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaTag } from "react-icons/fa";
import Loading from "@/components/loading";

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
        const res = await fetch("/api/products/no-saled-products");
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
      toast.error("No products selected.", {
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
        toast.error(data.error || "Failed to apply sale.", {
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
      toast.success(
        `Sale applied to ${data.modifiedCount || selected.length} products!`,
        { theme: "colored", style: { background: "#000", color: "#fff" } }
      );
    } catch (err) {
      toast.error(err.message || "Error applying sale.", {
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
      <h1 className="text-4xl font-extrabold mb-2 text-black text-center tracking-tight">
        Apply Sale to Products
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Select products and apply a sale. You can select multiple products and
        set sale details.
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
                  selected.length === paginatedProducts.length &&
                  paginatedProducts.length > 0
                }
                onChange={handleSelectAll}
                className="form-checkbox h-6 w-6 text-black border-black focus:ring-black rounded transition-all duration-150 mr-2"
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
                >
                  <FaTimes className="w-4 h-4" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              )}
              {selected.length > 0 && (
                <button
                  className="flex items-center gap-2 px-4 py-2 h-12 rounded bg-black text-white font-semibold shadow hover:bg-gray-900 transition"
                  onClick={() => setModalOpen(true)}
                  title="Apply Sale"
                  style={{ minWidth: 48 }}
                >
                  <FaTag className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Apply Sale ({selected.length})
                  </span>
                  <span className="inline sm:hidden">Apply</span>
                </button>
              )}
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
      <SaleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApply={handleApplySale}
        selectedProducts={selected}
        loading={applyLoading}
      />
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

export default ApplySalePage;
