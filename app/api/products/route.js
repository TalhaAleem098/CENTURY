import connectDB from '@/utils/connectDB';
import { Product, TShirt } from '@/models/Product';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments()
  ]);

  return Response.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit)
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
  console.log('Created product:', product);

  // Return both the received data and the created product
  return Response.json({
    received: data,
    created: product
  });
}
