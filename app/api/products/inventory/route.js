import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Product from "@/models/Product.base";

// GET /api/products/inventory?limit=20&skip=0
export async function GET(req) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = parseInt(searchParams.get("skip")) || 0;

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      Product.find({})
        .select("name brand stock sold images")
        .limit(limit)
        .skip(skip)
        .lean(),
      Product.countDocuments({})
    ]);

    // Find understocked items (stock less than 20% of total quantity)
    const underStocked = products.filter(p => {
      const totalQty = (p.stock || 0) + (p.sold || 0);
      return totalQty > 0 && (p.stock / totalQty) < 0.2;
    });

    return NextResponse.json({ products, total, underStocked }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
