// models/Analytics.js
import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  // Store all analytics data as a single JSON object (for flexibility & minimal bandwidth)
  data: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
