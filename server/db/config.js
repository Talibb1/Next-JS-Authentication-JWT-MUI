// local configuration in my environment

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDatabase = async (MONGODB_URI) => {
  try {
    const MONGODB_OPTIONS = {
      dbname: process.env.DB_NAME,
    };
    await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
    console.log("connect to database successfully");
  } catch (error) {
    console.log(error);
  }
};
export default connectToDatabase;



// mongodb+srv://AhsanMisbah:RU0iuEdS4rgl6sf3@cluster0.79zlrzt.mongodb.net/    * //mongodb atlas password
// mongodb+srv://ismailahmed:Talib@123@cluster0.79zlrzt.mongodb.net/         * //mongodb atlas password


// 
// AhsanMisbah
// RU0iuEdS4rgl6sf3