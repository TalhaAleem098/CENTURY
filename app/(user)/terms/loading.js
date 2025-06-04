export default function TermsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
          
          {/* Content skeleton */}
          <div className="space-y-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
