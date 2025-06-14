"use client";
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { generateSimpleQRCode } from '@/utils/qrGenerator';

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
      
      toast.success('Invoice generated successfully!');
      
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setGeneratingQR(false);
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
                        <div className="text-xs text-gray-500">+₨{order.shippingCost} shipping</div>
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
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
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
                        <span className="font-medium">₨{selectedOrder.shippingCost.toLocaleString()}</span>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:static print:bg-transparent print:p-0">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto print:max-w-full print:rounded-none print:shadow-none print:border-0 print:overflow-visible print:max-h-full print:h-auto print:w-full print:relative">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b print:border-0 print:p-2">
                <h2 className="text-xl font-bold text-gray-900 print:text-lg print:font-semibold">Order Invoice</h2>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl print:hidden"
                >
                  ×
                </button>
                <button
                  onClick={() => window.print()}
                  className="ml-4 bg-black text-white px-4 py-2 rounded print:hidden"
                >
                  Print Invoice
                </button>
              </div>

              {/* Invoice Content */}
              <div className="p-6 bg-white text-sm print:p-2 print:text-xs print:bg-white print:shadow-none print:rounded-none print:border-0 print:max-w-full print:w-full print:overflow-visible">
                
                {/* Header */}
                <div className="text-center mb-6 border-b-2 border-black pb-4 print:mb-2 print:pb-2 print:border-b print:text-base">
                  <h1 className="text-3xl font-bold text-black mb-2 print:text-xl print:mb-1">CENTURY.PK</h1>
                  <p className="text-gray-600 text-sm print:text-xs">Premium Fashion • Exclusive Collections • Worldwide Delivery</p>
                  <div className="bg-black text-white py-2 px-4 inline-block mt-3 rounded print:py-1 print:px-2 print:mt-1 print:rounded-none">
                    <span className="text-lg font-bold print:text-base">ORDER INVOICE</span>
                  </div>
                </div>
                
                {/* Order & Customer Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  
                  {/* Order Information */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold text-lg mb-3 border-b border-gray-300 pb-2">ORDER INFORMATION</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Order #:</span>
                        <span>#{selectedInvoiceOrder._id.toString().slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Date:</span>
                        <span>{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span className="capitalize">{selectedInvoiceOrder.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delivery Address */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-bold text-lg mb-3 border-b border-gray-300 pb-2">DELIVERY ADDRESS</h3>
                    <div className="space-y-1">
                      <p className="font-medium">{selectedInvoiceOrder.customer.name}</p>
                      <p>{selectedInvoiceOrder.customer.phone}</p>
                      <p>{selectedInvoiceOrder.customer.email}</p>
                      <p>{selectedInvoiceOrder.customer.address.street}</p>
                      <p>{selectedInvoiceOrder.customer.address.city}, {selectedInvoiceOrder.customer.address.zipCode}</p>
                    </div>
                  </div>
                </div>
                
                {/* Items Table */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3">ORDER ITEMS</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border-2 border-black">
                      <thead>
                        <tr className="bg-black text-white">
                          <th className="border border-gray-300 p-3 text-left">Product</th>
                          <th className="border border-gray-300 p-3 text-center">Size</th>
                          <th className="border border-gray-300 p-3 text-center">Color</th>
                          <th className="border border-gray-300 p-3 text-center">Qty</th>
                          <th className="border border-gray-300 p-3 text-right">Unit Price</th>
                          <th className="border border-gray-300 p-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoiceOrder.items.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="border border-gray-300 p-3">
                              <div className="font-medium">{item.productName}</div>
                              {item.salePercentage > 0 && (
                                <div className="text-xs text-red-600">🏷️ {item.salePercentage}% OFF</div>
                              )}
                            </td>
                            <td className="border border-gray-300 p-3 text-center">{item.selectedSize}</td>
                            <td className="border border-gray-300 p-3 text-center">{item.selectedColor}</td>
                            <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                            <td className="border border-gray-300 p-3 text-right">₨{item.finalPrice.toLocaleString()}</td>
                            <td className="border border-gray-300 p-3 text-right font-medium">₨{(item.finalPrice * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Summary */}
                <div className="flex justify-end mb-6">
                  <div className="w-80 bg-gray-50 border-2 border-black p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3 text-center border-b border-gray-300 pb-2">ORDER SUMMARY</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₨{selectedInvoiceOrder.subtotalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{selectedInvoiceOrder.shippingCost === 0 ? 'FREE' : `₨${selectedInvoiceOrder.shippingCost.toLocaleString()}`}</span>
                      </div>
                      {selectedInvoiceOrder.shippingCost === 0 && (
                        <div className="text-xs text-green-600">🎉 Free shipping applied!</div>
                      )}
                      <div className="border-t-2 border-black pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>TOTAL:</span>
                          <span>₨{selectedInvoiceOrder.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* QR Code Section */}
                <div className="text-center border-t-2 border-black pt-4">
                  <h3 className="font-bold text-lg mb-3">SCAN FOR ORDER DETAILS</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Scan this QR code to view your order details on centurypk.com<br />
                    Order tracking and customer support available 24/7
                  </p>
                  {generatingQR ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                      <span className="ml-2">Generating QR code...</span>
                    </div>
                  ) : qrCodeUrl ? (
                    <div className="inline-block">
                      <Image 
                        src={qrCodeUrl} 
                        alt="Order QR Code" 
                        width={120} 
                        height={120} 
                        className="border-2 border-black rounded mx-auto"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        QR Code contains: Order #{selectedInvoiceOrder._id.toString().slice(-8).toUpperCase()} | centurypk.com
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-500">QR Code not available</div>
                  )}
                </div>
                {/* Footer */}
                <div className="text-center mt-6 pt-4 border-t border-gray-300 text-xs text-gray-600">
                  <div className="font-bold mb-2">Thank you for choosing CENTURY.PK</div>
                  <div>For support: support@centurypk.com | +92 123 456 7890 | www.centurypk.com</div>
                  <div className="mt-2 italic">This is a computer-generated invoice. No signature required.</div>
                </div>
              </div>
            </div>
            <style jsx global>{`
              @media print {
                body { background: #fff !important; }
                .print\\:hidden { display: none !important; }
                .print\\:static { position: static !important; }
                .print\\:bg-transparent { background: transparent !important; }
                .print\\:p-0 { padding: 0 !important; }
                .print\\:max-w-full { max-width: 100vw !important; }
                .print\\:rounded-none { border-radius: 0 !important; }
                .print\\:shadow-none { box-shadow: none !important; }
                .print\\:border-0 { border: 0 !important; }
                .print\\:overflow-visible { overflow: visible !important; }
                .print\\:max-h-full { max-height: 100vh !important; }
                .print\\:h-auto { height: auto !important; }
                .print\\:w-full { width: 100vw !important; }
                .print\\:relative { position: relative !important; }
                .print\\:text-xs { font-size: 12px !important; }
                .print\\:text-base { font-size: 16px !important; }
                .print\\:text-lg { font-size: 18px !important; }
                .print\\:font-semibold { font-weight: 600 !important; }
                .print\\:mb-1 { margin-bottom: 0.25rem !important; }
                .print\\:mb-2 { margin-bottom: 0.5rem !important; }
                .print\\:pb-2 { padding-bottom: 0.5rem !important; }
                .print\\:py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
                .print\\:px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
                .print\\:mt-1 { margin-top: 0.25rem !important; }
                .print\\:rounded-none { border-radius: 0 !important; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
