import { Router } from "express";
import { flashcardController } from "../controllers";
import { verifyJWT } from "../middlewares";

const router = Router();

router.use(verifyJWT);

router.post("/sets", flashcardController.createSet);
router.get("/sets", flashcardController.getSets);
router.get("/quiz/start/:setId", flashcardController.startQuiz);
router.post("/quiz/submit", flashcardController.submitQuiz);
router.post("/cards", flashcardController.createFlashcard);
router.get("/sets/:setId/cards", flashcardController.getFlashcardsBySet);

export default router;
