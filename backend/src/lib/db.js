import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB", con.connection.host);
  } catch (error) {
    console.error("Error connected to DB" + error)
    process.exit(1)
  }
};
