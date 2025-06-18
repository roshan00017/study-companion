import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import { ApiError, sendSuccess } from "../utils/response.utils";
import aiGenerationService from "../service/ai-generation.service";

interface GenerateRequest {
  topic: string;
  setId?: string; // Required for flashcards
}

class AIGenerationController {
  async generateTask(
    req: AuthRequest<GenerateRequest>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      const { topic } = req.body;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      if (!topic) {
        throw new ApiError(400, "Topic is required");
      }

      const task = await aiGenerationService.generateTask(userId, topic);
      sendSuccess(res, "Task generated successfully", task);
    } catch (error) {
      next(error);
    }
  }

  async generateNote(
    req: AuthRequest<GenerateRequest>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      const { topic } = req.body;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      if (!topic) {
        throw new ApiError(400, "Topic is required");
      }

      const note = await aiGenerationService.generateNote(userId, topic);
      sendSuccess(res, "Note generated successfully", note);
    } catch (error) {
      next(error);
    }
  }

  async generateFlashcards(
    req: AuthRequest<GenerateRequest>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      const { topic, setId } = req.body;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      if (!topic || !setId) {
        throw new ApiError(400, "Topic and setId are required");
      }

      const flashcards = await aiGenerationService.generateFlashcards(
        userId,
        setId,
        topic
      );
      sendSuccess(res, "Flashcards generated successfully", flashcards);
    } catch (error) {
      next(error);
    }
  }
}

export default new AIGenerationController();
