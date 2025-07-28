import dbConnect from '@/utils/connectDB';
import Product from '@/models/Product.base';
import TShirt from '@/models/TShirt';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get('ids');
  if (!idsParam) {
    return Response.json({ error: 'No product ids provided' }, { status: 400 });
  }
  const ids = idsParam.split(',').map(id => id.trim()).filter(Boolean);
  if (!Array.isArray(ids) || ids.length === 0) {
    return Response.json({ error: 'No product ids provided' }, { status: 400 });
  }

  // Fetch products by ids
  const products = await Product.find({ _id: { $in: ids } }).lean();

  // If any are TShirts, fetch their sizes/dimensions
  const result = await Promise.all(products.map(async (prod) => {
    if (prod.category === 'TShirt') {
      const tshirt = await TShirt.findById(prod._id).lean();
      return { ...prod, sizes: tshirt?.sizes, dimensions: tshirt?.dimensions };
    }
    return prod;
  }));

  return Response.json({ products: result });
}
