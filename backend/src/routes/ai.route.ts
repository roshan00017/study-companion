import { Router } from "express";
import { aiController } from "../controllers";
import { verifyJWT } from "../middlewares";

const router = Router();

router.use(verifyJWT);

router.post("/query", aiController.handleQuery);

export default router;
