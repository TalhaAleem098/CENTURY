const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubscribedEmailSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Add a static field to store the total count
const SubscriberCountSchema = new Schema({
  totalCount: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to update count
SubscribedEmailSchema.post('save', async function() {
  try {
    const count = await this.constructor.countDocuments({ isActive: true });
    await mongoose.model('SubscriberCount').findOneAndUpdate(
      {},
      { totalCount: count, lastUpdated: new Date() },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error updating subscriber count:', error);
  }
});

// Pre-remove middleware to update count
SubscribedEmailSchema.post('findOneAndDelete', async function() {
  try {
    const SubscribedEmail = mongoose.model('SubscribedEmail');
    const count = await SubscribedEmail.countDocuments({ isActive: true });
    await mongoose.model('SubscriberCount').findOneAndUpdate(
      {},
      { totalCount: count, lastUpdated: new Date() },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error updating subscriber count:', error);
  }
});

const SubscribedEmail = mongoose.models.SubscribedEmail || mongoose.model("SubscribedEmail", SubscribedEmailSchema);
const SubscriberCount = mongoose.models.SubscriberCount || mongoose.model("SubscriberCount", SubscriberCountSchema);

module.exports = { SubscribedEmail, SubscriberCount };
