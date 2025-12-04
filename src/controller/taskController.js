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
    // Query params
    const search = req.query.search || "";
    const status = req.query.status || "";
    const priority = req.query.priority || "";
    const sortBy = req.query.sortBy || "createdAt"; // createdAt, dueDate, priority
    const order = req.query.order === "asc" ? 1 : -1;

    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Base filter
    const filter = {
      userId: req.userId,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Sorting logic
    const sortOptions = {};
    sortOptions[sortBy] = order;

    // Fetch tasks
    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Count total tasks for pagination info
    const totalTasks = await Task.countDocuments(filter);

    return res.json({
      success: true,
      page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      tasks
    });

  } catch (err) {
    console.error("Get Tasks Error:", err);
    return res.status(500).json({ msg: "Server error" });
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
    console.log(task)
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
