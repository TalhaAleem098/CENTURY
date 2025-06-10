import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/utils/connectDB';
import Order from '@/models/Order';

const getOrderConfirmationTemplate = (order) => {
  const { customer, items, totalAmount, shippingCost, subtotalAmount, orderDate } = order;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Century</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #000000 0%, #333333 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            
            .logo {
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 2px;
                margin-bottom: 10px;
            }
            
            .header-subtitle {
                font-size: 14px;
                opacity: 0.9;
                letter-spacing: 1px;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .order-info {
                background-color: #f8f9fa;
                border-left: 4px solid #000000;
                padding: 20px;
                margin: 20px 0;
                border-radius: 0 8px 8px 0;
            }
            
            .order-info h3 {
                color: #000000;
                margin-bottom: 15px;
                font-size: 18px;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .info-item {
                background: white;
                padding: 15px;
                border-radius: 6px;
                border: 1px solid #e9ecef;
            }
            
            .info-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
            }
            
            .info-value {
                font-weight: 600;
                color: #000;
            }
            
            .items-section {
                margin: 30px 0;
            }
            
            .items-section h3 {
                color: #000000;
                margin-bottom: 20px;
                font-size: 18px;
                border-bottom: 2px solid #000000;
                padding-bottom: 10px;
            }
            
            .item {
                display: flex;
                align-items: center;
                padding: 20px;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                margin-bottom: 15px;
                background: #fafafa;
            }
            
            .item-image {
                width: 80px;
                height: 80px;
                border-radius: 8px;
                object-fit: cover;
                margin-right: 20px;
                border: 2px solid #e9ecef;
            }
            
            .item-details {
                flex: 1;
            }
            
            .item-name {
                font-weight: 600;
                color: #000;
                margin-bottom: 8px;
                font-size: 16px;
            }
            
            .item-specs {
                color: #666;
                font-size: 14px;
                margin-bottom: 5px;
            }
            
            .item-price {
                text-align: right;
            }
            
            .item-total {
                font-weight: 700;
                color: #000;
                font-size: 18px;
            }
            
            .item-unit {
                color: #666;
                font-size: 14px;
            }
            
            .summary {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
                border: 2px solid #000000;
            }
            
            .summary h3 {
                color: #000000;
                margin-bottom: 20px;
                text-align: center;
                font-size: 20px;
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                padding: 8px 0;
            }
            
            .summary-row.total {
                border-top: 2px solid #000000;
                padding-top: 15px;
                margin-top: 15px;
                font-weight: 700;
                font-size: 18px;
                color: #000000;
            }
            
            .shipping-info {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            
            .shipping-info h4 {
                color: #000000;
                margin-bottom: 15px;
            }
            
            .address {
                color: #333;
                line-height: 1.8;
            }
            
            .footer {
                background-color: #000000;
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .footer-brand {
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 2px;
                margin-bottom: 10px;
            }
            
            .footer-description {
                font-size: 14px;
                opacity: 0.8;
                margin-bottom: 20px;
            }
            
            .contact-info {
                font-size: 12px;
                opacity: 0.7;
                line-height: 1.8;
            }
            
            .contact-email {
                color: #ffffff;
                text-decoration: none;
            }
            
            .contact-email:hover {
                text-decoration: underline;
            }
            
            .thank-you {
                background: linear-gradient(135deg, #000000 0%, #333333 100%);
                color: white;
                padding: 25px;
                text-align: center;
                margin: 30px 0;
                border-radius: 8px;
            }
            
            .thank-you h3 {
                margin-bottom: 10px;
                font-size: 22px;
            }
            
            .thank-you p {
                opacity: 0.9;
                font-size: 16px;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 0;
                    box-shadow: none;
                }
                
                .header, .content, .footer {
                    padding: 20px;
                }
                
                .info-grid {
                    grid-template-columns: 1fr;
                }
                
                .item {
                    flex-direction: column;
                    text-align: center;
                }
                
                .item-image {
                    margin: 0 0 15px 0;
                }
                
                .item-price {
                    text-align: center;
                    margin-top: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <div class="logo">CENTURY</div>
                <div class="header-subtitle">Premium Fashion • Worldwide Delivery</div>
            </div>
            
            <!-- Content -->
            <div class="content">
                <!-- Thank You Message -->
                <div class="thank-you">
                    <h3>🎉 Order Confirmed!</h3>
                    <p>Thank you for shopping with Century. Your order has been received and is being processed.</p>
                </div>
                
                <!-- Order Information -->
                <div class="order-info">
                    <h3>📋 Order Details</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Order Number</div>
                            <div class="info-value">#${order._id.toString().slice(-8).toUpperCase()}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Order Date</div>
                            <div class="info-value">${new Date(orderDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Customer</div>
                            <div class="info-value">${customer.name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Email</div>
                            <div class="info-value">${customer.email}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Shipping Address -->
                <div class="shipping-info">
                    <h4>🚚 Shipping Address</h4>
                    <div class="address">
                        <strong>${customer.name}</strong><br>
                        ${customer.address.street}<br>
                        ${customer.address.city}, ${customer.address.zipCode}<br>
                        📞 ${customer.phone}
                    </div>
                </div>
                
                <!-- Order Items -->
                <div class="items-section">
                    <h3>🛍️ Order Items</h3>
                    ${items.map(item => `
                        <div class="item">
                            <img src="${item.productImage || 'https://via.placeholder.com/80x80?text=Product'}" 
                                 alt="${item.productName}" 
                                 class="item-image" />
                            <div class="item-details">
                                <div class="item-name">${item.productName}</div>
                                <div class="item-specs">Size: ${item.selectedSize} • Color: ${item.selectedColor}</div>
                                <div class="item-specs">Quantity: ${item.quantity}</div>
                                ${item.salePercentage > 0 ? `<div class="item-specs" style="color: #dc3545;">🏷️ ${item.salePercentage}% OFF Applied</div>` : ''}
                            </div>
                            <div class="item-price">
                                <div class="item-total">₨${item.finalPrice.toLocaleString()}</div>
                                <div class="item-unit">₨${item.finalPrice.toLocaleString()} each</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Order Summary -->
                <div class="summary">
                    <h3>💰 Order Summary</h3>
                    <div class="summary-row">
                        <span>Subtotal (${items.length} item${items.length > 1 ? 's' : ''}):</span>
                        <span>₨${subtotalAmount.toLocaleString()}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span>${shippingCost === 0 ? 'FREE' : `₨${shippingCost.toLocaleString()}`}</span>
                    </div>
                    ${shippingCost === 0 ? `
                        <div class="summary-row" style="color: #28a745; font-size: 14px;">
                            <span>🎉 Free shipping applied!</span>
                            <span></span>
                        </div>
                    ` : ''}
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>₨${totalAmount.toLocaleString()}</span>
                    </div>
                </div>
                
                <!-- Additional Information -->
                <div style="background-color: #e3f2fd; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #2196f3;">
                    <h4 style="color: #1976d2; margin-bottom: 10px;">📝 What's Next?</h4>
                    <ul style="color: #333; padding-left: 20px;">
                        <li>You will receive a shipping confirmation email once your order is dispatched</li>
                        <li>Estimated delivery time: 3-7 business days</li>
                        <li>Track your order status in your account dashboard</li>
                        <li>For any questions, contact our customer support</li>
                    </ul>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div class="footer-brand">CENTURY.COM</div>
                <div class="footer-description">Premium Fashion • Exclusive Collections • Worldwide Delivery</div>
                <div class="contact-info">
                    📧 <a href="mailto:support@century.com" class="contact-email">support@century.com</a><br>
                    📞 +92 123 456 7890<br>
                    🌐 www.century.com<br><br>
                    Thank you for choosing Century for your fashion needs!
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export async function POST(request) {
  try {
    await connectDB();
    
    const { orderId, senderEmail, senderPassword } = await request.json();

    // Validate required fields
    if (!orderId || !senderEmail || !senderPassword) {
      return NextResponse.json(
        { error: "Order ID, sender email, and password are required" },
        { status: 400 }
      );
    }

    // Get order details
    const order = await Order.findById(orderId).lean();
    
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify the transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      console.error('Email transporter verification failed:', error);
      return NextResponse.json(
        { error: "Invalid email credentials. Please check your email and password." },
        { status: 401 }
      );
    }

    // Generate email template
    const emailTemplate = getOrderConfirmationTemplate(order);
    
    // Send confirmation email to customer
    try {
      await transporter.sendMail({
        from: `"Century Orders" <${senderEmail}>`,
        to: order.customer.email,
        subject: `Order Confirmation - Century #${order._id.toString().slice(-8).toUpperCase()}`,
        html: emailTemplate
      });

      // Update order status to confirmed if it was pending
      if (order.status === 'pending') {
        await Order.findByIdAndUpdate(orderId, { 
          status: 'confirmed',
          updatedAt: new Date()
        });
      }

      return NextResponse.json({
        success: true,
        message: "Order confirmation email sent successfully",
        customerEmail: order.customer.email,
        orderNumber: order._id.toString().slice(-8).toUpperCase()
      });

    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Order confirmation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process order confirmation',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
