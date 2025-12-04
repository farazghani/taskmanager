import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";


dotenv.config();
connectDB();


const app = express();
app.use(express.json());


app.use("/api/user" , userRoutes);
app.use("/api/task" , taskRoutes);

app.listen(3000 , ()=> console.log("server running on port 3000"));