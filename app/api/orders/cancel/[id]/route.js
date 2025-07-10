import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Order from '@/models/Order';
import MonthlySales from '@/models/MonthlySales';

// PATCH: Cancel an order and update monthly sales
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    // Find the order
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    if (order.status === 'cancelled') {
      return NextResponse.json({ success: false, error: 'Order already cancelled' }, { status: 400 });
    }
    
    // Only deduct from monthly sales if the order was previously confirmed/processed
    // (meaning it was already counted in monthly sales)
    const shouldDeductFromSales = ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status);
    
    // Update order status to cancelled
    order.status = 'cancelled';
    await order.save();
    
    // Deduct from monthly sales only if order was counted before
    if (shouldDeductFromSales) {
      const orderDate = order.orderDate || order.createdAt;
      const result = await MonthlySales.deductOrder(order.totalAmount || 0, orderDate);
      
      if (!result.success) {
        console.warn('Failed to deduct from monthly sales:', result.error);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order cancelled successfully',
      deductedFromSales: shouldDeductFromSales 
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to cancel order', 
      details: error.message 
    }, { status: 500 });
  }
}
