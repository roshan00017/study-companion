import { Router } from "express";
import studyGroupController from "../controllers/study-group.controller";
import { verifyJWT } from "../middlewares";
import { requireGroupAdmin } from "../middlewares/study-group.middleware";

const router = Router();

router.use(verifyJWT);

// Create a group
router.post("/", studyGroupController.createStudyGroup);
// List groups for the authenticated user
router.get("/", studyGroupController.getGroupsForUser);
// List members of a group
router.get("/:groupId/members", studyGroupController.getGroupMembers);
// Add a user to a group (admin only)
router.post("/:groupId/members", requireGroupAdmin, studyGroupController.addUserToGroup);
// Remove a user from a group (admin only)
router.delete("/:groupId/members/:userId", requireGroupAdmin, studyGroupController.removeUserFromGroup);

export default router;
