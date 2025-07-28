import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Contact from "@/models/Contact";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "centurySuperSecretJwtKey";

function verifyAdminToken(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|; )admin_token=([^;]*)/);
  if (!match) return false;
  const token = decodeURIComponent(match[1]);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded && decoded.name === "admin";
  } catch {
    return false;
  }
}

// GET: Fetch paginated contact applications (admin only)
export async function GET(req) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;
  const total = await Contact.countDocuments();
  const contacts = await Contact.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  return NextResponse.json({ success: true, data: contacts, total, page, limit });
}

// DELETE: Delete one or multiple contact applications by id(s) (admin only)
export async function DELETE(req) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  let ids = [];
  try {
    const body = await req.json();
    ids = Array.isArray(body.ids) ? body.ids : [body.id || body._id].filter(Boolean);
    if (!ids.length) throw new Error("No id(s) provided");
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }
  const result = await Contact.deleteMany({ _id: { $in: ids } });
  return NextResponse.json({ success: true, deletedCount: result.deletedCount });
}
