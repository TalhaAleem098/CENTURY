export default function FAQLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>

        {/* Search and Filter skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="sm:w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* FAQ Content skeleton */}
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
              <div className="divide-y divide-gray-200">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="px-6 py-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact section skeleton */}
        <div className="mt-12 bg-gray-900 rounded-lg p-8 text-center">
          <div className="h-6 bg-gray-700 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded w-2/3 mx-auto mb-6 animate-pulse"></div>
          <div className="h-10 bg-gray-600 rounded w-32 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
