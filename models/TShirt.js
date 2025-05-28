import mongoose from 'mongoose';
import Product from './Product.base.js';

const TShirtSchema = new mongoose.Schema({
  sizes: [{ type: String, required: true }],
  color: { type: String },
  material: { type: String },
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'] },
  // Map of size to dimensions
  dimensions: {
    type: Map,
    of: new mongoose.Schema({
      height: { type: Number },
      width: { type: Number }
    }, { _id: false }),
    default: {}
  },
}, { _id: false });

const TShirt = Product.discriminators?.TShirt || Product.discriminator('TShirt', TShirtSchema);

export default TShirt;
