import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Product, TShirt } from '@/models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'centuarySuperSecretJwtKey';

function verifyAdminToken(req) {
  // const auth = req.headers.get('authorization') || '';
  // if (!auth.startsWith('Bearer ')) return false;
  // const token = auth.replace('Bearer ', '');
  // try {
    // const decoded = jwt.verify(token, JWT_SECRET);
    // return decoded && decoded.name === 'admin';
  // } catch {
    // return false;
  // }
}

export async function POST(req) {
  try {
    // if (!verifyAdminToken(req)) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    await connectDB();
    // Use Next.js request formData() for multipart or json() for JSON
    let data;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await req.json();
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      data = {};
      for (const [key, value] of formData.entries()) {
        // Handle arrays and objects
        if (key === 'images') {
          // Accept multiple images fields or a single JSON array string
          if (!data.images) data.images = [];
          try {
            // If value is a JSON string (from client), parse it
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              data.images = parsed;
            } else if (parsed && typeof parsed === 'object') {
              data.images.push(parsed);
            }
          } catch {
            // If value is an object (from client FormData.append), push directly
            if (typeof value === 'object' && value !== null) {
              data.images.push(value);
            } else {
              // If value is a string, try to parse as object
              try {
                const obj = JSON.parse(value);
                data.images.push(obj);
              } catch {
                // fallback: ignore
              }
            }
          }
        } else if (key === 'dimensions') {
          try {
            data.dimensions = JSON.parse(value);
          } catch {
            data.dimensions = value;
          }
        } else if (key === 'sizes') {
          data.sizes = value.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          data[key] = value;
        }
      }
      // If images is a single object, wrap in array
      if (data.images && !Array.isArray(data.images)) {
        data.images = [data.images];
      }
    } else {
      data = await req.json();
    }
    const { slug, category, images, ...rest } = data;
    if (!slug) {
      console.error('Missing required field: slug');
      return NextResponse.json({ error: 'Missing required field: slug' }, { status: 400 });
    }
    // Validate images array
    if (!Array.isArray(images) || images.length === 0) {
      console.error('At least one image is required.');
      return NextResponse.json({ error: 'At least one image is required.', message: 'Please provide at least one image for the product.' }, { status: 400 });
    }
    for (const img of images) {
      if (!img.public_id || !img.url) {
        console.error('Each image must have public_id and url:', img);
        return NextResponse.json({ error: 'Each image must have public_id and url.', message: 'Each image must include both public_id and url.' }, { status: 400 });
      }
    }
    // Check if product with this slug already exists
    const existing = await Product.findOne({ slug });
    if (existing) {
      console.error('Product with this slug already exists:', slug);
      return NextResponse.json({ error: 'Product with this slug already exists.' }, { status: 400 });
    }
    let product;
    // Use discriminators for category-specific schemas
    if (category === 'TShirt') {
      product = await TShirt.create({ ...rest, slug, category, images });
    } else if (category && Product.discriminators && Product.discriminators[category]) {
      product = await Product.discriminators[category].create({ ...rest, slug, category, images });
    } else if (category) {
      product = await Product.create({ ...rest, slug, category, images });
    } else {
      product = await Product.create({ ...rest, slug, images });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
