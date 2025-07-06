// app/api/analytics/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Analytics from '@/models/Analytics';

// POST: Store analytics data
export async function POST(req) {
  await connectDB();
  try {
    let data = await req.json();
    // Accept both {data: {...}} and {...} for backward compatibility
    if (data && typeof data === 'object' && 'data' in data && Object.keys(data).length === 1) {
      data = data.data;
    }
    // Defensive: ensure url is string and not null
    if (!data.url || typeof data.url !== 'string') {
      data.url = '/';
    }
    await Analytics.create({ data });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 400 });
  }
}

// GET: Return analytics summary (count per url)
export async function GET() {
  await connectDB();
  try {
    // Aggregate counts by URL
    const results = await Analytics.aggregate([
      { $group: {
        _id: { $ifNull: ['$data.url', '/'] },
        count: { $sum: 1 },
        lastVisit: { $max: '$createdAt' },
      }},
      { $sort: { count: -1 } },
    ]);
    return NextResponse.json({
      total: results.reduce((sum, r) => sum + r.count, 0),
      urls: results.map(r => ({ url: r._id || '/', count: r.count, lastVisit: r.lastVisit })),
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 400 });
  }
}
