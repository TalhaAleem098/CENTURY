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

  // Dropzone handler for a specific box (now supports multiple images dropped)
  const handleBoxDrop = (e, idx) => {
    e.preventDefault();
    let files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!files.length) return;
    const newFiles = [...imageFiles];
    // Insert dropped files starting at idx, shifting others to the right
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
      toast.error("Duplicate sizes removed. Only unique sizes are allowed.");
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
    console.log("Uploading images to Cloudinary:", files);
    const uploaders = files.map(async (file, idx) => {
      const buffer = await readFileAsArrayBuffer(file);
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const uniqueSuffix = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 6)}`;
      const fileName = `${baseName}-${uniqueSuffix}`;
      const result = await uploadImageToCloudinary(buffer, fileName);
      if (!result.public_id || !result.url)
        throw new Error("Cloudinary upload failed");
      console.log(`Image ${idx + 1} uploaded:`, result);
      return { public_id: result.public_id, url: result.url };
    });
    const uploaded = await Promise.all(uploaders);
    console.log("All images uploaded to Cloudinary:", uploaded);
    setTooltip("Images uploaded successfully!");
    await new Promise((res) => setTimeout(res, 800));
    setTooltip("Uploading product data...");
    return uploaded;
  }

  const onSubmit = async (data) => {
    if (data.category === "TShirt" && data.sizes) {
      const sizesArr = data.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const uniqueSizes = Array.from(new Set(sizesArr));
      if (sizesArr.length !== uniqueSizes.length) {
        toast.error("Duplicate sizes detected. Please remove duplicates.");
        setValue("sizes", uniqueSizes.join(", "));
        return;
      }
      data.sizes = uniqueSizes;
    }
    if (data.category === "TShirt") {
      if (!data.color) {
        toast.error("Color is required for TShirt.");
        return;
      }
      if (!data.gender) {
        toast.error("Gender is required for TShirt.");
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
      console.log(
        "Submitting product to backend:",
        Object.fromEntries(formData.entries())
      );
      const res = await fetch("/api/add-product", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add product");
      setSuccess(true);
      reset();
      setPreviews([]);
      setTooltip("");
      toast.success("Product added successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTooltip("");
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8 border border-black"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div>
              <label className="block text-black font-semibold mb-2">
                Product Name *
              </label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-black font-semibold mb-2">
                Brand
              </label>
              <input
                type="text"
                {...register("brand")}
                className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Brand name (optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-black font-semibold mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  {...register("price", { required: true, min: 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  {...register("stock", { required: true, min: 0 })}
                  className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-black font-semibold mb-2">
                Description *
              </label>
              <textarea
                {...register("description", { required: true })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Describe the product..."
              />
            </div>
            <div>
              <label className="block text-black font-semibold mb-2">
                Category *
              </label>
              <select
                {...register("category", { required: true })}
                className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Category</option>
                <option value="TShirt">TShirt</option>
                {/* Add more categories as needed */}
              </select>
            </div>
            {watch("category") === "TShirt" && (
              <>
                <div>
                  <label className="block text-black font-semibold mb-2">
                    Sizes * (comma separated)
                  </label>
                  <input
                    type="text"
                    {...register("sizes", {
                      required: watch("category") === "TShirt",
                    })}
                    className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g. S, M, L, XL"
                    onBlur={handleSizesBlur}
                  />
                </div>
                {/* Dimensions for each size */}
                {watch("sizes") && watch("sizes").length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-black font-semibold mb-2">
                      Dimensions (cm) for each size
                    </label>
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
                          className="flex items-center gap-4 mb-2"
                        >
                          <span className="w-12 font-bold text-black">
                            {sizeKey}
                          </span>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Height"
                            className="px-2 py-1 rounded border border-black w-24 bg-white text-black focus:outline-none"
                            value={watch(`dimensions.${sizeKey}.height`) || ""}
                            onChange={(e) =>
                              setValue(
                                `dimensions.${sizeKey}.height`,
                                e.target.value
                              )
                            }
                          />
                          <span className="text-gray-500">x</span>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Width"
                            className="px-2 py-1 rounded border border-black w-24 bg-white text-black focus:outline-none"
                            value={watch(`dimensions.${sizeKey}.width`) || ""}
                            onChange={(e) =>
                              setValue(
                                `dimensions.${sizeKey}.width`,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-black font-semibold mb-2">
                      Color *
                    </label>
                    <input
                      type="text"
                      {...register("color", {
                        required: watch("category") === "TShirt",
                      })}
                      className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g. Black, White"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-semibold mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      {...register("material")}
                      className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g. Cotton"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black font-semibold mb-2">
                      Gender *
                    </label>
                    <select
                      {...register("gender", {
                        required: watch("category") === "TShirt",
                      })}
                      className="w-full px-4 py-2 rounded-lg bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Select</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="accent-black"
              />
              <label className="text-black font-semibold">
                Featured Product
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="grid grid-cols-3 gap-4 w-full">
              {imageFiles.length === 0 && (
                <div
                  className="relative group border-2 border-dashed border-black rounded-lg bg-gray-50 flex flex-col items-center justify-center aspect-square min-h-[160px] min-w-[160px] max-w-[200px] cursor-pointer hover:bg-gray-100 transition"
                  onDrop={(e) => handleBoxDrop(e, 0)}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() =>
                    document.getElementById("image-upload-0").click()
                  }
                >
                  <FaUpload className="text-black text-2xl mb-2" />
                  <p className="text-black font-semibold text-center">
                    Drop or select image
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
                  className="relative group border-2 border-black rounded-lg bg-gray-50 flex flex-col items-center justify-center aspect-square min-h-[160px] min-w-[160px] max-w-[200px] cursor-pointer hover:bg-gray-100 transition"
                  onDrop={(e) => handleBoxDrop(e, idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() =>
                    document.getElementById(`image-upload-${idx}`).click()
                  }
                >
                  {file ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx + 1}`}
                      fill
                      className={`object-cover rounded-lg ${
                        idx === 0 ? "ring-2 ring-black" : ""
                      }`}
                    />
                  ) : (
                    <>
                      <FaUpload className="text-black text-2xl mb-2" />
                      <p className="text-black font-semibold text-center">
                        Drop or select image
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
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-600 hover:text-red-800 shadow group-hover:scale-110 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImageBox(idx);
                    }}
                  >
                    <FaTrash />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-neutral-900 disabled:opacity-60"
              onClick={handleAddImageBox}
              disabled={
                imageFiles.length > 0 && !imageFiles[imageFiles.length - 1]
              }
            >
              <FaPlus /> Add Image
            </button>
          </div>
        </div>
        {error && (
          <div className="mb-4 text-red-600 font-semibold">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-700 font-semibold">
            Product added successfully!
          </div>
        )}
        <div className="flex justify-center m-0 p-0 w-ful">
          <button
            type="submit"
            disabled={loading}
            className="w-50 mt-8 py-3 rounded-lg bg-black text-white font-bold text-lg shadow-lg hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 disabled:opacity-60 border border-black"
          >
            <FaPlus /> {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
      <Tooltip open={!!tooltip} content={tooltip} />
    </div>
  );
}
