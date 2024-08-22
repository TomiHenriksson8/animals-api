import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoConnect = async () => {
  // Connect to MongoDB
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB connected ${connection.connection.host}`);
    return connection;
  } catch (err) {
    console.error(err);
  }
};

export default mongoConnect;
