import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Product from '@/models/Product.base';

// GET /api/sale/products?page=1
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10;
    const skip = (page - 1) * limit;
    const now = new Date();

    // Set sale as inactive for products where sale has ended
    await Product.updateMany(
      { 'sale.end': { $lt: now }, 'sale.percentage': { $gt: 0 } },
      { $set: { 'sale.percentage': 0 } }
    );

    // Only fetch products with a sale (ignore start date, but end date must be valid)
    const query = {
      'sale.percentage': { $gt: 0 },
      'sale.end': { $gte: now },
    };

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
