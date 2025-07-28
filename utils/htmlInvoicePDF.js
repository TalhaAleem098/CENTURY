// Utility to generate PDF from HTML using html2pdf.js in Next.js
// Usage: import { downloadInvoicePDF } from '@/utils/htmlInvoicePDF';
// Call downloadInvoicePDF(order, elementId) where elementId is the container for invoice HTML

import html2pdf from 'html2pdf.js';

export function downloadInvoicePDF(order, elementId = 'invoice-content') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Invoice HTML element not found:', elementId);
    return;
  }

  // Dynamic PDF options based on content size
  const opt = {
    margin:       0.5,
    filename:     `Invoice_${order._id.slice(-8)}_${new Date(order.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
  };

  // Adjust height for dynamic content
  // (html2pdf auto-calculates, but you can tweak scale/margin if needed)
  html2pdf().set(opt).from(element).save();
}
