export const dynamic = "force-dynamic";
import HeroSection from "../../components/HeroSection";
import ProductsClient from "./ProductsClient";
import AnimatedTextTicker from "../../components/AnimatedTextTicker";
import connectDB from '@/utils/connectDB';
import { Product } from '@/models/Product';

async function getFeaturedProducts() {
  try {
    await connectDB();
    
    // Fetch featured products directly from database
    const products = await Product.find({ isFeatured: true })
      .limit(12)
      .lean(); // Use lean() for better performance
    
    // Convert MongoDB ObjectIds to strings for JSON serialization
    const serializedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
      // Properly serialize images array
      images: product.images?.map(image => ({
        public_id: image.public_id,
        url: image.url,
        _id: image._id?.toString() || null
      })) || [],
      // Serialize any other nested objects
      sale: product.sale ? {
        percentage: product.sale.percentage,
        startDate: product.sale.startDate?.toISOString(),
        endDate: product.sale.endDate?.toISOString(),
        _id: product.sale._id?.toString()
      } : null
    }));
    
    return serializedProducts;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}
export default async function Home() {
  const products = await getFeaturedProducts();
  return (
    <div>
      <HeroSection />
      <AnimatedTextTicker />
      <ProductsClient products={products} />
    </div>
  );
}