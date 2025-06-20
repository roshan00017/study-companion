export interface Flashcard {
  _id: string;
  question: string;
  answer: string;
  // Add other fields as needed
}

export interface FlashcardSet {
  _id: string;
  title: string;
  description?:string;
  cards: Flashcard[];
  // Add other fields as needed
}
