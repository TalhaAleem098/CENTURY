import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // Customer Information with nested address
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      paymentMethod: {
        type: String,
        required: true,
        default: "COD",
        enum: ["Online", "COD"],
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        zipCode: {
          type: String,
          required: true,
          trim: true,
        },
      },
    }, // Order Items Array - embedded directly in schema
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          productName: {
            type: String,
            required: true,
            trim: true,
          },
          selectedSize: {
            type: String,
            required: true,
            lowercase: true,
          },
          selectedColor: {
            type: String,
            required: true,
            trim: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
          },
          originalPrice: {
            type: Number,
            required: true,
            min: 0,
          },
          salePercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
          },
          finalPrice: {
            type: Number,
            required: true,
            min: 0,
          },
          totalPrice: {
            type: Number,
            required: true,
            min: 0,
          },
          category: {
            type: String,
            required: true,
            trim: true,
          },
          brand: {
            type: String,
            required: true,
            trim: true,
          },
          material: {
            type: String,
            required: true,
            trim: true,
          },
          productImage: {
            type: String,
            trim: true,
            default: "",
          },
        },
      ],
      required: true,
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "Order must have at least one item",
      },
    },

    // Order Totals
    totalItems: {
      type: Number,
      required: true,
      min: 1,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order Date
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Order Status
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Additional Information
    notes: {
      type: String,
      trim: true,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
OrderSchema.index({ "customer.email": 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ createdAt: -1 });

// Pre-save middleware to update the updatedAt field
OrderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

// Clear the model cache to ensure we're using the latest schema
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model("Order", OrderSchema);
