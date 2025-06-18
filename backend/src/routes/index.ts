import { Router } from "express";
import authRoutes from "./auth.route";
import noteRoutes from "./note.route";
import taskRoutes from "./task.route";
import flashcardRoutes from "./flash-card.route";
import aiRoutes from "./ai.route";
import aiGenerationRoutes from "./ai-generation.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/tasks", taskRoutes);
router.use("/flashcards", flashcardRoutes);
router.use("/ai", aiRoutes);
router.use("/ai", aiGenerationRoutes);
export default router;
