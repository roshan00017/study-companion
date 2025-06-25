import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router();

// GET /users/search?email=...
router.get("/search", userController.searchUserByEmail);

export default router;
