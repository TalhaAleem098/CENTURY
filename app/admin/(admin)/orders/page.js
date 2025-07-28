"use client";
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { generateSimpleQRCode } from '@/utils/qrGenerator';
import bwipjs from 'bwip-js';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [statusBreakdown, setStatusBreakdown] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Invoice modal states
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [barcodeUrl, setBarcodeUrl] = useState(null);
  const [generatingQR, setGeneratingQR] = useState(false);
  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await fetch(`/api/orders/all?${queryParams}`);
      const data = await response.json();

      // Console log the full orders array and the first order as JSON
      // console.log('[Admin Orders] Orders result:', data.orders);
      if (data.orders && data.orders.length > 0) {
        // console.log('[Admin Orders] First order:', JSON.stringify(data.orders[0], null, 2));
      } else {
        // console.log('[Admin Orders] No orders found.');
      }

      if (data.success) {
        setOrders(data.orders);
        setStats(data.stats);
        setStatusBreakdown(data.statusBreakdown);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Order status updated successfully');
        fetchOrders(); // Refresh orders
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status');
    }
  };

  // Handle Place Order (Show Invoice with QR Code)
  const handlePlaceOrder = async (order) => {
    try {
      setSelectedInvoiceOrder(order);
      setShowInvoiceModal(true);
      setGeneratingQR(true);
      
      // Generate QR code
      const qrCode = await generateSimpleQRCode(order);
      setQrCodeUrl(qrCode);
      
      // Update order status to confirmed if it was pending
      if (order.status === 'pending') {
        await updateOrderStatus(order._id, 'confirmed');
      }
      
      toast.info('Invoice generated successfully!');
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setGeneratingQR(false);
    }
  };

  // Cancel order and update monthly sales
  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order? This will update monthly sales data.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/orders/cancel/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || 'Order cancelled successfully');
        fetchOrders(); // Refresh orders
      } else {
        toast.error(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error cancelling order');
    }
  };

  // Delete order permanently (no monthly sales update)
  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to DELETE this order permanently? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || 'Order deleted successfully');
        fetchOrders(); // Refresh orders
      } else {
        toast.error(data.error || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Error deleting order');
    }
  };

  // Generate barcode for invoice (client fetches from API route)
  useEffect(() => {
    if (showInvoiceModal && selectedInvoiceOrder) {
      const url = `/api/barcode?text=${encodeURIComponent(selectedInvoiceOrder._id)}`;
      setBarcodeUrl(url);
    } else {
      setBarcodeUrl(null);
    }
  }, [showInvoiceModal, selectedInvoiceOrder]);

  // Handle PDF Download using html2pdf.js
  const handleDownloadInvoice = async (order) => {
    try {
      toast.info('Generating PDF invoice...');
      
      // Set the selected order for the hidden HTML content
      setSelectedInvoiceOrder(order);
      
      // Wait a bit for the DOM to update
      setTimeout(async () => {
        try {
          // Dynamic import to avoid SSR issues
          const html2pdf = (await import('html2pdf.js')).default;
          
          const element = document.getElementById('invoice-content');
          if (!element) {
            toast.error('Invoice content not found');
            return;
          }

          const opt = {
            margin: 0.5,
            filename: `Invoice_${order._id.slice(-8)}_${new Date(order.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
          };

          await html2pdf().set(opt).from(element).save();
          toast.success('Invoice downloaded successfully!');
        } catch (error) {
          console.error('Error generating PDF:', error);
          toast.error('Failed to generate PDF');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error preparing PDF:', error);
      toast.error('Failed to prepare PDF');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters, fetchOrders]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₨{stats.totalRevenue?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">₨{Math.round(stats.avgOrderValue || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-50">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search by customer name, email, phone, or product..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="totalAmount-desc">Highest Amount</option>
                <option value="totalAmount-asc">Lowest Amount</option>
                <option value="status-asc">Status A-Z</option>
              </select>
            </div>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    
                    {/* Order ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order._id.slice(-6)}</div>
                      <div className="text-sm text-gray-500">{order.totalItems} items</div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                      <div className="text-sm text-gray-500">{order.customer.phone}</div>
                    </td>

                    {/* Items Preview */}
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={item.productImage || '/assets/carousel-1.webp'}
                              alt={item.productName}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{order.totalQuantity} total qty</div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">₨{order.totalAmount.toLocaleString()}</div>
                      {order.shippingCost > 0 && (
                        <div className="text-xs text-gray-500">+₨250 shipping</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-black ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="text-black hover:text-gray-700 font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handlePlaceOrder(order)}
                          className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-gray-800 transition-colors"
                        >
                          Place Order
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download PDF
                        </button>
                        
                        {/* Cancel Button - Only show if order is not already cancelled */}
                        {order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Order
                          </button>
                        )}
                        
                        {/* Delete Button - Always show with warning */}
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalOrders)} of {pagination.totalOrders} orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                    <p className="text-gray-600">Order #{selectedOrder._id.slice(-6)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDownloadInvoice(selectedOrder)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </button>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                
                {/* Order Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-gray-900">{selectedOrder.customer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{selectedOrder.customer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{selectedOrder.customer.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Address</label>
                        <p className="text-gray-900">
                          {selectedOrder.customer.address.street}<br />
                          {selectedOrder.customer.address.city}, {selectedOrder.customer.address.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">₨{selectedOrder.subtotalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">
                          {selectedOrder.shippingCost === 0 ? <span className="font-bold">FREE</span> : `₨250`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">{selectedOrder.customer?.paymentMethod || 'COD'}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-lg font-bold">₨{selectedOrder.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="pt-3">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Order Date:</span>
                        <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.productImage || '/assets/carousel-1.webp'}
                            alt={item.productName}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">{item.brand} • {item.material}</p>
                          <p className="text-sm text-gray-600">Size: {item.selectedSize} • Color: {item.selectedColor}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₨{item.finalPrice.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          {item.salePercentage > 0 && (
                            <p className="text-xs text-red-600">{item.salePercentage}% off</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {showInvoiceModal && selectedInvoiceOrder && (
          <div 
            className="fixed inset-0 bg-white flex items-center justify-center z-50 p-0"
            onClick={() => setShowInvoiceModal(false)}
            style={{ minHeight: '100vh', height: '100vh' }}
          >
            <div 
              className="bg-white w-full max-w-5xl h-full flex flex-col border border-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ fontFamily: 'monospace', color: '#111', minHeight: '100vh', height: '100vh', maxHeight: '100vh', minWidth: 0, padding: 0 }}
            >
              {/* Modal Header */}
              <div className="flex justify-center items-center p-4 border-b border-black relative" style={{padding: '1rem 1rem 0.5rem 1rem'}}>
                <h2 className="text-xl font-bold text-black text-center w-full tracking-wider">INVOICE</h2>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="absolute right-4 top-1 text-black text-2xl font-light bg-transparent border-none"
                  aria-label="Close"
                  style={{ fontWeight: 700, fontSize: '2rem', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
              {/* Invoice Content - Black & White, Classic Invoice Style */}
              <div className="flex-1 flex flex-col gap-2" style={{padding: '2vw 2vw 1vw 2vw', minHeight: 0}}>
                {/* Website Name */}
                <div className="text-center mb-2">
                  <h1 className="text-2xl font-extrabold text-black tracking-widest">CENTURY.PK</h1>
                  <p className="text-xs text-black">Premium Fashion | Exclusive Collections | Worldwide Delivery</p>
                </div>
                {/* Order & Delivery Info - Classic Invoice Row */}
                <div className="flex flex-row gap-0 mb-4 text-xs border-b border-black pb-2">
                  <div className="flex-1 pr-4 border-r border-black">
                    <div className="font-bold mb-1 text-black uppercase">Order Info</div>
                    <div><span className="font-semibold">Order ID:</span> <span className="font-mono">#{selectedInvoiceOrder._id.slice(-8).toUpperCase()}</span></div>
                    <div><span className="font-semibold">Date:</span> {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('en-GB')}</div>
                    <div><span className="font-semibold">Status:</span> {selectedInvoiceOrder.status.charAt(0).toUpperCase() + selectedInvoiceOrder.status.slice(1)}</div>
                    <div><span className="font-semibold">Items:</span> {selectedInvoiceOrder.totalItems}</div>
                  </div>
                  <div className="flex-1 pl-4">
                    <div className="font-bold mb-1 text-black uppercase">Delivery Details</div>
                    <div className="flex flex-row flex-wrap gap-x-6 gap-y-1 items-center">
                      <div><span className="font-semibold">Name:</span> {selectedInvoiceOrder.customer.name}</div>
                      <div><span className="font-semibold">Phone:</span> {selectedInvoiceOrder.customer.phone}</div>
                      <div><span className="font-semibold">Email:</span> {selectedInvoiceOrder.customer.email}</div>
                      <div><span className="font-semibold">Address:</span> {selectedInvoiceOrder.customer.address.street}</div>
                      <div><span className="font-semibold">City:</span> {selectedInvoiceOrder.customer.address.city}</div>
                      <div><span className="font-semibold">Zip:</span> {selectedInvoiceOrder.customer.address.zipCode}</div>
                    </div>
                  </div>
                </div>
                {/* Items Table */}
                <div className="flex-1" style={{overflow: 'visible', minHeight: 0, marginBottom: 0}}>
                  <table className="w-full text-xs border border-black">
                    <thead>
                      <tr className="bg-white">
                        <th className="p-2 text-left border-b border-black">Product</th>
                        <th className="p-2 text-center border-b border-black">Size</th>
                        <th className="p-2 text-center border-b border-black">Color</th>
                        <th className="p-2 text-center border-b border-black">Qty</th>
                        <th className="p-2 text-right border-b border-black">Unit</th>
                        <th className="p-2 text-right border-b border-black">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoiceOrder.items.map((item, idx) => (
                        <tr key={idx} className="bg-white border-b border-black">
                          <td className="p-2 font-medium border-r border-black">{item.productName}{item.salePercentage > 0 && <span className="ml-1 text-black text-[10px]">({item.salePercentage}% OFF)</span>}</td>
                          <td className="p-2 text-center border-r border-black">{item.selectedSize}</td>
                          <td className="p-2 text-center border-r border-black">{item.selectedColor}</td>
                          <td className="p-2 text-center border-r border-black">{item.quantity}</td>
                          <td className="p-2 text-right border-r border-black">₨{item.finalPrice.toLocaleString()}</td>
                          <td className="p-2 text-right font-semibold">₨{(item.finalPrice * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Summary & Barcode */}
                <div className="flex flex-row gap-4 mt-4 items-end border-t border-black pt-4">
                  <div className="flex-1 text-xs">
                    <div className="font-bold mb-1 text-black uppercase">Summary</div>
                    <div className="flex justify-between"><span>Subtotal:</span><span>₨{selectedInvoiceOrder.subtotalAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Shipping:</span><span>{selectedInvoiceOrder.shippingCost === 0 ? <span className="font-bold">FREE</span> : `₨${selectedInvoiceOrder.shippingCost.toLocaleString()}`}</span></div>
                    <div className="flex justify-between"><span>Payment Method:</span><span className="font-semibold">{selectedInvoiceOrder.customer?.paymentMethod || 'COD'}</span></div>
                    <div className="flex justify-between"><span>Payment Status:</span><span className={`font-semibold ${selectedInvoiceOrder.customer?.paymentMethod === 'Online' ? 'text-green-600' : 'text-orange-600'}`}>{selectedInvoiceOrder.customer?.paymentMethod === 'Online' ? 'PAID' : 'PENDING'}</span></div>
                    <div className="flex justify-between border-t border-black mt-1 pt-1 font-bold text-base"><span>Total:</span><span>₨{selectedInvoiceOrder.totalAmount.toLocaleString()}</span></div>
                  </div>
                  <div className="flex flex-col items-center justify-end w-64">
                    <div className="bg-white p-4 border-2 border-black mb-2 flex flex-col items-center" style={{ minWidth: 220 }}>
                      {barcodeUrl ? (
                        <Image 
                          src={barcodeUrl} 
                          alt="Order Barcode" 
                          width={200} 
                          height={60} 
                          style={{ objectFit: 'contain' }}
                          unoptimized
                        />
                      ) : (
                        <div className="w-52 h-14 bg-white border border-black flex items-center justify-center text-xs text-black">BARCODE</div>
                      )}
                    </div>
                    <div className="text-xs text-black text-center font-semibold mb-1">Order Barcode</div>
                    <div className="text-[10px] text-black text-center leading-tight">Scan for order details<br/>centurypk.com</div>
                  </div>
                </div>
                {/* Footer */}
                <div className="text-center mt-2 pt-2 border-t border-black text-xs text-black">
                  <div className="font-bold mb-1">Thank you for choosing CENTURY.PK</div>
                  <div>support@centurypk.com | +923227154205 | www.centurypk.com</div>
                  <div className="mt-1 italic">This is a computer-generated invoice. No signature required.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Invoice HTML for PDF Generation */}
        <div style={{ display: 'none' }}>
          {(selectedInvoiceOrder || selectedOrder) && (
            <div id="invoice-content">
              <div style={{ 
          width: '680px', 
          maxWidth: '680px',
          padding: '15px', 
          fontFamily: 'Arial, sans-serif', 
          background: '#fff', 
          color: '#111', 
          boxSizing: 'border-box',
          margin: '0 auto',
          fontSize: '12px',
          lineHeight: '1.3',
          textAlign: 'center',
          borderRadius: '0', // No rounded corners
        }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '2px solid #111', paddingBottom: '6px' }}>
                  <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 3px 0', letterSpacing: '1px' }}>Centurypk.com</h1>
                  <div style={{ fontSize: '8px', color: '#666', margin: '0' }}>Premium Fashion | Exclusive Collections | Delivery All Over Pakistan</div>
                  <h2 style={{ fontSize: '14px', fontWeight: '600', margin: '4px 0 0 0', color: '#111' }}>INVOICE</h2>
                </div>
                {/* Order & Customer Info */}
                <div style={{ display: 'flex', marginBottom: '10px', fontSize: '8px', gap: '12px', textAlign: 'center' }}>
                  <div style={{ flex: '1', minWidth: '0', textAlign: 'left' }}>
                    <div style={{ fontWeight: '700', marginBottom: '3px', fontSize: '9px', color: '#111', textAlign: 'left', letterSpacing: '0.5px' }}>ORDER DETAILS</div>
                    <div style={{ marginBottom: '1px', textAlign: 'left' }}><strong>Order ID:</strong> #{(selectedInvoiceOrder || selectedOrder)?._id.slice(-8).toUpperCase()}</div>
                    <div style={{ marginBottom: '1px', textAlign: 'left' }}><strong>Date:</strong> {new Date((selectedInvoiceOrder || selectedOrder)?.createdAt).toLocaleDateString('en-GB')}</div>
                    <div style={{ marginBottom: '1px', textAlign: 'left' }}><strong>Status:</strong> {(selectedInvoiceOrder || selectedOrder)?.status.charAt(0).toUpperCase() + (selectedInvoiceOrder || selectedOrder)?.status.slice(1)}</div>
                    <div style={{ textAlign: 'left' }}><strong>Total Items:</strong> {(selectedInvoiceOrder || selectedOrder)?.totalItems}</div>
                  </div>
                  <div style={{ flex: '1', minWidth: '0', textAlign: 'left' }}>
                    <div style={{ fontWeight: '700', marginBottom: '3px', fontSize: '9px', color: '#111', textAlign: 'left', letterSpacing: '0.5px' }}>CUSTOMER INFO</div>
                    <div style={{ marginBottom: '1px', textAlign: 'left' }}><strong>Name:</strong> {(selectedInvoiceOrder || selectedOrder)?.customer.name}</div>
                    <div style={{ marginBottom: '1px', textAlign: 'left' }}><strong>Phone:</strong> {(selectedInvoiceOrder || selectedOrder)?.customer.phone}</div>
                    <div style={{ marginBottom: '1px', textAlign: 'left' }}><strong>Email:</strong> {(selectedInvoiceOrder || selectedOrder)?.customer.email}</div>
                    <div style={{ wordWrap: 'break-word', fontSize: '7px', textAlign: 'left' }}><strong>Address:</strong> {(selectedInvoiceOrder || selectedOrder)?.customer.address.street}, {(selectedInvoiceOrder || selectedOrder)?.customer.address.city}, {(selectedInvoiceOrder || selectedOrder)?.customer.address.zipCode}</div>
                  </div>
                </div>
                {/* Items Table */}
                <table style={{ 
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginBottom: '10px',
                  fontSize: '7px',
                  border: '1px solid #111',
                  tableLayout: 'fixed',
                  borderRadius: '0', // No rounded corners
                  // textAlign: 'center'
                }}>
                  <colgroup>
                    <col style={{ width: '40%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '15%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ backgroundColor: '#111', color: '#fff' }}>
                      <th style={{ border: '1px solid #111', padding: '3px 2px 5px 2px', textAlign: 'center', fontWeight: '600' }}>Product</th>
                      <th style={{ border: '1px solid #111', padding: '3px 2px 5px 2px', textAlign: 'center', fontWeight: '600' }}>Size</th>
                      <th style={{ border: '1px solid #111', padding: '3px 2px 5px 2px', textAlign: 'center', fontWeight: '600' }}>Color</th>
                      <th style={{ border: '1px solid #111', padding: '3px 2px 5px 2px', textAlign: 'center', fontWeight: '600' }}>Qty</th>
                      <th style={{ border: '1px solid #111', padding: '3px 2px 5px 2px', textAlign: 'center', fontWeight: '600' }}>Unit Price</th>
                      <th style={{ border: '1px solid #111', padding: '3px 2px 5px 2px', textAlign: 'center', fontWeight: '600' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedInvoiceOrder || selectedOrder)?.items.map((item, idx) => {
                      const productName = item.productName + (item.salePercentage > 0 ? ` (${item.salePercentage}% OFF)` : '');
                      const truncatedName = productName.length > 42 ? productName.substring(0, 39) + '...' : productName;
                      return (
                        <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f8f8' }}>
                          <td style={{ 
                            border: '1px solid #ddd', 
                            padding: '3px 2px 5px 2px', 
                            fontSize: '6px', 
                            lineHeight: '1.2', 
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            borderRadius: '0',
                            // textAlign: 'center'
                          }}>
                            {truncatedName}
                          </td>
                          <td style={{ border: '1px solid #ddd', padding: '3px 2px 5px 2px', textAlign: 'center', fontSize: '6px', borderRadius: '0' }}>{item.selectedSize}</td>
                          <td style={{ border: '1px solid #ddd', padding: '3px 2px 5px 2px', textAlign: 'center', fontSize: '6px', borderRadius: '0' }}>{item.selectedColor}</td>
                          <td style={{ border: '1px solid #ddd', padding: '3px 2px 5px 2px', textAlign: 'center', fontSize: '6px', borderRadius: '0' }}>{item.quantity}</td>
                          <td style={{ border: '1px solid #ddd', padding: '3px 2px 5px 2px', textAlign: 'center', fontSize: '6px', borderRadius: '0' }}>₨{item.finalPrice.toLocaleString()}</td>
                          <td style={{ border: '1px solid #ddd', padding: '3px 2px 5px 2px', textAlign: 'center', fontSize: '6px', fontWeight: '600', borderRadius: '0' }}>₨{(item.finalPrice * item.quantity).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Summary Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '8px',
                  gap: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                  flex: '0 0 100%',
                  fontSize: '8px',
                  border: '1px solid #111',
                  borderRadius: '0', // No rounded corners
                  margin: '0 auto',
                  padding: '5px',
                  textAlign: 'center',
                  background: '#fafafa',
                  maxWidth: '400px'
                }}>
                    <div style={{ fontWeight: '700', marginBottom: '4px', fontSize: '9px', color: '#111', borderBottom: '1px solid #111', paddingBottom: '8px' }}>ORDER SUMMARY</div>
                    {/* Subtotal, Delivery, and Total calculated live from items */}
                    {(() => {
                      const order = selectedInvoiceOrder || selectedOrder;
                      const subtotal = order?.items?.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0) || 0;
                      const freeDeliveryThreshold = 4999;
                      const shippingCost = subtotal >= freeDeliveryThreshold ? 0 : 250;
                      const total = subtotal + shippingCost;
                      return (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px', padding: '1px 0', textAlign: 'left' }}>
                            <span style={{ flex: 1 }}>Subtotal:</span>
                            <span style={{ flex: 1, fontWeight: '600' }}>₨{subtotal.toLocaleString()}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', padding: '1px 0', textAlign: 'left' }}>
                            <span style={{ flex: 1 }}>Delivery Charges:</span>
                            <span style={{ flex: 1, fontWeight: '600' }}>{shippingCost === 0 ? 'FREE' : `₨${shippingCost.toLocaleString()}`}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px', padding: '1px 0', textAlign: 'left' }}>
                            <span style={{ flex: 1 }}>Payment Method:</span>
                            <span style={{ flex: 1, fontWeight: '600' }}>{order?.customer?.paymentMethod || 'COD'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', padding: '1px 0', textAlign: 'left' }}>
                            <span style={{ flex: 1 }}>Payment Status:</span>
                            <span style={{ flex: 1, fontWeight: '700', color: order?.customer?.paymentMethod === 'Online' ? '#059669' : '#d97706' }}>
                              {order?.customer?.paymentMethod === 'Online' ? 'PAID' : 'PENDING'}
                            </span>
                          </div>
                          <div style={{ 
                            borderTop: '2px solid #111', 
                            marginTop: '4px', 
                            paddingTop: '4px', 
                            display: 'flex', 
                            justifyContent: 'center',
                            fontSize: '10px', 
                            fontWeight: '700',
                            backgroundColor: '#111',
                            color: '#fff',
                            padding: '6px 8px',
                            border: '2px solid #111',
                            borderRadius: '0', // No rounded corners
                            marginTop: '8px',
                            textAlign: 'center'
                          }}>
                            <span style={{ flex: 1 }}>TOTAL AMOUNT:</span>
                            <span style={{ flex: 1 }}>₨{total.toLocaleString()}</span>
                          </div>
                        </>
                      );
                    })()}
                   
                  </div>
                </div>
                {/* Footer */}
                <div style={{ 
                  borderTop: '1px solid #111', 
                  paddingTop: '6px', 
                  fontSize: '7px', 
                  textAlign: 'center',
                  color: '#666'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '2px', color: '#111' }}>Thank you for choosing Us</div>
                  <div style={{ marginBottom: '1px' }}>support@centurypk.com | +923227154205 | www.centurypk.com</div>
                  <div style={{ fontSize: '6px', }}>This is a computer-generated invoice. No signature required.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
