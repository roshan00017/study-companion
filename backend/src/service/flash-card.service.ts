import { FlashcardModel, FlashcardSetModel } from "../models";
import {
  CreateFlashcardDto,
  CreateFlashcardSetDto,
  IFlashcard,
  IFlashcardSet,
  QuizSubmissionDto,
} from "../types";

class FlashcardService {
  async createSet(
    userId: string,
    setData: CreateFlashcardSetDto
  ): Promise<IFlashcardSet> {
    return await FlashcardSetModel.create({ userId, ...setData });
  }

  async getSets(userId: string): Promise<IFlashcardSet[]> {
    return await FlashcardSetModel.find({ userId });
  }

  async createFlashcard(
    userId: string,
    setId: string,
    cardData: CreateFlashcardDto
  ): Promise<IFlashcard> {
    return await FlashcardModel.create({ userId, setId, ...cardData });
  }
  async getFlashcardsBySet(
    userId: string,
    setId: string
  ): Promise<IFlashcard[]> {
    return await FlashcardModel.find({ userId, setId });
  }

  async getQuizCards(userId: string, setId: string, count: number = 10) {
    return await FlashcardModel.aggregate([
      { $match: { userId, setId } },
      { $sample: { size: count } },
      { $project: { question: 1, _id: 1 } },
    ]);
  }

  async evaluateQuiz(userId: string, submission: QuizSubmissionDto) {
    const ids = submission.answers.map((a) => a.flashcardId);
    const flashcards = await FlashcardModel.find({ _id: { $in: ids }, userId });

    let correctCount = 0;
    const results = submission.answers.map((a) => {
      const original = flashcards.find(
        (f) => f._id.toString() === a.flashcardId
      );
      const isCorrect =
        original?.answer.trim().toLowerCase() ===
        a.userAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;

      return {
        question: original?.question,
        correctAnswer: original?.answer,
        userAnswer: a.userAnswer,
        isCorrect,
      };
    });

    return {
      total: submission.answers.length,
      correct: correctCount,
      incorrect: submission.answers.length - correctCount,
      results,
    };
  }
}

export default new FlashcardService();
