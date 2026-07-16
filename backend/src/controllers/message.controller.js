import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Msg.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    console.log(req.user);
    const loggedInUserId = req.user._id;
    const user = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getContacts : " + error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMsgByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error.message);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const sendMsg = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMsg = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMsg.save();

    // ! send msg in real time - socket.io

    res.status(201).json(newMsg);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    console.log("Logged in user:", req.user);
    const loggedInUserId = req.user._id.toString();
    // find all message where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    console.log("Messages:", messages);

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
