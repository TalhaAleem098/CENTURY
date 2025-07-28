// models/AnalyticsUser.js
import mongoose from 'mongoose';

const AnalyticsUserSchema = new mongoose.Schema({
  ip: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  url: { type: String, default: '/' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.AnalyticsUser || mongoose.model('AnalyticsUser', AnalyticsUserSchema);
