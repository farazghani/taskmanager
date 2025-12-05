import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";


if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config(); // loads .env by default
}


const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://taskmanager-fe-six.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api/user" , userRoutes);
app.use("/api/task" , taskRoutes);


export default app;

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== "test") {
  connectDB();
  app.listen(PORT, () => console.log("server running on port 8080"));
}