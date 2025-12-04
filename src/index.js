import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";


dotenv.config();
connectDB();


const app = express();

app.use(cors({
  origin: "http://localhost:3000", // or your Vercel domain
  credentials: true,
}));

app.use(express.json());


app.use("/api/user" , userRoutes);
app.use("/api/task" , taskRoutes);

app.listen(8080 , ()=> console.log("server running on port 8080"));