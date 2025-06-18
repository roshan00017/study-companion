import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { ApiError, sendSuccess } from "../utils/response.utils";
import { getSystemPrompt } from "../utils/ai-prompts";
import { askAI } from "../config/openapi.config";

class AIController {
  async handleQuery(
    req: AuthRequest<{ section: string; message: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { section, message } = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      if (!section || !message) {
        throw new ApiError(400, "Missing section or message");
      }

      const systemPrompt = getSystemPrompt(
        section as "notes" | "tasks" | "flashcards" | "dashboard"
      );

      const messages: {
        role: "system" | "user" | "assistant";
        content: string;
      }[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ];

      const aiResponse = await askAI(messages);

      sendSuccess(res, "AI response generated successfully", {
        response: aiResponse.content,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AIController();
