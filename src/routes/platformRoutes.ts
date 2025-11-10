import { Router } from "express";
import { createProject, listProjects, addMember, removeMember } from "../controllers/platformControllers";
import { authenticate, authorizeRole } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, createProject);
router.get("/", authenticate, listProjects);
router.post("/:id/members", authenticate, authorizeRole(["Reviewer", "Admin"]), addMember);
router.delete("/:id/members/:userId", authenticate, authorizeRole(["Reviewer", "Admin"]), removeMember);

export default router;
