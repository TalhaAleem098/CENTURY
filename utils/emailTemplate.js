export const generateEmailTemplate = (order) => {
  const orderNumber = order._id.toString().slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create items list for email
  const itemsList = order.items.map(item => 
    `• ${item.productName}
  Size: ${item.selectedSize} | Color: ${item.selectedColor}
  Quantity: ${item.quantity} | Price: ₨${item.finalPrice.toLocaleString()}
  Total: ₨${(item.finalPrice * item.quantity).toLocaleString()}`
  ).join('\n\n');

  const emailSubject = `Order Confirmation - Century.pk #${orderNumber}`;
  
  const emailBody = `Dear ${order.customer.name},

🎉 CONGRATULATIONS! Your order has been confirmed.

═══════════════════════════════════════
🏷️  ORDER DETAILS
═══════════════════════════════════════

Order Number: #${orderNumber}
Order Date: ${orderDate}
Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

═══════════════════════════════════════
👤 CUSTOMER INFORMATION
═══════════════════════════════════════

Name: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}

📍 Shipping Address:
${order.customer.address.street}
${order.customer.address.city}, ${order.customer.address.zipCode}

═══════════════════════════════════════
🛍️  ORDER ITEMS
═══════════════════════════════════════

${itemsList}

═══════════════════════════════════════
💰 ORDER SUMMARY
═══════════════════════════════════════

Subtotal: ₨${order.subtotalAmount.toLocaleString()}
Shipping: ${order.shippingCost === 0 ? 'FREE 🎉' : `₨${order.shippingCost.toLocaleString()}`}
${order.shippingCost === 0 ? 'Free shipping applied on orders above ₨4,999!' : ''}

TOTAL: ₨${order.totalAmount.toLocaleString()}

═══════════════════════════════════════
📋 WHAT'S NEXT?
═══════════════════════════════════════

✅ Order Confirmed
📦 Processing (1-2 business days)
🚚 Shipped (3-7 business days)
🏠 Delivered

You will receive tracking information once your order is shipped.

═══════════════════════════════════════
📞 NEED HELP?
═══════════════════════════════════════

📧 Email: support@century.pk
📱 Phone: +92 123 456 7890
🌐 Website: www.century.pk

Thank you for choosing CENTURY.PK for your fashion needs!

Best regards,
The CENTURY.PK Team
Premium Fashion • Exclusive Collections • Worldwide Delivery`;

  return {
    subject: emailSubject,
    body: emailBody
  };
};

export const createMailtoLink = (order) => {
  const template = generateEmailTemplate(order);
  const encodedSubject = encodeURIComponent(template.subject);
  const encodedBody = encodeURIComponent(template.body);
  
  return `mailto:${order.customer.email}?subject=${encodedSubject}&body=${encodedBody}`;
};
