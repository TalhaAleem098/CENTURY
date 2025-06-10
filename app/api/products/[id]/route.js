import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import TShirt from '@/models/TShirt';

export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;
  try {
    const tshirt = await TShirt.findById(id).lean();
    if (!tshirt) {
      return NextResponse.json({ error: 'TShirt not found' }, { status: 404 });
    }
    return NextResponse.json(tshirt);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
