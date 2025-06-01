import React from 'react';

const RemoveSaleInstructions = () => {
  return (
    <div className="bg-gradient-to-br from-red-50 via-white to-orange-50 border-2 border-red-100 rounded-3xl overflow-hidden shadow-lg mb-8 backdrop-blur-sm">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white drop-shadow-sm">Sale Removal Management</h2>
            <p className="text-red-100 text-sm font-medium">Efficiently remove sales from multiple products</p>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Live System</span>
          </div>
        </div>
      </div>      {/* Enhanced Content with Better Spacing */}
      <div className="p-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Enhanced Product Selection Card */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Product Selection</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 p-3 rounded-xl">
                <div className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">☑️</span>
                  <span>Select All</span>
                </div>
                <div className="text-blue-700 text-xs leading-relaxed">Use checkbox to select all products with active sales on current page</div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 p-3 rounded-xl">
                <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span>Individual Select</span>
                </div>
                <div className="text-gray-700 text-xs leading-relaxed">Click on product cards to select/deselect individually with visual feedback</div>
              </div>
            </div>
          </div>

          {/* Enhanced Sale Removal Process Card */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Sale Removal</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-3 rounded-xl">
                <div className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">🗑️</span>
                  <span>Remove Sale Button</span>
                </div>
                <div className="text-red-700 text-xs leading-relaxed">Completely removes all sale data from selected products instantly</div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 p-3 rounded-xl">
                <div className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span>Complete Removal</span>
                </div>
                <div className="text-orange-700 text-xs leading-relaxed">Sale field is set to null - no configuration needed</div>
              </div>
            </div>
          </div>

          {/* Enhanced Sale Status Info Card */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">Sale Status</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-3 rounded-xl">
                <div className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">🏷️</span>
                  <span>Active Sales</span>
                </div>
                <div className="text-green-700 text-xs leading-relaxed">Only products with current active sales are displayed</div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-green-50 border-2 border-gray-200 p-3 rounded-xl">
                <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  <span>Price Restore</span>
                </div>
                <div className="text-gray-700 text-xs leading-relaxed">Original pricing will be automatically restored</div>
              </div>
            </div>
          </div>

          {/* Enhanced System Features Card */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-800 text-lg">System Features</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 p-3 rounded-xl">
                <div className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <span>Smart Pagination</span>
                </div>
                <div className="text-purple-700 text-xs leading-relaxed">12 products per page with smooth navigation</div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 border-2 border-gray-200 p-3 rounded-xl">
                <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">🔄</span>
                  <span>Auto-Update</span>
                </div>
                <div className="text-gray-700 text-xs leading-relaxed">Products auto-removed from list after sale removal</div>
              </div>
            </div>
          </div>
        </div>        {/* Enhanced Step-by-Step Guide with Better Visual Hierarchy */}
        <div className="mt-8 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-3 border-red-200 rounded-3xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <h4 className="font-bold text-gray-800 text-2xl mb-2 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Complete Sale Removal Guide
            </h4>
            <p className="text-gray-600 text-sm">Follow these steps for efficient bulk sale removal</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-blue-200 shadow-md">
              <div className="font-bold text-blue-800 text-lg mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">1</span>
                Quick Selection Process
              </div>
              <ol className="text-gray-700 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">1</span>
                  <span>Use &ldquo;Select All&rdquo; checkbox for entire page selection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">2</span>
                  <span>Or click individual product cards for specific selection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">3</span>
                  <span>Selected cards show blue highlight and scale animation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">4</span>
                  <span>Counter displays total selected products</span>
                </li>
              </ol>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-red-200 shadow-md">
              <div className="font-bold text-red-800 text-lg mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">2</span>
                Removal Execution Process
              </div>
              <ol className="text-gray-700 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs mt-0.5">1</span>
                  <span>Select products with active sales status</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs mt-0.5">2</span>
                  <span>Click &ldquo;Remove Sale&rdquo; button with selection count</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs mt-0.5">3</span>
                  <span>Confirm removal action in popup dialog</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs mt-0.5">4</span>
                  <span>Sale status removed instantly with pricing restoration</span>
                </li>
              </ol>
            </div>
          </div>
          
          {/* Enhanced Alert Boxes with Better Design */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-4 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-amber-800 text-base mb-2">Important System Behavior</div>
                  <div className="text-amber-700 text-sm leading-relaxed">Only products with active sales are displayed in this interface. After successful sale removal, products are automatically filtered out and return to regular pricing structure.</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-emerald-800 text-base mb-2">Safety & Efficiency Features</div>
                  <div className="text-emerald-700 text-sm leading-relaxed">Confirmation dialogs prevent accidental removals. Real-time updates ensure data consistency. Batch processing handles multiple selections efficiently.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveSaleInstructions;
