import React from 'react';

const ContactInstructions = () => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-5a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2h8a2 2 0 002-2v-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Contact Management Guide</h2>
            <p className="text-gray-600 text-sm">Manage customer inquiries and contact applications</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid lg:grid-cols-4 gap-5">
          {/* Viewing Applications */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-7 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Viewing Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">💬 Message Preview</div>
                <div className="text-gray-600 text-xs">Click on any blue message text to view full details</div>
              </div>
              <div className="bg-green-50 border border-green-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">📋 Full Details</div>
                <div className="text-gray-600 text-xs">Modal shows complete application information</div>
              </div>
            </div>
          </div>

          {/* Selection & Management */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Selection Tools</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">☑️ Select All</div>
                <div className="text-gray-600 text-xs">Checkbox to select all applications on current page</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">🎯 Individual Select</div>
                <div className="text-gray-600 text-xs">Click checkboxes to select specific applications</div>
              </div>
            </div>
          </div>

          {/* Deletion & Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Delete Actions</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">🗑️ Single Delete</div>
                <div className="text-gray-600 text-xs">Delete button on each application row</div>
              </div>
              <div className="bg-red-50 border border-red-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">📦 Bulk Delete</div>
                <div className="text-gray-600 text-xs">Delete multiple selected applications at once</div>
              </div>
            </div>
          </div>

          {/* Navigation & Layout */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-bold text-black">Navigation</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">📄 Pagination</div>
                <div className="text-gray-600 text-xs">8 applications per page with controls</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-lg">
                <div className="font-semibold text-black mb-1">📱 Responsive</div>
                <div className="text-gray-600 text-xs">Compact layout adapts to screen size</div>
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
            How to Manage Contact Applications
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-semibold text-blue-800">Viewing Applications:</div>
              <ol className="text-gray-700 space-y-1 list-decimal list-inside">
                <li>Browse applications in the compact list view</li>
                <li>Click on blue message text to view full details</li>
                <li>Modal opens with complete application info</li>
                <li>Close modal to return to list view</li>
              </ol>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-green-800">Managing Applications:</div>
              <ol className="text-gray-700 space-y-1 list-decimal list-inside">
                <li>Use checkboxes to select applications</li>
                <li>Delete individual applications with Delete button</li>
                <li>Bulk delete with &quot;Delete Selected&quot; button</li>
                <li>Navigate pages to see more applications</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white border border-blue-300 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <div className="font-semibold text-amber-800 text-sm">Application Details Include:</div>
                <div className="text-gray-700 text-xs">Customer name, email, subject, full message, and submission timestamp for complete context.</div>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-white border border-green-300 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="font-semibold text-green-800 text-sm">Safety Features:</div>
                <div className="text-gray-700 text-xs">Confirmation prompts before deletion to prevent accidental removal of important customer inquiries.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInstructions;
