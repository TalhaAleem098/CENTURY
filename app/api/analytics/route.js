// app/api/analytics/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import AnalyticsUser from '@/models/AnalyticsUser';

export async function POST(req) {
  await connectDB();
  try {
    let data = await req.json();
    if (data && typeof data === 'object' && 'data' in data && Object.keys(data).length === 1) {
      data = data.data;
    }
    if (!data.url || typeof data.url !== 'string') {
      data.url = '/';
    }
    let ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || null;
    if (!ip && req.ip) ip = req.ip;
    await AnalyticsUser.create({
      ip,
      userAgent: data.userAgent,
      referrer: data.referrer,
      url: data.url,
      timestamp: new Date(data.timestamp || Date.now()),
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 400 });
  }
}

export async function GET(req) {
  await connectDB();
  try {
    // Password lock: require ?password=passaleem
    const { searchParams } = new URL(req.url, 'http://localhost');
    const password = searchParams.get('password') || '';
    if (password !== 'passaleem') {
      return new NextResponse(
        JSON.stringify({ error: 'API endpoint not found', path: '/api/analytics' }),
        { status: 404, headers: { 'content-type': 'application/json' } }
      );
    }
    // Return all user analytics (optionally filter by url)
    const users = await AnalyticsUser.find().select('-__v');
    return NextResponse.json({
      total: users.length,
      users,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 400 });
  }
}
