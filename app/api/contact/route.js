import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import Contact from "@/models/Contact";

// Rate limiting helper
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 15; // Max 5 requests per 15 minutes

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip);
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return true;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return false;
}

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Length validations
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { success: false, error: "Name must be between 2 and 50 characters." },
        { status: 400 }
      );
    }
    if (subject.length < 2 || subject.length > 100) {
      return NextResponse.json(
        { success: false, error: "Subject must be between 2 and 100 characters." },
        { status: 400 }
      );
    }
    if (message.length < 10 || message.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Message must be between 10 and 1000 characters." },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for duplicate submissions (same email, subject, and message in last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingContact = await Contact.findOne({
      email: email.toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: { $gte: oneHourAgo }
    });
    if (existingContact) {
      return NextResponse.json(
        { success: false, error: "You've already submitted this message recently. Please wait before submitting again." },
        { status: 409 }
      );
    }

    // Create new contact message
    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Save to database
    const savedContact = await contact.save();

    return NextResponse.json(
      { success: true, message: "Thank you for your message! We'll get back to you soon.", id: savedContact._id },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: errors[0] || "Validation failed." },
        { status: 400 }
      );
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "This message has already been submitted." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: "Method not allowed" 
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      success: false, 
      error: "Method not allowed" 
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { 
      success: false, 
      error: "Method not allowed" 
    },
    { status: 405 }
  );
}
