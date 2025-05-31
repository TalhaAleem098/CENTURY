import React from "react";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">📧 Product Email Notifications</h1>          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Send exciting updates about new products, sales, and special offers directly to your customers&apos; inboxes
          </p>
        </div>

        {/* Restriction Notice */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13-9.5a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>            <p className="text-gray-600 mb-6">
              This feature enables you to send product update emails, sale announcements, and marketing campaigns to your customer subscriber list. It requires a premium Google Workspace business email address to access advanced mailing capabilities.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Current Status:</strong> You are using a standard email account. Upgrade to Google Workspace to unlock this feature.
              </p>
            </div>
          </div>
        </div>

        {/* What You Can Send */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            📢 Product Email Campaigns You Can Send
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-2">🆕 New Product Launches</h4>
              <p className="text-gray-600 text-sm">Announce exciting new products to your customer base</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-2">🏷️ Sales & Promotions</h4>
              <p className="text-gray-600 text-sm">Share special discounts and limited-time offers</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-2">📦 Restock Notifications</h4>
              <p className="text-gray-600 text-sm">Alert customers when popular items are back in stock</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-2">🎉 Seasonal Campaigns</h4>
              <p className="text-gray-600 text-sm">Holiday and seasonal product recommendations</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-2">⭐ Customer Favorites</h4>
              <p className="text-gray-600 text-sm">Highlight trending and bestselling products</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-purple-700 mb-2">🎁 Exclusive Previews</h4>
              <p className="text-gray-600 text-sm">Give subscribers early access to new collections</p>
            </div>
          </div>
        </div>

        {/* Google Workspace Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-6 h-6 mr-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            Google Workspace Premium Business Email
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">✨ Premium Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Professional email with your domain (@yourcompany.com)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Advanced Gmail features and security
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Google Drive with increased storage (30GB - 5TB)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Google Meet with longer meetings (up to 24 hours)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Calendar scheduling and room booking
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Enhanced admin controls and user management
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  24/7 customer support
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">💼 Business Benefits</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Professional brand image with custom email domain
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Advanced spam and phishing protection
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Seamless integration with business tools
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Collaboration tools for teams
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Mobile device management
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Data loss prevention and compliance tools
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">💳 Google Workspace Plans</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Business Starter */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h4 className="font-semibold text-gray-800 mb-2">Business Starter</h4>
              <div className="text-2xl font-bold text-blue-600 mb-3">$6 <span className="text-sm text-gray-500">per user/month</span></div>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✓ Custom business email</li>
                <li>✓ 30GB cloud storage per user</li>
                <li>✓ Standard security and management controls</li>
                <li>✓ Customer support</li>
              </ul>
            </div>

            {/* Business Standard */}
            <div className="border-2 border-blue-500 rounded-lg p-4 relative bg-blue-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                Most Popular
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Business Standard</h4>
              <div className="text-2xl font-bold text-blue-600 mb-3">$12 <span className="text-sm text-gray-500">per user/month</span></div>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✓ Everything in Business Starter</li>
                <li>✓ 2TB cloud storage per user</li>
                <li>✓ Enhanced security and admin controls</li>
                <li>✓ Meet recordings saved to Drive</li>
              </ul>
            </div>

            {/* Business Plus */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h4 className="font-semibold text-gray-800 mb-2">Business Plus</h4>
              <div className="text-2xl font-bold text-blue-600 mb-3">$18 <span className="text-sm text-gray-500">per user/month</span></div>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✓ Everything in Business Standard</li>
                <li>✓ 5TB cloud storage per user</li>
                <li>✓ Advanced security and compliance</li>
                <li>✓ Enhanced Google Meet features</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Get Started */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🚀 How to Get Started</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Visit Google Workspace</h4>
                <p className="text-gray-600 text-sm">Go to <a href="https://workspace.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">workspace.google.com</a> to explore plans and pricing</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Choose Your Plan</h4>
                <p className="text-gray-600 text-sm">Select the Business plan that best fits your needs and budget</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Setup Your Domain</h4>
                <p className="text-gray-600 text-sm">Configure your custom business domain for professional email addresses</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Configure Mail Settings</h4>
                <p className="text-gray-600 text-sm">Update your admin panel with the new Google Workspace email credentials</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              <strong>Free Trial Available:</strong> Google Workspace offers a 14-day free trial for new customers. 
              No credit card required to start your trial.
            </p>
          </div>

          <div className="mt-4 text-center">
            <a 
              href="https://workspace.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started with Google Workspace
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
