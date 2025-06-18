import { Router } from "express";
import { aiGenerationController } from "../controllers";
import { verifyJWT } from "../middlewares";

const router = Router();

router.use(verifyJWT);

router.post("/generate/task", aiGenerationController.generateTask);
router.post("/generate/note", aiGenerationController.generateNote);
router.post("/generate/flashcard", aiGenerationController.generateFlashcards);

export default router;
