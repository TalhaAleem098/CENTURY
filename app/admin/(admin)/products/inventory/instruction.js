import React from "react";

const instruction = () => {
  return (
    <div>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border border-slate-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r bg-black px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Inventory Management System
              </h2>
              <p className="text-blue-100 text-sm">
                Complete guide to product inventory tracking
              </p>
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
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">
                  Stock Status Indicators
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-red-50 border border-red-100">
                  <span className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0 shadow-sm"></span>
                  <div className="flex-1">
                    <div className="font-medium text-red-800 text-sm">
                      Critical - Out of Stock
                    </div>
                    <div className="text-red-600 text-xs">
                      0 items remaining
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-amber-50 border border-amber-100">
                  <span className="w-4 h-4 bg-amber-500 rounded-full flex-shrink-0 shadow-sm"></span>
                  <div className="flex-1">
                    <div className="font-medium text-amber-800 text-sm">
                      Warning - Low Stock
                    </div>
                    <div className="text-amber-600 text-xs">
                      Less than 20% remaining
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="w-4 h-4 bg-emerald-500 rounded-full flex-shrink-0 shadow-sm"></span>
                  <div className="flex-1">
                    <div className="font-medium text-emerald-800 text-sm">
                      Healthy - In Stock
                    </div>
                    <div className="text-emerald-600 text-xs">
                      20% or more available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Information Guide */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V2a1 1 0 011-1h2a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2a1 1 0 011-1V2"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">
                  Product Card Details
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-slate-700">
                      Stock Counter
                    </div>
                    <div className="text-slate-500 text-xs">
                      Shows remaining/total quantity ratio
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-slate-700">
                      Progress Indicator
                    </div>
                    <div className="text-slate-500 text-xs">
                      Visual stock percentage representation
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-slate-700">
                      Sales Analytics
                    </div>
                    <div className="text-slate-500 text-xs">
                      Total items sold and performance
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-slate-700">
                      Smart Caching
                    </div>
                    <div className="text-slate-500 text-xs">
                      Optimized loading for better performance
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Guide */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">
                  Performance Features
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100">
                  <div className="font-medium text-indigo-800 mb-1">
                    ⚡ Smart Pagination
                  </div>
                  <div className="text-indigo-600 text-xs">
                    Navigate through pages with intelligent caching
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-100">
                  <div className="font-medium text-emerald-800 mb-1">
                    📊 Real-time Updates
                  </div>
                  <div className="text-emerald-600 text-xs">
                    Live inventory tracking and status monitoring
                  </div>
                </div>
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-100">
                  <div className="font-medium text-amber-800 mb-1">
                    🔍 Visual Analytics
                  </div>
                  <div className="text-amber-600 text-xs">
                    Comprehensive stock insights at a glance
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Statistics Bar */}
          <div className="mt-6 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-slate-700 font-medium text-sm">
                  System Status:
                </span>
                <span className="text-emerald-600 font-semibold text-sm">
                  All systems operational
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default instruction;
