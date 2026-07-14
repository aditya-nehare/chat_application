import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controller/auth.controller.js";
import { arjetProtection } from "../middlewares/arjet.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(arjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
export default router;
