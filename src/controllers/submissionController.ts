import { Request, Response } from "express";
import { query } from "../config/database";
import { emitNotification } from "../utils/socket";

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { project_id, content } = req.body;
    const submitterId = (req as any).user?.id;

    const { rows } = await query(
      "INSERT INTO submissions (project_id, user_id, content) VALUES ($1,$2,$3) RETURNING *",
      [project_id, submitterId, content]
    );

    // Notify all project members
    const members = await query("SELECT user_id FROM project_members WHERE project_id=$1", [project_id]);
    for (const m of members.rows) {
      await query("INSERT INTO notifications (user_id, message) VALUES ($1,$2)", [
        m.user_id,
        `New submission in project ${project_id}`,
      ]);
      emitNotification(m.user_id, { message: "New submission", submission: rows[0] });
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating submission" });
  }
};

export const listProjectSubmissions = async (req: Request, res: Response) => {
  try {
    const projectId = Number(req.params.id);
    const { rows } = await query("SELECT * FROM submissions WHERE project_id=$1 ORDER BY submitted_at DESC", [projectId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

export const getSubmission = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await query("SELECT * FROM submissions WHERE id=$1", [id]);
    if (!rows[0]) return res.status(404).json({ message: "Submission not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching submission" });
  }
};

export const updateSubmissionStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    await query("UPDATE submissions SET status=$1 WHERE id=$2", [status, id]);
    res.json({ message: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
};

export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await query("DELETE FROM submissions WHERE id=$1", [id]);
    res.json({ message: "Submission deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting submission" });
  }
};
