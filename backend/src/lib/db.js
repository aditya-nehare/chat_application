import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.MONGO_URI) throw new Error("MONGO URI is not set");

    const con = await mongoose.connect(ENV.MONGO_URI);
    console.log("Connected to DB", con.connection.host);
  } catch (error) {
    console.error("Error connected to DB" + error);
    process.exit(1);
  }
};
