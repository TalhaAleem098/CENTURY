import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "resolved"],
      default: "new",
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

// Virtual for formatted date
contactSchema.virtual("formattedDate").get(function () {
  return this.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Pre-save middleware to detect potential spam
contactSchema.pre("save", function (next) {
  const spamKeywords = ["viagra", "casino", "lottery", "prize", "winner"];
  const messageText = this.message.toLowerCase();
  
  this.isSpam = spamKeywords.some(keyword => messageText.includes(keyword));
  next();
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
