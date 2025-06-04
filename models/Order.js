import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  selectedSize: {
    type: String,
    required: true,
    enum: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', '2xl', '3xl'],
    lowercase: true
  },
  selectedColor: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  salePercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  material: {
    type: String,
    required: true,
    trim: true
  },
  productImage: {
    type: String,
    trim: true
  }
});

const ShippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'Pakistan'
  }
});

const PaymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['cash_on_delivery', 'credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'],
    default: 'cash_on_delivery'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    trim: true
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentDate: {
    type: Date
  }
});

const OrderStatusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const OrderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Customer Information
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  
  // Order Items (from your data)
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must have at least one item'
    }
  },
  
  // Order Totals (from your data)
  totalItems: {
    type: Number,
    required: true,
    min: 1
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Order Date (from your data)
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Order Status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  
  // Status History
  statusHistory: {
    type: [OrderStatusHistorySchema],
    default: function() {
      return [{
        status: this.status || 'pending',
        timestamp: new Date()
      }];
    }
  },
  
  // Shipping Information
  shippingAddress: {
    type: ShippingAddressSchema,
    required: true
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'pickup'],
    default: 'standard'
  },
  estimatedDeliveryDate: {
    type: Date
  },
  actualDeliveryDate: {
    type: Date
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  
  // Payment Information
  paymentInfo: {
    type: PaymentInfoSchema,
    required: true
  },
  
  // Coupon/Discount Information
  couponCode: {
    type: String,
    trim: true
  },
  couponDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Additional Information
  notes: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  },
  
  // Flags
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: {
    type: String,
    trim: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  // Refund Information
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'processed', 'rejected'],
    default: 'none'
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  refundReason: {
    type: String,
    trim: true
  },
  refundDate: {
    type: Date
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ 'items.productId': 1 });
OrderSchema.index({ createdAt: -1 });

// Virtual for total savings
OrderSchema.virtual('totalSavings').get(function() {
  return this.items.reduce((total, item) => {
    const savings = (item.originalPrice - item.finalPrice) * item.quantity;
    return total + savings;
  }, 0);
});

// Virtual for order age
OrderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const orderDate = this.orderDate || this.createdAt;
  const diffTime = Math.abs(now - orderDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware to update the updatedAt field
OrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to generate order number if not provided
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const orderNum = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
    this.orderNumber = orderNum;
  }
  next();
});

// Method to update order status
OrderSchema.methods.updateStatus = function(newStatus, updatedBy = null, notes = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    updatedBy: updatedBy,
    notes: notes,
    timestamp: new Date()
  });
  return this.save();
};

// Method to calculate totals
OrderSchema.methods.calculateTotals = function() {
  this.totalItems = this.items.length;
  this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.subtotalAmount = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.totalAmount = this.subtotalAmount + this.shippingCost + this.taxAmount - this.discountAmount - this.couponDiscount;
  return this;
};

// Static method to find orders by status
OrderSchema.statics.findByStatus = function(status) {
  return this.find({ status: status }).populate('customerId', 'name email').sort({ createdAt: -1 });
};

// Static method to find recent orders
OrderSchema.statics.findRecent = function(limit = 10) {
  return this.find().populate('customerId', 'name email').sort({ createdAt: -1 }).limit(limit);
};

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
