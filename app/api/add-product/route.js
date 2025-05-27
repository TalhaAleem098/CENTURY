import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import { Product, TShirt } from '@/models/Product';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'centuarySuperSecretJwtKey';

function verifyAdminToken(req) {
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return false;
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded && decoded.name === 'admin';
  } catch {
    return false;
  }
}

export async function POST(req) {
  try {
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const data = await req.json();
    const { slug, category, ...rest } = data;
    if (!slug) {
      return NextResponse.json({ error: 'Missing required field: slug' }, { status: 400 });
    }
    // Check if product with this slug already exists
    const existing = await Product.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Product with this slug already exists.' }, { status: 400 });
    }
    let product;
    // Use discriminators for category-specific schemas
    if (category === 'TShirt') {
      product = await TShirt.create({ ...rest, slug, category });
    } else if (category && Product.discriminators && Product.discriminators[category]) {
      product = await Product.discriminators[category].create({ ...rest, slug, category });
    } else if (category) {
      product = await Product.create({ ...rest, slug, category });
    } else {
      product = await Product.create({ ...rest, slug });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
