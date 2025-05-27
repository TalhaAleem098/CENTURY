

import HeroSection from '../../components/HeroSection';
import ProductGrid from '../../components/ProductGrid';

async function fetchFeaturedProducts() {
  if (process.env.NODE_ENV === 'production' || !process.env.NEXT_PUBLIC_BASE_URL) {
    return getMockProducts();
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products?limit=8`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products:', response.status);
      return getMockProducts();
    }
    
    const data = await response.json();
    return data.products && data.products.length > 0 ? data.products : getMockProducts();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return getMockProducts();
  }
}
function getMockProducts() {
  return [
    {
      _id: '1',
      name: 'Oversized Winter Hoodie',
      price: 59.99,
      images: ['/assets/carousel-1.webp', '/assets/carousel-2.webp'],
      description: 'Cozy oversized hoodie perfect for winter days',
      category: 'Hoodies',
      sale: { percentage: 25 }
    },
    {
      _id: '2', 
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      images: ['/assets/carousel-2.webp', '/assets/carousel-1.webp'],
      description: 'High-quality cotton t-shirt with perfect fit',
      category: 'T-Shirts'
    },
    {
      _id: '3',
      name: 'Vintage Sweatshirt',
      price: 49.99,
      images: ['/assets/carousel-1.webp', '/assets/carousel-2.webp'],
      description: 'Vintage-style sweatshirt with retro design',
      category: 'Sweatshirts',
      sale: { percentage: 15 }
    },
    {
      _id: '4',
      name: 'Essential Blank Tee',
      price: 24.99,
      image: '/assets/carousel-2.webp',
      description: 'Essential blank tee for everyday wear',
      category: 'T-Shirts'
    },
    {
      _id: '5',
      name: 'Foxy Fit Tee',
      price: 34.99,
      images: ['/assets/carousel-1.webp', '/assets/carousel-2.webp'],
      description: 'Perfectly fitted tee with modern cut',
      category: 'T-Shirts',
      sale: { percentage: 20 }
    },
    {
      _id: '6',
      name: 'Cozy Winter Sweatshirt',
      price: 54.99,
      image: '/assets/carousel-2.webp',
      description: 'Warm and comfortable winter sweatshirt',
      category: 'Sweatshirts'
    }
  ];
}

export const metadata = {
  title: 'Winter Sale Collection - Premium Fashion Store',
  description: 'Discover our exclusive winter collection featuring oversized tees, hoodies, and sweatshirts. Up to 50% off on premium clothing. Shop now for the best deals!',
  keywords: 'winter clothing, oversized tees, hoodies, sweatshirts, fashion sale, premium apparel, winter collection',
  openGraph: {
    title: 'Winter Sale Collection - Premium Fashion Store',
    description: 'Up to 50% off on premium winter clothing. Discover oversized tees, hoodies, and more!',
    type: 'website',
    images: [
      {
        url: '/assets/carousel-1.webp',
        width: 1200,
        height: 630,
        alt: 'Winter Sale Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winter Sale Collection - Premium Fashion Store',
    description: 'Up to 50% off on premium winter clothing. Discover oversized tees, hoodies, and more!',
    images: ['/assets/carousel-1.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function Home() {
  const featuredProducts = await fetchFeaturedProducts();
  
  return (
    <div>
      <HeroSection />
      <ProductGrid 
        products={featuredProducts} 
        title="Featured Products" 
        showTitle={true}
        isHomePage={true}
      />
    </div>
  );
}
