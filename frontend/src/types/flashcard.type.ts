export interface FlashcardSet {
  _id: string;
  title: string;
  description?: string;
}

export interface Flashcard {
  _id: string;
  question: string;
  answer: string;
}