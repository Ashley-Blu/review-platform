import { Request, Response } from "express";
import { query } from "../config/database";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const ownerId = (req as any).user?.id;
    const { rows } = await query(
      "INSERT INTO projects (title, description, owner_id) VALUES ($1,$2,$3) RETURNING *",
      [title, description, ownerId]
    );
    // auto add owner as member
    await query("INSERT INTO project_members (project_id, user_id, role) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING", [
      rows[0].id,
      ownerId,
      "Reviewer",
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating project" });
  }
};

export const listProjects = async (req: Request, res: Response) => {
  try {
    const { rows } = await query("SELECT p.*, u.username as owner_name FROM projects p JOIN users u ON p.owner_id = u.id ORDER BY p.created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listing projects" });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const projectId = Number(req.params.id);
    const { userId, role } = req.body;
    await query(
      "INSERT INTO project_members (project_id, user_id, role) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING",
      [projectId, userId, role || "Reviewer"]
    );
    res.status(201).json({ message: "Member added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding member" });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    const projectId = Number(req.params.id);
    const userId = Number(req.params.userId);
    await query("DELETE FROM project_members WHERE project_id=$1 AND user_id=$2", [projectId, userId]);
    res.json({ message: "Member removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing member" });
  }
};
