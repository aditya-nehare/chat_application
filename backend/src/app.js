dotenv.config();
import dotenv from "dotenv";
import express from "express";
import path from "path";

import authRoute from "./routes/auth.route.js";
import msgRoute from "./routes/msg.route.js";

const app = express();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use("/api/auth", authRoute);
app.use("/api/message", msgRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log("server listening on port 3000");
});
