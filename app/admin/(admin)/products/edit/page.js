"use client";
import { useState, useEffect, useRef } from "react";
import React from "react";
import ProductCard from "./ProductCard";
import Loading from "./loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductEditModal from "./ProductEditModal";
import ProductInstructions from "./ProductInstructions";
import { ToastContainer } from "react-toastify";

const MAX_LIMIT = 12;

const Page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cacheRef = useRef({});

  const fetchProduct = async (pageNum = 1) => {
    setLoading(true);
    // Check cache first
    if (cacheRef.current[pageNum]) {
      setProducts(cacheRef.current[pageNum].products);
      setTotalPages(cacheRef.current[pageNum].totalPages);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/products?page=${pageNum}&limit=${MAX_LIMIT}`
      );
      if (!res.ok) {
        toast("Failed to fetch products");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!data.products || !Array.isArray(data.products)) {
        toast("Invalid product data format");
        setLoading(false);
        return;
      }
      // Log all image URLs of loaded products
      data.products.forEach((product) => {
        if (Array.isArray(product.images)) {
          product.images.forEach((img, idx) => {
            if (img.url) {
              // console.log(
                // `Product: ${product.name} | Image ${idx + 1}: ${img.url}`
              // );
            }
          });
        }
      });
      setProducts(data.products);
      setTotalPages(data.totalPages || 1);
      // Cache the result
      cacheRef.current[pageNum] = {
        products: data.products,
        totalPages: data.totalPages || 1,
      };
      setLoading(false);
      toast("Products loaded successfully");
    } catch (error) {
      toast("Error fetching products");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProduct(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };
  const handleModalSave = async (updatedProduct) => {
    // Update products state
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    // Update cache for all pages
    Object.keys(cacheRef.current).forEach((pageNum) => {
      cacheRef.current[pageNum].products = cacheRef.current[pageNum].products.map((p) =>
        p._id === updatedProduct._id ? updatedProduct : p
      );
    });
    setModalOpen(false);
    setSelectedProduct(null);
    toast("Product updated!");
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
    // Remove from cache for all pages
    Object.keys(cacheRef.current).forEach((pageNum) => {
      cacheRef.current[pageNum].products = cacheRef.current[
        pageNum
      ].products.filter((p) => p._id !== id);
    });
  };

  return (
    <div className="min-h-screen bg-white py-8 px-2 sm:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2 text-black text-center tracking-tight">
          Product Management
        </h1>
        
        <ProductInstructions />
        
        <div className="border-b border-black mb-10" />
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={() => handleEditClick(product)}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="font-semibold">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
        <ProductEditModal
          product={selectedProduct}
          open={modalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      </div>
    </div>
  );
};

export default Page;
