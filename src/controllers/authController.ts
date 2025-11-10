import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../config/database";
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const { rows } = await query(
      "INSERT INTO users (username, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id,username,email,role,created_at",
      [username, email, hashed, role || "Submitter"]
    );
    res.status(201).json(rows[0]);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.detail || "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { rows } = await query("SELECT * FROM users WHERE email=$1", [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
