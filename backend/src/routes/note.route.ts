import { Router } from "express";
import { noteController } from "../controllers";
import { verifyJWT } from "../middlewares";

const router = Router();

router.use(verifyJWT);

router.post("/", noteController.createNote);
router.get("/", noteController.getNotes);
router.get("/:id", noteController.getNoteById);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

export default router;
