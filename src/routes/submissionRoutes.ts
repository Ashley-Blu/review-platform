import { Router } from "express";
import { createSubmission, listProjectSubmissions, getSubmission, updateSubmissionStatus, deleteSubmission } from "../controllers/submissionController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createSubmission);
router.get("/project/:id", authenticate, listProjectSubmissions);
router.get("/:id", authenticate, getSubmission);
router.patch("/:id/status", authenticate, updateSubmissionStatus);
router.delete("/:id", authenticate, deleteSubmission);

export default router;
