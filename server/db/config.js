// local configuration in my environment

import mongoose from "mongoose";
import { DB_NAME } from "../constants/constants.js";

const connectToDatabase = async (MONGODB_URI) => {
  try {
    const MONGODB_OPTIONS = {
      dbname: DB_NAME,
    };
    await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
    console.log("connect to database successfully");
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw new Error('Failed to connect to the database. Please check your connection and try again.');
  }
};
export default connectToDatabase;