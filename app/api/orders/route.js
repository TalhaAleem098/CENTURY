import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Order from '@/models/Order';
import Product from '@/models/Product.base';
import MonthlySales from '@/models/MonthlySales';

export async function POST(request) {
  try {
    await connectDB();

    const orderData = await request.json();
    
    const requiredFields = [
      'customerName', 
      'customerEmail', 
      'customerPhone', 
      'address', 
      'city', 
      'paymentMethod',
      'zipCode', 
      'items', 
      'totalAmount'
    ];
    
    const missingFields = [];
    for (let field of requiredFields) {
      if (!orderData[field] || (typeof orderData[field] === 'string' && orderData[field].trim() === '')) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      console.warn('[Order API] Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    const email = orderData.customerEmail;
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      console.warn('[Order API] Invalid email address received:', email);
      return NextResponse.json(
        { message : 'Invalid email address. Please enter a valid email.' },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      console.warn('[Order API] Order must contain at least one item. Received items:', orderData.items);
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Fetch product details and add images to order items
    const enhancedItems = await Promise.all(
      orderData.items.map(async (item) => {
        try {
          const product = await Product.findById(item.productId);
          
          let productImage = '';
          if (product) {
            // Handle both array of images and single image
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
              // Use first image from images array
              productImage = product.images[0].url || product.images[0];
            } else if (product.image) {
              // Fallback to single image field
              productImage = product.image;
            }
          }

          return {
            ...item,
            productImage: productImage
          };
        } catch (error) {
          console.error(`Error fetching product ${item.productId}:`, error);
          return {
            ...item,
            productImage: ''
          };
        }
      })
    );

    const subtotalAmount = orderData.totalAmount;
    const shippingCost = subtotalAmount >= 4999 ? 0 : 150;
    const finalTotalAmount = subtotalAmount + shippingCost;    const newOrder = new Order({
      customer: {
        name: orderData.customerName,
        email: orderData.customerEmail.toLowerCase(),
        phone: orderData.customerPhone,
        address: {
          street: orderData.address,
          city: orderData.city,
          zipCode: orderData.zipCode
        }
      },
      items: enhancedItems,
      totalItems: orderData.totalItems || enhancedItems.length,
      totalQuantity: orderData.totalQuantity || enhancedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotalAmount: subtotalAmount,
      shippingCost: shippingCost,
      totalAmount: finalTotalAmount,
      // orderDate will use default value (Date.now) from schema
      status: orderData.status || 'pending',
      notes: orderData.notes || ''
    });// Save order to database
    const savedOrder = await newOrder.save();

    // console.log('=== END DATABASE LOG ===');

    // Automatically track this order in monthly sales
    // console.log('=== ADDING ORDER TO MONTHLY SALES ===');
    try {
      const monthlySalesResult = await MonthlySales.addOrder(finalTotalAmount, savedOrder.orderDate);
      if (monthlySalesResult.success) {
        // console.log('✓ Order successfully added to monthly sales tracking');
        // console.log(`   Month: ${monthlySalesResult.month} ${monthlySalesResult.year}`);
        // console.log(`   Total Orders: ${monthlySalesResult.totalOrders}`);
        // console.log(`   Total Sales: $${monthlySalesResult.totalSales}`);
      } else {
        console.error('❌ Failed to add order to monthly sales:', monthlySalesResult.error);
      }    } catch (salesError) {
      console.error('❌ Error during monthly sales tracking:', salesError);
      // Don't fail the order creation if monthly sales tracking fails
    }
    // console.log('=== MONTHLY SALES TRACKING COMPLETED ===');
    
    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      orderId: savedOrder._id,
      order: savedOrder,
      shippingDetails: {
        subtotal: subtotalAmount,
        shippingCost: shippingCost,
        finalTotal: finalTotalAmount,
        freeShippingApplied: shippingCost === 0
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
      // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate order detected. Please try again.' },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${messages.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error while processing order' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
