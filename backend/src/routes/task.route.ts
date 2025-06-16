import { Router } from "express";
import { taskController } from "../controllers";
import { verifyJWT } from "../middlewares";

const router = Router();

router.use(verifyJWT);

router.post("/", taskController.createTask);
router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
