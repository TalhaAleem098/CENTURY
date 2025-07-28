"use client";

import { useState, useCallback } from "react";
import { FaPlus, FaUpload, FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { uploadImageToCloudinary } from "./cloudinary-server";
import { readFileAsArrayBuffer } from "@/utils/readFileAsArrayBuffer";
import { fetchWithTimeout, uploadImageWithRetry } from "@/utils/fetchUtils";

export default function AddProductPage() {
  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      name: "",
      brand: "",
      price: "",
      description: "",
      images: [],
      stock: "",
      isFeatured: false,
      category: "",
      // TShirt-specific fields are not set by default
    },
  });
  const [previews, setPreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tooltip, setTooltip] = useState("");

  // Watch images for preview
  const images = watch("images");

  // Handle image input and preview
  const handleImageChange = (e) => {
    let files = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/")
    );
    setImageFiles(files);
    setValue("images", files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // Handle image input and preview for a specific box
  const handleImageBoxChange = (e, idx) => {
    let file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const newFiles = [...imageFiles];
    newFiles[idx] = file;
    setImageFiles(newFiles);
    setValue("images", newFiles.filter(Boolean));
    setPreviews(newFiles.map((f) => (f ? URL.createObjectURL(f) : null)));
  };

  // Dropzone handler
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      let files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (!files.length) return;
      const newFiles = [...imageFiles, ...files];
      setImageFiles(newFiles);
      setValue("images", newFiles);
      setPreviews(newFiles.map((f) => URL.createObjectURL(f)));
    },
    [setValue, imageFiles]
  );

  const handleBoxDrop = (e, idx) => {
    e.preventDefault();
    let files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;
    const newFiles = [...imageFiles];
    files.forEach((file, i) => {
      newFiles[idx + i] = file;
    });
    setImageFiles(newFiles);
    setValue("images", newFiles.filter(Boolean));
    setPreviews(newFiles.map((f) => (f ? URL.createObjectURL(f) : null)));
  };

  // Add new image input
  const handleAddImageInput = () => {
    setImageFiles((prev) => [...prev, null]);
  };

  // Add new image box
  const handleAddImageBox = () => {
    setImageFiles((prev) => [...prev, null]);
    setPreviews((prev) => [...prev, null]);
  };

  // Remove image
  const handleRemoveImage = (idx) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx);
    setImageFiles(newFiles);
    setValue("images", newFiles);
    setPreviews(newFiles.filter(Boolean).map((f) => URL.createObjectURL(f)));
  };

  // Remove image box
  const handleRemoveImageBox = (idx) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx);
    setImageFiles(newFiles);
    setValue("images", newFiles.filter(Boolean));
    setPreviews(newFiles.filter((_, i) => i !== idx));
  };

  // Handle individual file change
  const handleSingleFileChange = (e, idx) => {
    let file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const newFiles = [...imageFiles];
    newFiles[idx] = file;
    setImageFiles(newFiles);
    setValue("images", newFiles);
    setPreviews(newFiles.filter(Boolean).map((f) => URL.createObjectURL(f)));
  };

  // Deduplicate sizes on blur
  const handleSizesBlur = () => {
    const sizesRaw = watch("sizes") || "";
    if (!sizesRaw) return;
    const sizesArr = sizesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const uniqueSizes = Array.from(new Set(sizesArr));
    if (sizesArr.length !== uniqueSizes.length) {
      toast("Duplicate sizes removed. Only unique sizes are allowed.");
      setValue("sizes", uniqueSizes.join(", "));
    }
  };

  // Helper to generate slug
  function generateSlug({ name, sizes, color, dimensions }) {
    let slug = name
      ? name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : "";
    if (sizes && sizes.length) slug += "-" + sizes.join("-").toLowerCase();
    if (color) slug += "-" + color.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (dimensions && typeof dimensions === "object") {
      const dimStr = Object.entries(dimensions)
        .map(([size, dim]) => `${size}-${dim.height || ""}x${dim.width || ""}`)
        .join("-");
      if (dimStr) slug += "-" + dimStr.replace(/[^a-z0-9x-]+/gi, "-");
    }
    return slug;
  }
  async function uploadToCloudinary(files) {
    setTooltip("Uploading images to Cloudinary...");
    
    const uploaders = files.map(async (file, idx) => {
      try {
        setTooltip(`Uploading image ${idx + 1} of ${files.length}...`);
        
        const buffer = await readFileAsArrayBuffer(file);
        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const uniqueSuffix = `${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 6)}`;
        const fileName = `${baseName}-${uniqueSuffix}`;
        
        // Use retry logic for image upload
        const result = await uploadImageWithRetry(uploadImageToCloudinary, buffer, fileName);
        
        if (!result.public_id || !result.url) {
          throw new Error(`Cloudinary upload failed for image ${idx + 1}`);
        }
        
        return { public_id: result.public_id, url: result.url };
      } catch (error) {
        console.error(`Failed to upload image ${idx + 1}:`, error);
        throw new Error(`Failed to upload image ${idx + 1}: ${error.message}`);
      }
    });

    try {
      const uploaded = await Promise.all(uploaders);
      setTooltip("Images uploaded successfully!");
      await new Promise((res) => setTimeout(res, 800));
      setTooltip("Uploading product data...");
      return uploaded;
    } catch (error) {
      setTooltip("");
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  const onSubmit = async (data) => {
    if (data.category === "TShirt" && data.sizes) {
      const sizesArr = data.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const uniqueSizes = Array.from(new Set(sizesArr));
      if (sizesArr.length !== uniqueSizes.length) {
        toast("Duplicate sizes detected. Please remove duplicates.");
        setValue("sizes", uniqueSizes.join(", "));
        return;
      }
      data.sizes = uniqueSizes;
    }
    if (data.category === "TShirt") {
      if (!data.color) {
        toast("Color is required for TShirt.");
        return;
      }
      if (!data.gender) {
        toast("Gender is required for TShirt.");
        return;
      }
    }
    let submitData = {
      name: data.name,
      price: data.price,
      description: data.description,
      images: [], // will fill after upload
      stock: data.stock,
      brand: data.brand,
      isFeatured: data.isFeatured,
      category: data.category,
    };
    if (data.category === "TShirt") {
      let newDims = {};
      if (data.dimensions) {
        (data.sizes || []).forEach((size) => {
          if (data.dimensions[size]) newDims[size] = data.dimensions[size];
        });
      }
      submitData = {
        ...submitData,
        sizes: data.sizes,
        color: data.color,
        material: data.material,
        gender: data.gender,
        dimensions: newDims,
      };
    }
    // Generate slug
    submitData.slug = generateSlug({
      name: submitData.name,
      sizes: submitData.sizes,
      color: submitData.color,
      dimensions: submitData.dimensions,
    });
    setLoading(true);
    setError("");
    setSuccess(false);
    setTooltip("Uploading images to Cloudinary...");
    toast.info("Uploading images to Cloudinary...");
    try {
      // Upload images in parallel and wait for all
      const cloudinaryUrls = await uploadToCloudinary(imageFiles);
      submitData.images = cloudinaryUrls;
      setTooltip("Uploading product data...");
      toast.info("Uploading product data...");
      // Prepare formData for backend
      const formData = new FormData();
      Object.entries(submitData).forEach(([key, value]) => {
        if (key === "images") {
          formData.append("images", JSON.stringify(value)); // Send as single JSON string
        } else if (key === "sizes") {
          formData.append("sizes", value.join(","));
        } else if (key === "dimensions") {
          formData.append("dimensions", JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      try {
        const res = await fetch("/api/add-product", {
          method: "POST",
          body: formData,
          signal: controller.signal,
          // Add headers for better handling
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to add product: ${errorText}`);
        }
        
        setSuccess(true);
        reset();
        setPreviews([]);
        setTooltip("");
        toast("Product added successfully!");
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error("Request timed out. Please try again.");
        }
        throw fetchError;
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTooltip("");
      toast(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-5xl mb-10 text-center">
        <h1 className="text-4xl font-black text-black mb-2 tracking-tight">
          Admin Product Management
        </h1>
        <p className="text-lg text-gray-700 font-medium mb-1">
          Add new products to your store inventory below.
        </p>
        <div className="w-16 h-1 bg-black mx-auto rounded mb-4" />
        <p className="text-sm text-gray-500">
          All fields marked * are required. Category-specific fields will appear
          as needed.
        </p>
      </div>
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:shadow-xl transition-shadow duration-300"
      >
        {/* Form Header */}
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black">
              Product Information
            </h2>
          </div>
          <p className="text-gray-600 text-sm">
            Fill in all required details to add your product to the inventory
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black">
                  Basic Information
                </h3>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className="w-full px-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter a clear, descriptive product name"
                  />
                </div>

                <div className="relative">
                  <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    Brand
                  </label>
                  <input
                    type="text"
                    {...register("brand")}
                    className="w-full px-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 hover:border-gray-400"
                    placeholder="Brand name (optional)"
                  />
                </div>
              </div>
            </div>
            {/* Pricing & Inventory Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black">
                  Pricing & Inventory
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      {...register("price", { required: true, min: 0 })}
                      className="w-full pl-8 pr-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 hover:border-gray-400"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    {...register("stock", { required: true, min: 0 })}
                    className="w-full px-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 hover:border-gray-400"
                    placeholder="Available units"
                  />
                </div>
              </div>
            </div>
            {/* Description Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black">
                  Product Description
                </h3>
              </div>

              <div className="relative">
                <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Description *
                </label>
                <textarea
                  {...register("description", { required: true })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 hover:border-gray-400 resize-none"
                  placeholder="Provide detailed product information, features, materials, care instructions..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {watch("description")?.length || 0}/500
                </div>
              </div>
            </div>
            {/* Category Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black">
                  Product Category
                </h3>
              </div>

              <div className="relative">
                <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Category *
                </label>
                <select
                  {...register("category", { required: true })}
                  className="w-full px-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200 hover:border-gray-400 cursor-pointer"
                >
                  <option value="">Choose product category</option>
                  <option value="TShirt">🎽 T-Shirt</option>
                  {/* Add more categories as needed */}
                </select>
              </div>
            </div>{" "}
            {/* T-Shirt Specific Fields */}
            {watch("category") === "TShirt" && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-black">
                    T-Shirt Specifications
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    Required
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Sizes */}
                  <div className="relative">
                    <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Available Sizes *
                    </label>
                    <input
                      type="text"
                      {...register("sizes", {
                        required: watch("category") === "TShirt",
                      })}
                      className="w-full px-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 hover:border-gray-400"
                      placeholder="e.g. S, M, L, XL, XXL"
                      onBlur={handleSizesBlur}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {watch("sizes") &&
                        watch("sizes")
                          .split(",")
                          .map((size, idx) => {
                            const trimmedSize = size.trim();
                            return trimmedSize ? (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {trimmedSize}
                              </span>
                            ) : null;
                          })}
                    </div>
                  </div>

                  {/* Dimensions for each size */}
                  {watch("sizes") && watch("sizes").length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <label className="block text-black font-semibold mb-4 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                        Dimensions (cm) for each size
                      </label>
                      <div className="grid gap-3">
                        {Array.from(
                          new Set(
                            watch("sizes")
                              .split(",")
                              .map((size) => size.trim())
                              .filter(Boolean)
                          )
                        ).map((size, idx) => {
                          const sizeKey = size;
                          return (
                            <div
                              key={sizeKey}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <span className="w-12 font-bold text-black bg-white px-2 py-1 rounded border text-center">
                                {sizeKey}
                              </span>
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  placeholder="Height"
                                  className="px-3 py-2 rounded-lg border-2 border-gray-300 w-24 bg-white text-black focus:outline-none focus:border-blue-500 transition-all"
                                  value={
                                    watch(`dimensions.${sizeKey}.height`) || ""
                                  }
                                  onChange={(e) =>
                                    setValue(
                                      `dimensions.${sizeKey}.height`,
                                      e.target.value
                                    )
                                  }
                                />
                                <span className="text-gray-500 font-bold">
                                  ×
                                </span>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  placeholder="Width"
                                  className="px-3 py-2 rounded-lg border-2 border-gray-300 w-24 bg-white text-black focus:outline-none focus:border-blue-500 transition-all"
                                  value={
                                    watch(`dimensions.${sizeKey}.width`) || ""
                                  }
                                  onChange={(e) =>
                                    setValue(
                                      `dimensions.${sizeKey}.width`,
                                      e.target.value
                                    )
                                  }
                                />
                                <span className="text-xs text-gray-500">
                                  cm
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Color and Material */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Color *
                      </label>
                      <input
                        type="text"
                        {...register("color", {
                          required: watch("category") === "TShirt",
                        })}
                        className="w-full px-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 hover:border-gray-400"
                        placeholder="e.g. Black, Navy Blue"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Material
                      </label>
                      <input
                        type="text"
                        {...register("material")}
                        className="w-full px-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 hover:border-gray-400"
                        placeholder="e.g. 100% Cotton"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="relative">
                    <label className="block text-black font-semibold mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Target Gender *
                    </label>
                    <select
                      {...register("gender", {
                        required: watch("category") === "TShirt",
                      })}
                      className="w-full px-4 py-3 rounded-lg bg-white text-black border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 hover:border-gray-400 cursor-pointer"
                    >
                      <option value="">Select target audience</option>
                      <option value="Men">👨 Men</option>
                      <option value="Women">👩 Women</option>
                      <option value="Unisex">👥 Unisex</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {/* Featured Product Toggle */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black">
                  Product Promotion
                </h3>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  {...register("isFeatured")}
                  className="w-5 h-5 text-black bg-gray-100 border-2 border-gray-300 rounded focus:ring-black focus:ring-2 accent-black"
                />
                <div className="flex-1">
                  <label className="text-black font-semibold cursor-pointer">
                    ⭐ Featured Product
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Mark as featured to highlight this product on the homepage
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black">Product Images</h3>
                <p className="text-sm text-gray-600">
                  Upload high-quality product photos
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Image Upload Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imageFiles.length === 0 && (
                  <div
                    className="relative group border-2 border-dashed border-gray-400 rounded-xl bg-white flex flex-col items-center justify-center aspect-square min-h-[140px] cursor-pointer hover:border-black hover:bg-gray-50 transition-all duration-200"
                    onDrop={(e) => handleBoxDrop(e, 0)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() =>
                      document.getElementById("image-upload-0").click()
                    }
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                      <FaUpload className="text-gray-500 text-lg" />
                    </div>
                    <p className="text-black font-semibold text-center text-sm">
                      Upload Image
                    </p>
                    <p className="text-gray-500 text-xs text-center mt-1">
                      Drag & drop or click
                    </p>
                    <input
                      id="image-upload-0"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageBoxChange(e, 0)}
                      multiple
                    />
                  </div>
                )}
                {imageFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative group border-2 border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center aspect-square min-h-[140px] cursor-pointer hover:border-black hover:shadow-md transition-all duration-200 overflow-hidden"
                    onDrop={(e) => handleBoxDrop(e, idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() =>
                      document.getElementById(`image-upload-${idx}`).click()
                    }
                  >
                    {file ? (
                      <>
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${idx + 1}`}
                          fill
                          className={`object-cover rounded-xl transition-transform group-hover:scale-105 ${
                            idx === 0 ? "ring-2 ring-black ring-offset-2" : ""
                          }`}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-colors">
                          <FaUpload className="text-gray-500 text-lg" />
                        </div>
                        <p className="text-black font-semibold text-center text-sm">
                          Add Image
                        </p>
                        <p className="text-gray-500 text-xs text-center mt-1">
                          Click to browse
                        </p>
                      </>
                    )}
                    <input
                      id={`image-upload-${idx}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageBoxChange(e, idx)}
                      multiple={idx === 0}
                    />
                    {file && (
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-2 bg-white rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImageBox(idx);
                        }}
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                    {idx === 0 && file && (
                      <span className="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md font-semibold">
                        Main Image
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add More Images Button */}
              <button
                type="button"
                className="w-full mt-4 px-4 py-3 bg-white border-2 border-dashed border-gray-400 text-black rounded-xl flex items-center justify-center gap-2 hover:border-black hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddImageBox}
                disabled={
                  imageFiles.length > 0 && !imageFiles[imageFiles.length - 1]
                }
              >
                <FaPlus className="text-sm" />
                Add Another Image
              </button>

              {/* Image Guidelines */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-black mb-2 text-sm">
                  📸 Image Guidelines
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Use high-resolution images (1200x1200px minimum)</li>
                  <li>• First image will be the main product display</li>
                  <li>• Include multiple angles and detail shots</li>
                  <li>• Ensure good lighting and clean backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Form Status Messages */}
        <div className="mt-8 space-y-3">
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 mb-1">
                  Error occurred
                </h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 mb-1">Success!</h4>
                <p className="text-green-700 text-sm">
                  Product has been added to your inventory successfully!
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Enhanced Submit Button */}
        <div className="flex justify-center mt-10">
          <button
            type="submit"
            disabled={loading}
            className="group relative px-8 py-4 bg-black text-white font-bold text-lg rounded-xl shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding Product...</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <FaPlus className="text-black text-sm" />
                </div>
                <span>Add Product to Inventory</span>
              </>
            )}

            {/* Button Glow Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
          </button>
        </div>
        {/* Loading Tooltip */}
        {tooltip && (
          <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">{tooltip}</span>
            </div>
          </div>
        )}
      </form>
      <Tooltip open={!!tooltip} content={tooltip} />
    </div>
  );
}
