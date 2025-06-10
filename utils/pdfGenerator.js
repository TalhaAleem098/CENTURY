import { jsPDF } from 'jspdf';

// Function to manually draw a table since autoTable might not be working
const drawTable = (doc, data, startY) => {
  const { headers, rows } = data;
  const startX = 20;
  const cellHeight = 20;
  const colWidths = [60, 20, 20, 15, 30, 30];
  let currentY = startY;
  
  // Draw header
  doc.setFillColor(0, 0, 0);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  headers.forEach((header, index) => {
    const cellX = startX + colWidths.slice(0, index).reduce((sum, width) => sum + width, 0);
    doc.rect(cellX, currentY, colWidths[index], cellHeight, 'F');
    doc.text(header, cellX + 3, currentY + 13);
  });
  
  currentY += cellHeight;
  
  // Draw rows
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  rows.forEach((row, rowIndex) => {
    // Alternate row colors
    if (rowIndex % 2 === 0) {
      doc.setFillColor(248, 249, 250);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    
    row.forEach((cell, colIndex) => {
      const cellX = startX + colWidths.slice(0, colIndex).reduce((sum, width) => sum + width, 0);
      doc.rect(cellX, currentY, colWidths[colIndex], cellHeight, 'F');
      doc.rect(cellX, currentY, colWidths[colIndex], cellHeight, 'S');
      
      // Wrap text if too long
      const text = cell.toString();
      if (text.length > 15 && colIndex === 0) {
        const lines = doc.splitTextToSize(text, colWidths[colIndex] - 6);
        doc.text(lines[0], cellX + 3, currentY + 13);
        if (lines[1]) {
          doc.text(lines[1], cellX + 3, currentY + 20);
        }
      } else {
        doc.text(text, cellX + 3, currentY + 13);
      }
    });
    
    currentY += cellHeight;
  });
  
  return currentY;
};

export const generateOrderPDF = (order) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');
  
  // Add CENTURY.PK brand at top center
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CENTURY.PK', doc.internal.pageSize.width / 2, 25, { align: 'center' });
  
  // Add tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Fashion • Exclusive Collections • Worldwide Delivery', doc.internal.pageSize.width / 2, 35, { align: 'center' });
  
  // Add horizontal line
  doc.setLineWidth(0.5);
  doc.line(20, 45, doc.internal.pageSize.width - 20, 45);
  
  // Order header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER INVOICE', 20, 60);
  
  // Order details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const orderNumber = order._id.toString().slice(-8).toUpperCase();
  
  // Order info section
  doc.text(`Order Number: #${orderNumber}`, 20, 75);
  doc.text(`Order Date: ${orderDate}`, 20, 85);
  doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 20, 95);
  
  // Customer information section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER INFORMATION', 20, 115);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${order.customer.name}`, 20, 130);
  doc.text(`Email: ${order.customer.email}`, 20, 140);
  doc.text(`Phone: ${order.customer.phone}`, 20, 150);
  
  // Shipping address
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SHIPPING ADDRESS', 20, 170);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');  doc.text(`${order.customer.address.street}`, 20, 185);
  doc.text(`${order.customer.address.city}, ${order.customer.address.zipCode}`, 20, 195);
  
  // Items table
  const tableData = {
    headers: ['Product', 'Size', 'Color', 'Qty', 'Unit Price', 'Total'],
    rows: order.items.map(item => [
      item.productName,
      item.selectedSize,
      item.selectedColor,
      item.quantity.toString(),
      `₨${item.finalPrice.toLocaleString()}`,
      `₨${(item.finalPrice * item.quantity).toLocaleString()}`
    ])
  };
  
  const finalY = drawTable(doc, tableData, 210);
  
  // Summary section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ORDER SUMMARY', 120, finalY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal: ₨${order.subtotalAmount.toLocaleString()}`, 120, finalY + 15);
  doc.text(`Shipping: ${order.shippingCost === 0 ? 'FREE' : `₨${order.shippingCost.toLocaleString()}`}`, 120, finalY + 25);
  
  // Total line
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL: ₨${order.totalAmount.toLocaleString()}`, 120, finalY + 40);
  
  // Free shipping note
  if (order.shippingCost === 0) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('🎉 Free shipping applied!', 120, finalY + 50);
  }
  
  // Footer
  const footerY = doc.internal.pageSize.height - 30;
  doc.setLineWidth(0.5);
  doc.line(20, footerY - 10, doc.internal.pageSize.width - 20, footerY - 10);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for shopping with CENTURY.PK', doc.internal.pageSize.width / 2, footerY, { align: 'center' });
  doc.text('For support: support@century.pk | +92 123 456 7890', doc.internal.pageSize.width / 2, footerY + 8, { align: 'center' });
  doc.text('www.century.pk', doc.internal.pageSize.width / 2, footerY + 16, { align: 'center' });
  
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
