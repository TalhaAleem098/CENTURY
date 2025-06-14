import jsPDF from 'jspdf';

export const generateOrderPDF = (order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Colors
  const primaryColor = [0, 0, 0]; // Black
  const secondaryColor = [248, 249, 250]; // Light gray
  const accentColor = [75, 85, 99]; // Gray-600
  
  // Header Section with Background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Brand Logo/Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('CENTURY.PK', pageWidth / 2, 25, { align: 'center' });
  
  // Tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Fashion • Exclusive Collections • Worldwide Delivery', pageWidth / 2, 38, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Invoice Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER INVOICE', 20, 70);
  
  // Order Information Box
  const orderNumber = order._id.toString().slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Order info background
  doc.setFillColor(...secondaryColor);
  doc.rect(20, 80, pageWidth - 40, 30, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, 80, pageWidth - 40, 30, 'S');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Order #:', 25, 92);
  doc.setFont('helvetica', 'normal');
  doc.text(orderNumber, 55, 92);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 25, 102);
  doc.setFont('helvetica', 'normal');
  doc.text(orderDate, 45, 102);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Status:', 120, 92);
  doc.setFont('helvetica', 'normal');
  doc.text(order.status.charAt(0).toUpperCase() + order.status.slice(1), 145, 92);
  
  // Customer & Shipping Information
  let currentY = 130;
  
  // Customer Info Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER INFORMATION', 20, currentY);
  
  currentY += 5;
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(1);
  doc.line(20, currentY, 95, currentY);
  
  currentY += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', 20, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(order.customer.name, 45, currentY);
  
  currentY += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 20, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(order.customer.email, 45, currentY);
  
  currentY += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Phone:', 20, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(order.customer.phone, 45, currentY);
  
  // Shipping Address Section
  currentY = 130;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SHIPPING ADDRESS', 110, currentY);
  
  currentY += 5;
  doc.setDrawColor(...accentColor);
  doc.line(110, currentY, 190, currentY);
  
  currentY += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(order.customer.address.street, 110, currentY);
  
  currentY += 10;
  doc.text(`${order.customer.address.city}, ${order.customer.address.zipCode}`, 110, currentY);
  
  // Items Section
  currentY = 200;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER ITEMS', 20, currentY);
  
  currentY += 5;
  doc.setDrawColor(...accentColor);
  doc.line(20, currentY, 80, currentY);
  
  currentY += 15;
  
  // Table Header
  doc.setFillColor(...primaryColor);
  doc.rect(20, currentY - 8, pageWidth - 40, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  doc.text('Product', 25, currentY);
  doc.text('Size', 85, currentY);
  doc.text('Color', 105, currentY);
  doc.text('Qty', 125, currentY);
  doc.text('Unit Price', 140, currentY);
  doc.text('Total', 170, currentY);
  
  doc.setTextColor(0, 0, 0);
  currentY += 12;
  
  // Table Rows
  order.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, currentY - 8, pageWidth - 40, 12, 'F');
    }
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    // Truncate long names
    const productName = item.productName.length > 25 ? 
      item.productName.substring(0, 22) + '...' : item.productName;
    
    doc.text(productName, 25, currentY);
    doc.text(item.selectedSize, 85, currentY);
    doc.text(item.selectedColor, 105, currentY);
    doc.text(item.quantity.toString(), 125, currentY);
    doc.text(`₨${item.finalPrice.toLocaleString()}`, 140, currentY);
    doc.text(`₨${(item.finalPrice * item.quantity).toLocaleString()}`, 170, currentY);
    
    // Sale indicator
    if (item.salePercentage > 0) {
      doc.setTextColor(220, 38, 127); // Pink for sale
      doc.setFontSize(7);
      doc.text(`${item.salePercentage}% OFF`, 25, currentY + 8);
      doc.setTextColor(0, 0, 0);
    }
    
    currentY += 15;
  });
  
  // Summary Section
  currentY += 20;
  
  // Summary Box
  doc.setFillColor(245, 245, 245);
  doc.rect(120, currentY - 10, 70, 50, 'F');
  doc.setDrawColor(...accentColor);
  doc.rect(120, currentY - 10, 70, 50, 'S');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER SUMMARY', 125, currentY);
  
  currentY += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Subtotal
  doc.text('Subtotal:', 125, currentY);
  doc.text(`₨${order.subtotalAmount.toLocaleString()}`, 170, currentY);
  
  currentY += 10;
  // Shipping
  doc.text('Shipping:', 125, currentY);
  if (order.shippingCost === 0) {
    doc.setTextColor(34, 197, 94); // Green
    doc.text('FREE', 170, currentY);
    doc.setTextColor(0, 0, 0);
  } else {
    doc.text(`₨${order.shippingCost.toLocaleString()}`, 170, currentY);
  }
  
  currentY += 15;
  // Total
  doc.setDrawColor(...accentColor);
  doc.line(125, currentY - 5, 185, currentY - 5);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 125, currentY);
  doc.text(`₨${order.totalAmount.toLocaleString()}`, 170, currentY);
  
  // Free shipping note
  if (order.shippingCost === 0) {
    currentY += 10;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(34, 197, 94);
    doc.text('🎉 Free shipping on orders above ₨4,999!', 125, currentY);
    doc.setTextColor(0, 0, 0);
  }
  
  // Footer
  const footerY = pageHeight - 40;
  
  // Footer background
  doc.setFillColor(...primaryColor);
  doc.rect(0, footerY - 10, pageWidth, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Thank you for choosing CENTURY.PK!', pageWidth / 2, footerY + 5, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('For support: support@century.pk | +92 123 456 7890', pageWidth / 2, footerY + 15, { align: 'center' });
  doc.text('Visit us at: www.century.pk', pageWidth / 2, footerY + 25, { align: 'center' });
  
  return doc;
};

export const downloadOrderPDF = (order) => {
  const doc = generateOrderPDF(order);
  const orderNumber = order._id.toString().slice(-8).toUpperCase();
  doc.save(`Century_Order_${orderNumber}.pdf`);
};

export const getPDFBlob = (order) => {
  const doc = generateOrderPDF(order);
  return doc.output('blob');
};
