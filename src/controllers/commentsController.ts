import { Request, Response } from "express";
import { query } from "../config/database";
import { emitNotification } from "../utils/socket";

export const addComment = async (req: Request, res: Response) => {
  try {
    const submissionId = Number(req.params.id);
    const { content, inline_line } = req.body;
    const authorId = (req as any).user.id;

    const { rows } = await query(
      "INSERT INTO comments (submission_id, user_id, content, inline_line) VALUES ($1,$2,$3,$4) RETURNING *",
      [submissionId, authorId, content, inline_line || null]
    );

    // Notify submitter
    const sub = await query("SELECT user_id FROM submissions WHERE id=$1", [submissionId]);
    if (sub.rows[0]) {
      const submitter = sub.rows[0].user_id;
      await query("INSERT INTO notifications (user_id, message) VALUES ($1,$2)", [
        submitter,
        `New comment on your submission: ${content.substring(0, 100)}`,
      ]);
      emitNotification(submitter, { message: "New comment", comment: rows[0] });
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment" });
  }
};

export const listComments = async (req: Request, res: Response) => {
  try {
    const submissionId = Number(req.params.id);
    const { rows } = await query(
      "SELECT c.*, u.username as author_name FROM comments c JOIN users u ON c.user_id=u.id WHERE submission_id=$1 ORDER BY created_at ASC",
      [submissionId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;
    await query("UPDATE comments SET content=$1 WHERE id=$2", [content, id]);
    res.json({ message: "Comment updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await query("DELETE FROM comments WHERE id=$1", [id]);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting comment" });
  }
};
