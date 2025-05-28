import connectDB from '@/utils/connectDB';
import { Product, TShirt } from '@/models/Product';

// PATCH: Update a product by ID
export async function PATCH(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return Response.json({ error: 'Product ID is required' }, { status: 400 });
  }
  const data = await req.json();
  let updated;
  try {
    // Determine category and use correct model and allowed fields
    let Model = Product;
    let allowedFields = [
      'name', 'brand', 'price', 'description', 'stock', 'isFeatured', 'color', 'material', 'gender', 'images'
    ];
    if (data.category === 'TShirt') {
      Model = TShirt;
      allowedFields = [
        'name', 'brand', 'price', 'description', 'stock', 'isFeatured', 'color', 'material', 'gender', 'images', 'sizes', 'dimensions'
      ];
    }
    // Only update allowed fields for the category
    const updateData = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) updateData[key] = data[key];
    }
    updated = await Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
  return Response.json({ updated });
}
