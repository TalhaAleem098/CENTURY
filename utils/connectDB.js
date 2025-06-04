import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    // console.log('Already connected to the database');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    });
    // console.log('Connected to the database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export default connectDB;
