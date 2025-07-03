import { generateInvoicePDF } from './pdfInvoiceGenerator.js';

// Sample order data for testing
const sampleOrder = {
  _id: "64f123456789abcdef123456",
  createdAt: "2024-01-15T10:30:00Z",
  status: "confirmed",
  totalItems: 2,
  customer: {
    name: "John Doe",
    phone: "+92 300 1234567",
    email: "john.doe@example.com",
    address: {
      street: "123 Main Street, Block A",
      city: "Karachi",
      zipCode: "75400"
    }
  },
  items: [
    {
      productName: "Premium Cotton T-Shirt",
      selectedSize: "L",
      selectedColor: "Black",
      quantity: 2,
      finalPrice: 1500,
      salePercentage: 10
    },
    {
      productName: "Classic Jeans",
      selectedSize: "32",
      selectedColor: "Blue",
      quantity: 1,
      finalPrice: 2500,
      salePercentage: 0
    }
  ],
  subtotalAmount: 5500,
  shippingCost: 0,
  totalAmount: 5500
};

async function testPDFGeneration() {
  try {
    console.log('Testing PDF generation...');
    const pdfBytes = await generateInvoicePDF(sampleOrder);
    console.log('PDF generated successfully!');
    console.log('PDF size:', pdfBytes.length, 'bytes');
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
}

export { testPDFGeneration };
