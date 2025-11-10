import { Router } from "express";
import { addComment, listComments, updateComment, deleteComment } from "../controllers/commentsController";
import { authenticate, authorizeRole } from "../middleware/auth";

const router = Router();

router.post("/submission/:id", authenticate, authorizeRole(["Reviewer","Admin"]), addComment);
router.get("/submission/:id", authenticate, listComments);
router.patch("/:id", authenticate, authorizeRole(["Reviewer","Admin"]), updateComment);
router.delete("/:id", authenticate, authorizeRole(["Reviewer","Admin"]), deleteComment);

export default router;
