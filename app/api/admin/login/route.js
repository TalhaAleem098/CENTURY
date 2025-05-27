import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Admin from '@/models/Admin';
import bcrypt from 'bcrypt';
import rateLimit from '@/utils/rateLimit';
import jwt from 'jsonwebtoken';

const limiter = rateLimit({ windowMs: 60 * 1000, max: 5 }); // 5 requests per minute
const JWT_SECRET = process.env.JWT_SECRET || 'centuarySuperSecretJwtKey';

export async function POST(req) {
  try {
    const rateLimitRes = await limiter(req);
    if (!rateLimitRes.success) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
    }
    await connectDB();
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found.' }, { status: 404 });
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    // Create JWT with admin's email, password, and name as 'admin', expires in 1 hour
    const token = jwt.sign(
      {
        email: admin.email,
        name: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const response = NextResponse.json({ success: true, message: 'Admin logged in successfully.' });
    response.headers.set('Authorization', `Bearer ${token}`);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
