import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Product from "@/models/Product.base";

export async function GET(req) {
  await connectDB();
  try {
    // No caching - always fetch fresh data
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 0; // 0 means no limit
    const skip = parseInt(searchParams.get("skip")) || 0;
    
    // Find products that do NOT have a sale field or have null sale
    const products = await Product.find({
      $or: [
        { sale: { $exists: false } },
        { sale: null }
      ]
    })
      .limit(limit)
      .skip(skip)
      .lean();
      
    return NextResponse.json({ 
      products,
      total: products.length 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (err) {
    console.error('Error fetching non-saled products:', err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}