import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { SubscribedEmail, SubscriberCount } from "@/models/subscribed-emails";

export async function POST(request) {
  try {
    await connectDB();
    
    const { email } = await request.json();

    // Validate email format
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await SubscribedEmail.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: "You're already subscribed to our newsletter!" },
          { status: 409 }
        );
      } else {
        // Reactivate inactive subscriber
        existingSubscriber.isActive = true;
        existingSubscriber.subscribedAt = new Date();
        await existingSubscriber.save();
        // Increment the subscriber count by 1 on reactivation
        await SubscriberCount.findOneAndUpdate(
          {},
          { $inc: { totalCount: 1 }, $set: { lastUpdated: new Date() } },
          { upsert: true }
        );
        return NextResponse.json({
          success: true,
          message: "Welcome back! You're subscribed again to our exciting updates.",
          isResubscribed: true
        });
      }
    }

    // Create new subscriber
    const newSubscriber = new SubscribedEmail({ 
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      isActive: true
    });
    await newSubscriber.save();
    // Increment the subscriber count by 1 for new subscriber
    await SubscriberCount.findOneAndUpdate(
      {},
      { $inc: { totalCount: 1 }, $set: { lastUpdated: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "🎉 Successfully subscribed! Get ready for exciting product updates and exclusive offers.",
      isNew: true
    });

  } catch (error) {
    console.error("Subscription error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "You're already subscribed to our newsletter!" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    
    // Get subscriber count from the count collection for faster retrieval
    let subscriberCount = await SubscriberCount.findOne({});
    
    if (!subscriberCount) {
      // If count document doesn't exist, count and create it
      const actualCount = await SubscribedEmail.countDocuments({ isActive: true });
      subscriberCount = new SubscriberCount({
        totalCount: actualCount,
        lastUpdated: new Date()
      });
      await subscriberCount.save();
    }

    // Get recent subscribers for display
    const recentSubscribers = await SubscribedEmail.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .limit(5)
      .select('email subscribedAt');

    return NextResponse.json({
      success: true,
      count: subscriberCount.totalCount,
      lastUpdated: subscriberCount.lastUpdated,
      recentSubscribers: recentSubscribers
    });

  } catch (error) {
    console.error("Get subscribers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriber data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Find and deactivate subscriber instead of deleting
    const subscriber = await SubscribedEmail.findOne({ email: email.toLowerCase() });
    
    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email address not found in our subscription list' },
        { status: 404 }
      );
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { error: 'Email address is already unsubscribed' },
        { status: 400 }
      );
    }

    // Deactivate subscription
    subscriber.isActive = false;
    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from our newsletter'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscription. Please try again later.' },
      { status: 500 }
    );
  }
}
