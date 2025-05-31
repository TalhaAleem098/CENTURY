import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Product from '@/models/Product.base';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'centuarySuperSecretJwtKey';

function verifyAdminToken(req) {
  // Get the cookie named 'admin_token' from the request
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]*)/);
  if (!match) return false;
  const token = decodeURIComponent(match[1]);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded && decoded.name === 'admin';
  } catch {
    return false;
  }
}

// POST /api/remove-sale
// Body: { ids: [productId1, productId2, ...] }
export async function POST(req) {
  try {
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 });
    }

    // Find products that already have no sale
    const products = await Product.find({ _id: { $in: ids } });
    const alreadyNoSale = products.filter(p => !p.sale || !p.sale.percentage || p.sale.percentage === 0).map(p => p._id.toString());
    const toUpdate = products.filter(p => p.sale && p.sale.percentage > 0).map(p => p._id.toString());

    // Remove sale data from products that have an active sale
    let modifiedCount = 0;
    if (toUpdate.length > 0) {
      const result = await Product.updateMany(
        { _id: { $in: toUpdate } },
        {
          $set: {
            sale: {
              percentage: 0,
              start: null,
              end: null,
              description: '',
            },
          },
        }
      );
      modifiedCount = result.modifiedCount;
    }

    return NextResponse.json({
      success: true,
      modifiedCount,
      alreadyNoSale,
      message: alreadyNoSale.length > 0 ? 'Some items already had no sale applied.' : undefined
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
