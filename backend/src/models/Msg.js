import mongoose from "mongoose";
import User from "./User.js";

const msgSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: User,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      ref: User,
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", msgSchema);
export default Message;
