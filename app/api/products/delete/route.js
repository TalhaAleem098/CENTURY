import connectDB from '@/utils/connectDB';
import { Product, TShirt } from '@/models/Product';
import cloudinary from '@/utils/cloudinary';

// DELETE: Delete a product by ID and its images from Cloudinary
export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return Response.json({ error: 'Product ID is required' }, { status: 400 });
  }
  try {
    // Try to find the product in both models
    let product = await Product.findById(id) || await TShirt.findById(id);
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete images from Cloudinary
    if (Array.isArray(product.images)) {
      for (const img of product.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
            // console.log(`Image deleted from Cloudinary: ${img.public_id}`);
          } catch (err) {
            // console.log(`Failed to delete image from Cloudinary: ${img.public_id}`, err.message);
          }
        }
      }
    }
    // console.log('All images deleted from Cloudinary (or attempted).');

    // Delete the product from the correct model
    let deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      deleted = await TShirt.findByIdAndDelete(id);
    }
    if (!deleted) {
      return Response.json({ error: 'Product not found for deletion' }, { status: 404 });
    }
    // console.log('Product deleted from database:', deleted._id);

    return Response.json({ success: true, deleted });
  } catch (e) {
    // console.log('Error during product/image deletion:', e.message);
    return Response.json({ error: e.message }, { status: 500 });
  }
}