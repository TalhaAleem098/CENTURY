'use client'
import React, { useState, useEffect } from 'react'

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
    } catch (err) {
      setError(err.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage)
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Inventory</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Total Products: {totalProducts}</span>
            <span>•</span>
            <span>Page {currentPage} of {totalPages}</span>
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
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {products.map((product) => {
                const stockInfo = getStockStatus(product.stock, product.sold)
                return (                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
                  >{/* Product Image */}
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url || product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="text-gray-400 text-3xl">📦</div>
                        </div>
                      )}                      
                      {/* Stock Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`${stockInfo.color} text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm`}>
                          {stockInfo.status}
                        </span>
                      </div>
                    </div>                    {/* Product Info */}
                    <div className="p-2">
                      <h3 className="font-semibold text-gray-800 text-xs mb-2 truncate" title={product.name}>
                        {product.name}
                      </h3>
                      
                      {/* Prominent Stock Display */}
                      <div className="bg-gray-50 rounded-md p-2 mb-2">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${stockInfo.textColor} mb-1`}>
                            {stockInfo.remainingStock}/{stockInfo.totalQuantity}
                          </div>
                          <div className="text-xs text-gray-600">Remaining/Total</div>
                        </div>
                      </div>
                      
                      {/* Stock Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${stockInfo.color}`}
                          style={{
                            width: `${Math.min(100, stockInfo.percentage)}%`
                          }}
                        ></div>
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
