import { Router } from "express";
import authRoutes from "./auth.route";
import noteRoutes from "./note.route";
import taskRoutes from "./task.route";
import flashcardRoutes from "./flash-card.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/tasks", taskRoutes);
router.use("/flashcards", flashcardRoutes);

export default router;
