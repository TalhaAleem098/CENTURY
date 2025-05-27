import Link from 'next/link';
import ProductCard from '../../../components/ProductCard';

export const metadata = {
  title: 'Shop All - Centuary Fashion Store',
  description: 'Browse our complete collection of premium clothing items. Find everything from oversized tees to hoodies.',
  keywords: 'shop all, clothing store, fashion, oversized tees, hoodies, sweatshirts, winter collection',
};

async function fetchAllProducts(page = 1, limit = 12) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/products?page=${page}&limit=${limit}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0, page: 1, totalPages: 0 };
  }
}

const categories = [
  {
    name: 'Oversized Tees',
    href: '/category?type=oversized-tees',
    image: '/assets/carousel-1.webp',
    description: 'Comfortable oversized t-shirts'
  },
  {
    name: 'Cropped Tees',
    href: '/category?type=cropped-tees',
    image: '/assets/carousel-2.webp',
    description: 'Trendy cropped t-shirts'
  },
  {
    name: 'CORE Blanks',
    href: '/category?type=core-blanks',
    image: '/assets/carousel-1.webp',
    description: 'Essential blank tees'
  },
  {
    name: 'Foxy Fit Tees',
    href: '/category?type=foxy-fit-tees',
    image: '/assets/carousel-2.webp',
    description: 'Perfectly fitted tees'
  },
  {
    name: 'Oversized Hoodies',
    href: '/category?type=oversized-hoodies',
    image: '/assets/carousel-1.webp',
    description: 'Cozy oversized hoodies'
  },
  {
    name: 'Oversized Sweatshirts',
    href: '/category?type=oversized-sweatshirts',
    image: '/assets/carousel-2.webp',
    description: 'Comfortable sweatshirts'
  }
];

export default async function ShopPage({ searchParams }) {
  const { page = '1' } =await searchParams;
  const { products, total, totalPages } = await fetchAllProducts(parseInt(page));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Shop All Products
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover our complete collection of premium clothing items
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="aspect-square relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm md:text-base opacity-90">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Products Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              All Products ({total})
            </h2>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Best Selling</option>
              </select>
              <div className="flex items-center space-x-2">
                <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <>
            {/* Products Grid */}            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                {parseInt(page) > 1 && (
                  <Link
                    href={`/shop?page=${parseInt(page) - 1}`}
                    className="px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, parseInt(page) - 2) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <Link
                      key={pageNum}
                      href={`/shop?page=${pageNum}`}
                      className={`px-4 py-2 rounded-md ${
                        pageNum === parseInt(page)
                          ? 'bg-black text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
                
                {parseInt(page) < totalPages && (
                  <Link
                    href={`/shop?page=${parseInt(page) + 1}`}
                    className="px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-12 0H4m4-8v8m8-8v8" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600 mb-6">We&apos;re working on adding new products to our store.</p>
            <Link
              href="/"
              className="inline-block bg-black hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
