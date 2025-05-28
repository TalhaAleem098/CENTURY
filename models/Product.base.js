import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  start: { type: Date },
  end: { type: Date },
  percentage: { type: Number },
  description: { type: String },
}, { _id: false });

const options = {
  discriminatorKey: 'category',
  timestamps: true,
};

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, },
  brand: { type: String },
  price: { type: Number, required: true },
  description: { type: String },
  images: [{
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  }],
  stock: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  sale: SaleSchema,
}, options);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
