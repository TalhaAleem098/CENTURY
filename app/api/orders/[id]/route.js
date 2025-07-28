import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const order = await Order.findById(id).lean();
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const updates = await request.json();

    // Validate status if provided
    if (updates.status) {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(updates.status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status value' },
          { status: 400 }
        );
      }
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { 
        ...updates,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Only delete the order, do not touch monthly sales
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete order', details: error.message }, { status: 500 });
  }
}
