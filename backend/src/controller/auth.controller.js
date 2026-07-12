import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/util.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least of 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "Email already exists" });
    }

    //hashing
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: fullName,
        email: email,
        profilePic: profilePic,
      });
    } else {
      res.status(404).json({ message: "Invalid User data" });
    }
  } catch (error) {
    console.log("error in signup" + error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
