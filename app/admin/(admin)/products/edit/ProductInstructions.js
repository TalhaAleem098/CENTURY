import React from 'react';

const ProductInstructions = () => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Product Management Guide</h2>
            <p className="text-gray-600 text-sm">Essential tools for catalog management</p>
          </div>
        </div>
      </div>      {/* Content */}
      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-5">
          {/* Product Card Interaction */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Product Cards</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">🖼️ Image Hover</div>
                <div className="text-gray-600 text-xs">Hover over images to see alternate views</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">💰 Price Display</div>
                <div className="text-gray-600 text-xs">Product name and price shown below image</div>
              </div>
            </div>
          </div>

          {/* Edit & Delete Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Edit & Delete</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">✏️ Edit Modal</div>
                <div className="text-gray-600 text-xs">Click Edit Product button to open modal</div>
              </div>
              <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">🗑️ Quick Delete</div>
                <div className="text-gray-600 text-xs">Hover card → red trash icon (top-right)</div>
              </div>
            </div>
          </div>

          {/* Modal Workflow */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Modal Process</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">📝 Edit Form</div>
                <div className="text-gray-600 text-xs">Modify product details in popup form</div>
              </div>
              <div className="bg-green-50 border border-green-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">💾 Auto Update</div>
                <div className="text-gray-600 text-xs">Changes save instantly with cache refresh</div>
              </div>
            </div>
          </div>

          {/* System Features */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Features</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">📄 Pagination</div>
                <div className="text-gray-600 text-xs">12 products/page with caching</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">🔔 Notifications</div>
                <div className="text-gray-600 text-xs">Toast alerts for actions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Instructions */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
          <h4 className="font-bold text-black mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Step-by-Step Guide
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-semibold text-blue-800">To Edit a Product:</div>
              <ol className="text-gray-700 space-y-1 list-decimal list-inside">
                <li>Locate the product card</li>
                <li>Click Edit Product button (bottom)</li>
                <li>Modal opens with editable fields</li>
                <li>Make changes and save</li>
                <li>Card updates automatically</li>
              </ol>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-red-800">To Delete a Product:</div>
              <ol className="text-gray-700 space-y-1 list-decimal list-inside">
                <li>Hover over the product card</li>
                <li>Red trash icon appears (top-right)</li>
                <li>Click the trash icon</li>
                <li>Product deletes immediately</li>
                <li>Card fades out and removes</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInstructions;
