import Task from "../models/Task.js";
import { z } from "zod";

// validation for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
});

// CREATE task
export const createTask = async (req, res) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  const { title, description, dueDate, priority, status } = parsed.data;

  try {
    const task = await Task.create({
      userId: req.userId, // set by auth middleware
      title,
      description,
      dueDate,
      priority,
      status,
    });

    res.status(201).json({ success: true, task });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET all tasks of logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json({ success: true, task });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json({ success: true, msg: "Task deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
