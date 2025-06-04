import { NextResponse } from 'next/server';
import connectDB from '@/utils/connectDB';
import Order from '@/models/Order';
import Product from '@/models/Product.base';

export async function POST(request) {
  try {
    await connectDB();

    const orderData = await request.json();
    
    console.log('=== INCOMING ORDER DATA ===');
    console.log('Order Data Keys:', Object.keys(orderData));
    console.log('Customer Name:', orderData.customerName);
    console.log('Customer Email:', orderData.customerEmail);
    console.log('Customer Phone:', orderData.customerPhone);
    console.log('Address:', orderData.address);
    console.log('City:', orderData.city);
    console.log('Zip Code:', orderData.zipCode);
    console.log('Items Count:', orderData.items?.length);
    console.log('Total Amount:', orderData.totalAmount);
    console.log('=== END INCOMING DATA ===');    // Validate required fields
    const requiredFields = [
      'customerName', 
      'customerEmail', 
      'customerPhone', 
      'address', 
      'city', 
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
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
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
    const finalTotalAmount = subtotalAmount + shippingCost;
    const newOrder = new Order({
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
      orderDate: new Date(orderData.orderDate) || new Date(),
      status: orderData.status || 'pending',
      notes: orderData.notes || ''
    });    // Save order to database
    const savedOrder = await newOrder.save();

    console.log('=== ORDER SAVED TO DATABASE ===');
    console.log('Order ID:', savedOrder._id);
    console.log('Customer:', savedOrder.customer.name, '-', savedOrder.customer.email);
    console.log('Customer Address:', savedOrder.customer.address.street, savedOrder.customer.address.city, savedOrder.customer.address.zipCode);
    console.log('Subtotal Amount:', subtotalAmount);
    console.log('Shipping Cost:', shippingCost);
    console.log('Final Total Amount:', savedOrder.totalAmount);
    console.log('Items Count:', savedOrder.items.length);
    console.log('Items with Images:', savedOrder.items.map(item => ({
      productName: item.productName,
      hasImage: !!item.productImage,
      imageUrl: item.productImage
    })));
    console.log('=== END DATABASE LOG ===');    return NextResponse.json({
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
