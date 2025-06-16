import { Router } from "express";
import { authController } from "../controllers";
import { verifyJWT } from "../middlewares";

const router = Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", verifyJWT, authController.me);

export default router;
