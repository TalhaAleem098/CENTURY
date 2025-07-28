import mongoose from 'mongoose';

const SaleRecordSchema = new mongoose.Schema({
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: false },
  percentage: { type: Number, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SaleRecord = mongoose.models.SaleRecord || mongoose.model('SaleRecord', SaleRecordSchema);

export default SaleRecord;
