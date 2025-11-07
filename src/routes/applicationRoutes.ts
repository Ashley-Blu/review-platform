import { Router } from "express"
import { addApplication } from "../controllers/applicationControllers"

const router = Router();

// healthy route for the mounted router (matches GET /api/)
router.get('/', (_req, res) => {
	res.status(200).json({ message: 'applications router is mounted' });
});

router.post('/applications', addApplication)

export default router;