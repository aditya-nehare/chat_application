import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";

import { connectDB } from "./lib/db.js";
import authRoute from "./routes/auth.route.js";
import msgRoute from "./routes/msg.route.js";

const app = express();
const port = ENV.PORT;
const __dirname = path.resolve();

app.use(express.json()); //So that we get access to user input from forms i.e. req.body

app.use("/api/auth", authRoute);
app.use("/api/message", msgRoute);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`server listening on port : ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB: " + err);
    process.exit(1);
  });
