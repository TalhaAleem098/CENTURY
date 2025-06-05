import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Admin from '@/models/Admin';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Admin creation only allowed in development mode.' }, { status: 403 });
    }
    await connectDB();
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Admin already exists.' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ email, password: hashedPassword });
    return NextResponse.json({ success: true, message: 'Admin created successfully.' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
