dotenv.config();
import dotenv from "dotenv";
import express from "express";

import authRoute from "./routes/auth.route.js";
import msgRoute from "./routes/msg.route.js";

const app = express();
const port = process.env.PORT;

app.use("/api/auth", authRoute);
app.use("/api/message", msgRoute);

app.listen(port, () => {
  console.log("server listening on port 3000");
});
