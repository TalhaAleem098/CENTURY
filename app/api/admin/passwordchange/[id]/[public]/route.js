import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Admin from '@/models/Admin';
import bcrypt from 'bcrypt';

export async function POST(req, { params }) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, oldPassword, newPassword } = body;
    const { id, public: publicId } = await params;

    // Check for required params and body fields
    if (!id || !publicId || !oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Check if id and publicId match the environment variables
    if (id !== process.env.ADMIN_ID) {
      return NextResponse.json({
        error: 'Admin ID does not match.',
        expected: process.env.ADMIN_ID,
        received: id
      }, { status: 403 });
    }
    if (publicId !== process.env.NEXT_PUBLIC_ADMIN_ID) {
      return NextResponse.json({
        error: 'Public admin ID does not match.',
        expected: process.env.NEXT_PUBLIC_ADMIN_ID,
        received: publicId
      }, { status: 403 });
    }

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({
        error: 'Admin not found.',
        emailReceived: email
      }, { status: 404 });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json({
        error: 'Old password is incorrect.',
        receivedOldPassword: oldPassword
      }, { status: 401 });
    }

    if (oldPassword === newPassword) {
      return NextResponse.json({
        error: 'New password must be different from old password.',
        oldPassword,
        newPassword
      }, { status: 400 });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    return NextResponse.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
