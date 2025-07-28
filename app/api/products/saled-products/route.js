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
    
    // Find products that have a sale field (not null/undefined)
    const products = await Product.find({
      sale: { $exists: true, $ne: null }
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
    console.error('Error fetching saled products:', err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
