import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
const { SubscribedEmail, SubscriberCount } = require("@/models/subscribed-emails");

export async function GET() {
  try {
    await connectDB();
    // Use SubscriberCount for efficient count
    const countDoc = await SubscriberCount.findOne({});
    const subscriberCount = countDoc ? countDoc.totalCount : 0;
    // Get recent subscribers (active only)
    const subscribers = await SubscribedEmail.find({ isActive: true }).sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({
      success: true,
      count: subscriberCount,
      recentSubscribers: subscribers
    });
  } catch (error) {
    console.error("Get subscribers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
