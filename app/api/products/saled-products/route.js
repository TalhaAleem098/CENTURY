import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Product from "@/models/Product.base";

export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = parseInt(searchParams.get("skip")) || 0;
    const now = new Date();
    // Find products with active sale
    const products = await Product.find({
      "sale.start": { $lte: now },
      "sale.end": { $gte: now },
    })
      .limit(limit)
      .skip(skip)
      .lean();
    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
