import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = process.env;
    if (!MONGO_URI) throw new Error("MONGO URI is not set");

    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB", con.connection.host);
  } catch (error) {
    console.error("Error connected to DB" + error);
    process.exit(1);
  }
};
