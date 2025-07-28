import React from 'react';

const ApplySaleInstructions = () => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Apply Sale Guide</h2>
            <p className="text-gray-600 text-sm">Bulk sale application for products</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-5">
          {/* Product Selection */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Product Selection</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">☑️ Select All</div>
                <div className="text-gray-600 text-xs">Use checkbox to select all products on current page</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">🎯 Individual Select</div>
                <div className="text-gray-600 text-xs">Click on product cards to select/deselect individually</div>
              </div>
            </div>
          </div>

          {/* Sale Modal Process */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Sale Application</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">🏷️ Apply Sale Button</div>
                <div className="text-gray-600 text-xs">Click to open sale configuration modal</div>
              </div>
              <div className="bg-green-50 border border-green-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">📅 Date Range</div>
                <div className="text-gray-600 text-xs">Set start and end dates for sale period</div>
              </div>
            </div>
          </div>

          {/* Sale Configuration */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Sale Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">% Percentage</div>
                <div className="text-gray-600 text-xs">Enter discount percentage (1-99%)</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">⏰ Duration</div>
                <div className="text-gray-600 text-xs">Required start and end dates</div>
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
                <div className="text-gray-600 text-xs">12 products per page navigation</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">🔄 Auto-Remove</div>
                <div className="text-gray-600 text-xs">Products removed after sale applied</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
          <h4 className="font-bold text-black mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Apply Sales
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-semibold text-blue-800">Quick Selection:</div>
              <ol className="text-gray-700 space-y-1 list-decimal list-inside">
                <li>Use Select All checkbox for entire page</li>
                <li>Or click individual product cards</li>
                <li>Selected cards show visual highlight</li>
                <li>Counter shows selected count</li>
              </ol>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-green-800">Apply Sale Process:</div>
              <ol className="text-gray-700 space-y-1 list-decimal list-inside">
                <li>Select products you want to put on sale</li>
                <li>Click Apply Sale button with count</li>
                <li>Fill in sale percentage (1-99%)</li>
                <li>Set start and end dates</li>
                <li>Click Apply Sale to confirm</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white border border-blue-300 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <div className="font-semibold text-amber-800 text-sm">Important Note:</div>
                <div className="text-gray-700 text-xs">Only products without existing sales are shown. Applied products are automatically removed from this list.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplySaleInstructions;
