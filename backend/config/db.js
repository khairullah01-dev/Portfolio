import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  const connection = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
};

export default connectDB;
