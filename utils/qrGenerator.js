import QRCode from 'qrcode';

export const generateQRCodeData = (order) => {
  const orderNumber = order._id.toString().slice(-8).toUpperCase();
  
  // Create data object for QR code
  const qrData = {
    website: "https://centurypk.com",
    orderNumber: orderNumber,
    orderId: order._id,
    customerEmail: order.customer.email,
    customerName: order.customer.name,
    totalAmount: order.totalAmount,
    orderDate: order.createdAt,
    status: order.status,
    searchUrl: `https://centurypk.com/order-search?orderNumber=${orderNumber}&email=${encodeURIComponent(order.customer.email)}`
  };
  
  // Convert to JSON string for QR code
  return JSON.stringify(qrData);
};

export const generateQRCodeImage = async (order) => {
  try {
    const qrData = generateQRCodeData(order);
    
    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export const generateSimpleQRCode = async (order) => {
  try {
    const orderNumber = order._id.toString().slice(-8).toUpperCase();
    const searchUrl = `https://centurypk.com/order-search?order=${orderNumber}&email=${encodeURIComponent(order.customer.email)}`;
    
    // Generate QR code as data URL
    const qrCodeUrl = await QRCode.toDataURL(searchUrl, {
      width: 180,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};
