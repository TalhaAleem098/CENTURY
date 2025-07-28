"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // Add timeout configuration
  upload_timeout: 60000, // 60 seconds
});

export async function uploadImageToCloudinary(fileBuffer, fileName) {
  // Convert ArrayBuffer to Buffer for Node.js
  const nodeBuffer = Buffer.from(fileBuffer);
  
  return new Promise((resolve, reject) => {
    // Add a timeout wrapper
    const timeout = setTimeout(() => {
      reject(new Error('Cloudinary upload timeout after 60 seconds'));
    }, 60000);

    cloudinary.uploader.upload_stream(
      {
        folder: "products",
        public_id: fileName,
        resource_type: "image",
        // Add additional options for better handling
        quality: "auto:good",
        fetch_format: "auto",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto:good" }
        ]
      },
      (error, result) => {
        clearTimeout(timeout);
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve({ public_id: result.public_id, url: result.secure_url });
      }
    ).end(nodeBuffer);
  });
}
