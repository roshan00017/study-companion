import { Router } from "express";
import authRoutes from "./auth.route";
import noteRoutes from "./note.route";
import taskRoutes from "./task.route";
import flashcardRoutes from "./flash-card.route";
import aiRoutes from "./ai.route";
import aiGenerationRoutes from "./ai-generation.route";
import studygroupRoutes from "./study-group.route";
import userRoutes from "./user.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/tasks", taskRoutes);
router.use("/flashcards", flashcardRoutes);
router.use("/ai", aiRoutes);
router.use("/ai", aiGenerationRoutes);
router.use("/study-groups", studygroupRoutes);
router.use("/users", userRoutes);
export default router;
