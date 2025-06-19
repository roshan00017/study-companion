import { Response, NextFunction } from "express";
import { flashcardService } from "../service";
import {
  AuthRequest,
  CreateFlashcardDto,
  CreateFlashcardSetDto,
  QuizSubmissionDto,
} from "../types";
import { ApiError, sendSuccess } from "../utils/response.utils";
import { FlashcardModel, FlashcardSetModel } from "../models";

class FlashcardController {
  async createSet(
    req: AuthRequest<CreateFlashcardSetDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const set = await flashcardService.createSet(userId, req.body);
      sendSuccess(res, "Flashcard set created successfully", set, 201);
    } catch (error) {
      next(error);
    }
  }

  async getSets(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const sets = await flashcardService.getSets(userId);
      sendSuccess(res, "Flashcard sets fetched successfully", sets);
    } catch (error) {
      next(error);
    }
  }

  async startQuiz(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.uid;
      const { setId } = req.params;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const flashcards = await flashcardService.getQuizCards(userId, setId);
      sendSuccess(res, "Quiz started successfully", { flashcards });
    } catch (error) {
      next(error);
    }
  }

  async submitQuiz(
    req: AuthRequest<QuizSubmissionDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const results = await flashcardService.evaluateQuiz(userId, req.body);
      sendSuccess(res, "Quiz submitted successfully", results);
    } catch (error) {
      next(error);
    }
  }

  async createFlashcard(
    req: AuthRequest<CreateFlashcardDto & { setId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      const { setId, question, answer } = req.body;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const flashcard = await flashcardService.createFlashcard(userId, setId, {
        question,
        answer,
      });

      sendSuccess(res, "Flashcard created successfully", flashcard, 201);
    } catch (error) {
      next(error);
    }
  }

  async getFlashcardsBySet(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.uid;
      const { setId } = req.params;

      if (!userId) {
        throw new ApiError(401, "User not authenticated");
      }

      const flashcards = await flashcardService.getFlashcardsBySet(
        userId,
        setId
      );
      sendSuccess(res, "Flashcards fetched successfully", flashcards);
    } catch (error) {
      next(error);
    }
  }


  async deleteSet(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.uid;
    const { setId } = req.params;
    if (!userId) throw new ApiError(401, "User not authenticated");
    const deleted = await flashcardService.deleteSet(userId, setId);
    if (!deleted) throw new ApiError(404, "Set not found");
    sendSuccess(res, "Flashcard set and its cards deleted successfully");
  } catch (error) {
    next(error);
  }
}

async deleteSetCard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.uid;
    const {cardId } = req.params;
    if (!userId) throw new ApiError(401, "User not authenticated");
    const deleted = await flashcardService.deleteSetCard(userId, cardId);
    if (!deleted) throw new ApiError(404, "Card not found");
    sendSuccess(res, "Card deleted successfully");
  } catch (error) {
    next(error);
  }
}
}

export default new FlashcardController();
