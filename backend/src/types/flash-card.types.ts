export interface IFlashcardSet {
  _id?: string;
  userId: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFlashcard {
  _id?: string;
  userId: string;
  setId: string;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFlashcardSetDto {
  title: string;
  description?: string;
}

export interface CreateFlashcardDto {
  question: string;
  answer: string;
}

export interface QuizSubmissionDto {
  answers: Array<{
    flashcardId: string;
    userAnswer: string;
  }>;
}