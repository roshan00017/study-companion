import { taskService, noteService, flashcardService } from ".";
import { CreateTaskDto, CreateNoteDto, CreateFlashcardDto } from "../types";
import { getPromptForType, getGenerateSystemPrompt } from "../utils/ai-prompts";
import { ApiError } from "../utils/response.utils";
import { askAI } from "../config/openapi.config";

class AIGenerationService {
  private async generateContent<T>(
    type: "task" | "note" | "flashcard",
    topic: string
  ): Promise<T> {
    const messages = [
      {
        role: "system" as const,
        content: getGenerateSystemPrompt(type),
      },
      {
        role: "user" as const,
        content: getPromptForType(type, topic),
      },
    ];

    try {
      const response = await askAI(messages);
      if (!response?.content) {
        throw new ApiError(500, "Failed to generate content");
      }

      return JSON.parse(response.content) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new ApiError(500, "Invalid JSON response from AI");
      }
      throw error;
    }
  }

  async generateTask(userId: string, topic: string): Promise<CreateTaskDto> {
    const taskData = await this.generateContent<CreateTaskDto>("task", topic);
    return await taskService.createTask(userId, taskData);
  }

  async generateNote(userId: string, topic: string): Promise<CreateNoteDto> {
    const noteData = await this.generateContent<CreateNoteDto>("note", topic);
    return await noteService.createNote(userId, noteData);
  }

  async generateFlashcards(
    userId: string,
    setId: string,
    topic: string
  ): Promise<CreateFlashcardDto[]> {
    const flashcardsData = await this.generateContent<CreateFlashcardDto[]>(
      "flashcard",
      topic
    );

    const createdCards = await Promise.all(
      flashcardsData.map((card) =>
        flashcardService.createFlashcard(userId, setId, card)
      )
    );

    return createdCards;
  }

  async generateStudySet(
    userId: string,
    topic: string
  ): Promise<{
    task: CreateTaskDto;
    note: CreateNoteDto;
    flashcards: CreateFlashcardDto[];
  }> {
    const [taskData, noteData, flashcardsData] = await Promise.all([
      this.generateContent<CreateTaskDto>("task", topic),
      this.generateContent<CreateNoteDto>("note", topic),
      this.generateContent<CreateFlashcardDto[]>("flashcard", topic),
    ]);

    const task = await taskService.createTask(userId, taskData);
    const note = await noteService.createNote(userId, {
      ...noteData,
      taskId: task._id,
    });
    const flashcardSet = await flashcardService.createSet(userId, {
      title: `Flashcards: ${topic}`,
      description: `Generated flashcards for ${topic}`,
    });

    const flashcards = await Promise.all(
      flashcardsData.map((card) =>
        flashcardService.createFlashcard(userId, flashcardSet._id!, card)
      )
    );

    return { task, note, flashcards };
  }
}

export default new AIGenerationService();
