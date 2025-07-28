import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Product from '@/models/Product.base';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'centurySuperSecretJwtKey';

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

// POST /api/apply-sale
// Body: { ids: [productId1, productId2, ...], percentage: 20, start: '2025-05-15T00:00:00Z', end: '2025-05-20T23:59:59Z' }
export async function POST(req) {
  try {
    if (!verifyAdminToken(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const { ids, percentage, start, end } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0 || typeof percentage !== 'number' || percentage <= 0 || !start || !end) {
      return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 });
    }

    // Apply sale to all provided product ids, regardless of previous sale state
    const result = await Product.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          sale: {
            percentage,
            start: new Date(start),
            end: new Date(end),
          },
        },
      }
    );

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
