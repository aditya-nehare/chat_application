import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { arjetProtection } from "../middlewares/arjet.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(arjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

router.put("/update-profile", protectRoute, updateProfile);
export default router;
