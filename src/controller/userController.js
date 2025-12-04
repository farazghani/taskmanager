import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

//  Validation schemas
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// login schema
const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password required"),
});

export const registerUser = async (req, res)  => {
  const parsed = registerSchema.safeParse(req.body);
   if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.errors });
        }

  const { name ,email, password } = parsed.data;
  if (!name ||!email || !password) return res.status(400).json({ msg: "Missing fields" });

  const exists = await User.findOne({ email });
  console.log(exists);
  if (exists) return res.status(400).json({ msg: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name ,email, passwordHash });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.json({ token });
};

export const login = async (req, res) => {
  // Validate input with Zod
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.errors });
  }

  const { email, password } = parsed.data;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Invalid password" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Return success
    return res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
