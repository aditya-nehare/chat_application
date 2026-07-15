import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMsgByUserId,
  sendMsg,
} from "../controllers/message.controller.js";
import { arjetProtection } from "../middlewares/arjet.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

//the middlewares execute in order - so requests get rate-limited first, then authenticated.
//this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting auth middleware

router.use(arjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMsgByUserId);
router.post("/send/:id", sendMsg);

export default router;
