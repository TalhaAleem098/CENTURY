import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '../../../components/ProductCard';

export const metadata = {
  title: 'Category - century Fashion Store',
  description: 'Browse our premium collection of clothing items by category.',
};

async function fetchProductsByCategory(type, page = 1) {
  try {
    // This would fetch from your API in a real implementation
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://centurypk.com'}/api/products?category=${type}&page=${page}`, {
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

function getCategoryInfo(type) {
  const categories = {
    'oversized-tees': {
      title: 'Oversized Tees',
      description: 'Comfortable and stylish oversized t-shirts for a relaxed fit.',
      image: '/assets/carousel-1.webp'
    },
    'cropped-tees': {
      title: 'Cropped Tees',
      description: 'Trendy cropped t-shirts perfect for casual styling.',
      image: '/assets/carousel-2.webp'
    },
    'core-blanks': {
      title: 'CORE Blanks',
      description: 'Essential blank tees for customization or everyday wear.',
      image: '/assets/carousel-1.webp'
    },
    'foxy-fit-tees': {
      title: 'Foxy Fit Tees',
      description: 'Perfectly fitted tees with a flattering silhouette.',
      image: '/assets/carousel-2.webp'
    },
    'oversized-hoodies': {
      title: 'Oversized Hoodies',
      description: 'Cozy oversized hoodies for ultimate comfort.',
      image: '/assets/carousel-1.webp'
    },
    'oversized-sweatshirts': {
      title: 'Oversized Sweatshirts',
      description: 'Comfortable oversized sweatshirts for cold weather.',
      image: '/assets/carousel-2.webp'
    }
  };
  
  return categories[type] || null;
}

export default async function CategoryPage({ searchParams }) {
  const { type, page = '1' } = await searchParams;
  
  if (!type) {
    notFound();
  }
  
  const categoryInfo = getCategoryInfo(type);
  
  if (!categoryInfo) {
    notFound();
  }
  
  const { products, total, totalPages } = await fetchProductsByCategory(type, parseInt(page));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Hero Section */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${categoryInfo.image})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {categoryInfo.title}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Products ({total})
            </h2>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {products.length > 0 ? (
          <>            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/category?type=${type}&page=${pageNum}`}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                      pageNum === parseInt(page)
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">We&apos;re working on adding products to this category.</p>            <Link
              href="/shop"
              className="inline-block bg-black hover:bg-black text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


