import { Router } from "express";
import { authController } from "../controllers";

const router = Router();

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/me", authController.me);
``;

export default router;
