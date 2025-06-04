import mongoose from 'mongoose';

const MonthlySalesSchema = new mongoose.Schema({
  // Year tracking
  year: {
    type: Number,
    required: true,
    index: true
  },
  
  // Month tracking (1-12)
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    index: true
  },
  
  // Month name for display
  monthName: {
    type: String,
    required: true
  },
  
  // Order tracking
  totalOrders: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  
  // Sales tracking
  totalSales: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, { 
  timestamps: true
});

// Compound index for unique year-month combination
MonthlySalesSchema.index({ year: 1, month: 1 }, { unique: true });

export default mongoose.models.MonthlySales || mongoose.model('MonthlySales', MonthlySalesSchema);

