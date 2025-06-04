import mongoose from 'mongoose';

const MonthlySalesSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    unique: true, // e.g. "2024-06"
  },
  monthName: {
    type: String,
    required: true, // e.g. "June 2024"
  },
  year: {
    type: Number,
    required: true, // e.g. 2024
  },
  totalOrders: {
    type: Number,
    required: true,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    required: true,
    default: 0,
  },
  totalCustomers: {
    type: Number,
    required: true,
    default: 0,
  },
  refunds: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.MonthlySales || mongoose.model('MonthlySales', MonthlySalesSchema);

