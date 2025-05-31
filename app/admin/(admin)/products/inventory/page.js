'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

export default function InventoryPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [error, setError] = useState(null)
  const [cachedPages, setCachedPages] = useState({}) // For caching pages
  
  const limit = 12
  const totalPages = Math.ceil(totalProducts / limit)
  const fetchProducts = async (page = 1) => {
    // Check if page is cached
    if (cachedPages[page]) {
      setProducts(cachedPages[page].products)
      setTotalProducts(cachedPages[page].total)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const skip = (page - 1) * limit
      const response = await fetch(`/api/products/inventory?limit=${limit}&skip=${skip}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      setProducts(data.products || [])
      setTotalProducts(data.total || 0)
      setError(null)
      
      // Cache the data
      setCachedPages(prev => ({
        ...prev,
        [page]: {
          products: data.products || [],
          total: data.total || 0
        }
      }))
    } catch (err) {
      setError(err.message)
      setProducts([])
    } finally {
      setLoading(false)    }
  }

  useEffect(() => {
    fetchProducts(currentPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const getStockStatus = (stock, sold) => {
    const remainingStock = stock || 0
    const totalSold = sold || 0
    const totalQuantity = remainingStock + totalSold
    
    // If no stock remaining
    if (remainingStock === 0) {
      return { 
        status: 'Out of Stock', 
        color: 'bg-red-500', 
        textColor: 'text-red-500',
        percentage: 0,
        totalQuantity,
        remainingStock,
        totalSold
      }
    }
    
    // Calculate stock percentage
    const stockPercentage = totalQuantity > 0 ? (remainingStock / totalQuantity) : 0
    
    // If stock is less than 20% of total quantity
    if (stockPercentage < 0.2) {
      return { 
        status: 'Low Stock', 
        color: 'bg-yellow-500', 
        textColor: 'text-yellow-500',
        percentage: stockPercentage * 100,
        totalQuantity,
        remainingStock,
        totalSold
      }
    }
    
    return { 
      status: 'In Stock', 
      color: 'bg-green-500', 
      textColor: 'text-green-500',
      percentage: stockPercentage * 100,
      totalQuantity,
      remainingStock,
      totalSold
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 mx-1 rounded-lg transition-all duration-200 ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
        }`}
      >
        ←
      </button>
    )

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-lg transition-all duration-200 ${
            i === currentPage
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50 shadow-md hover:shadow-lg'
          }`}
        >
          {i}
        </button>
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 mx-1 rounded-lg transition-all duration-200 ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
        }`}
      >
        →
      </button>
    )

    return pages
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Inventory</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(currentPage)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Inventory</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>Total Products: {totalProducts}</span>
            <span>•</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>            {/* Professional Instructions Panel */}
          <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border border-slate-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Inventory Management System</h2>
                  <p className="text-blue-100 text-sm">Complete guide to product inventory tracking</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Stock Status Guide */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800">Stock Status Indicators</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-red-50 border border-red-100">
                      <span className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0 shadow-sm"></span>
                      <div className="flex-1">
                        <div className="font-medium text-red-800 text-sm">Critical - Out of Stock</div>
                        <div className="text-red-600 text-xs">0 items remaining</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-amber-50 border border-amber-100">
                      <span className="w-4 h-4 bg-amber-500 rounded-full flex-shrink-0 shadow-sm"></span>
                      <div className="flex-1">
                        <div className="font-medium text-amber-800 text-sm">Warning - Low Stock</div>
                        <div className="text-amber-600 text-xs">Less than 20% remaining</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                      <span className="w-4 h-4 bg-emerald-500 rounded-full flex-shrink-0 shadow-sm"></span>
                      <div className="flex-1">
                        <div className="font-medium text-emerald-800 text-sm">Healthy - In Stock</div>
                        <div className="text-emerald-600 text-xs">20% or more available</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Information Guide */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V2a1 1 0 011-1h2a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2a1 1 0 011-1V2" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800">Product Card Details</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-slate-700">Stock Counter</div>
                        <div className="text-slate-500 text-xs">Shows remaining/total quantity ratio</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-slate-700">Progress Indicator</div>
                        <div className="text-slate-500 text-xs">Visual stock percentage representation</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-slate-700">Sales Analytics</div>
                        <div className="text-slate-500 text-xs">Total items sold and performance</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-slate-700">Smart Caching</div>
                        <div className="text-slate-500 text-xs">Optimized loading for better performance</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Guide */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-slate-800">Performance Features</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100">
                      <div className="font-medium text-indigo-800 mb-1">⚡ Smart Pagination</div>
                      <div className="text-indigo-600 text-xs">Navigate through pages with intelligent caching</div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-100">
                      <div className="font-medium text-emerald-800 mb-1">📊 Real-time Updates</div>
                      <div className="text-emerald-600 text-xs">Live inventory tracking and status monitoring</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-100">
                      <div className="font-medium text-amber-800 mb-1">🔍 Visual Analytics</div>
                      <div className="text-amber-600 text-xs">Comprehensive stock insights at a glance</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Statistics Bar */}
              <div className="mt-6 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-700 font-medium text-sm">System Status:</span>
                    <span className="text-emerald-600 font-semibold text-sm">All systems operational</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="mt-4 text-center text-gray-600">Loading inventory...</div>
            </div>
          </div>
        )}        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
              {products.map((product) => {
                const stockInfo = getStockStatus(product.stock, product.sold)
                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 group relative"
                  >
                    {/* Stock Status Corner Badge */}
                    <div className="absolute top-0 right-0 z-10">
                      <div className={`${stockInfo.color} text-white text-xs px-2 py-1 rounded-bl-lg font-medium`}>
                        {stockInfo.status === 'Out of Stock' ? 'OUT' : 
                         stockInfo.status === 'Low Stock' ? 'LOW' : 'OK'}
                      </div>
                    </div>

                    {/* Product Image - Natural aspect ratio */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden aspect-[3/4]">                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0].url || product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-gray-400 text-3xl sm:text-4xl">📦</div>
                        </div>
                      )}
                      
                      {/* Overlay gradient for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>                    {/* Product Details */}
                    <div className="p-3 md:p-4">
                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-tight" title={product.name}>
                        {product.name}
                      </h3>
                      
                      {/* Stock Info Row */}
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-lg sm:text-xl font-bold ${stockInfo.textColor}`}>
                            {stockInfo.remainingStock}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm">/{stockInfo.totalQuantity}</span>
                        </div>
                        <div className={`text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md ${
                          stockInfo.status === 'Out of Stock' ? 'bg-red-100 text-red-700' :
                          stockInfo.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {Math.round(stockInfo.percentage)}%
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2 sm:mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ease-out ${stockInfo.color} relative`}
                            style={{
                              width: `${Math.min(100, Math.max(3, stockInfo.percentage))}%`
                            }}
                          >
                            <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Stats */}
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-xs">{stockInfo.remainingStock} left</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-xs">{stockInfo.totalSold} sold</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center bg-white rounded-xl shadow-lg p-2">
                  {renderPagination()}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h2>
            <p className="text-gray-500">There are no products in your inventory yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
