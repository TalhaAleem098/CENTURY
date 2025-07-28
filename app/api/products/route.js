import connectDB from '@/utils/connectDB';
import { Product, TShirt } from '@/models/Product';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const featured = searchParams.get('featured');
  const skip = (page - 1) * limit;

  // Build query based on featured parameter
  const query = featured === 'true' ? { isFeatured: true } : {};

  const [products, total] = await Promise.all([
    Product.find(query).skip(skip).limit(limit),
    Product.countDocuments(query)
  ]);

  return Response.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const { category, ...rest } = data;
  let product;

  if (category === 'TShirt') {
    product = await TShirt.create({ ...rest, category });
  } else if (category && Product.discriminators && Product.discriminators[category]) {
    product = await Product.discriminators[category].create({ ...rest, category });
  } else if (category) {
    product = await Product.create({ ...rest, category });
  } else {
    product = await Product.create(rest);
  }

  // Log the received and created product to the console for debugging
  // console.log('Created product:', product);

  // Return both the received data and the created product
  return Response.json({
    received: data,
    created: product
  });
}
