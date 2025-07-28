// This file ensures the loading skeleton for the product detail page
export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex justify-center items-center">
          <div className="w-80 h-80 bg-gray-200 rounded-lg" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-24 bg-gray-200 rounded w-full" />
          <div className="h-10 bg-gray-300 rounded w-1/4 mt-4" />
        </div>
      </div>
    </div>
  );
}
