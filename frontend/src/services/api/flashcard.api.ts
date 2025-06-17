import api from "../api";

export const getSets = async () =>
  (await api.get("/flashcards/sets")).data.data;

export const createSet = async (data: {
  title: string;
  description?: string;
}) => (await api.post("/flashcards/sets", data)).data.data;

export const deleteSet = async (setId: string) =>
  api.delete(`/flashcards/sets/${setId}`);
export const deleteCards = async (cardId: string) =>
  api.delete(`/flashcards/cards/${cardId}`);

export const getFlashcardsBySet = async (setId: string) =>
  (await api.get(`/flashcards/sets/${setId}/cards`)).data.data;

export const createFlashcard = async (data: {
  setId: string;
  question: string;
  answer: string;
}) => (await api.post("/flashcards/cards", data)).data.data;
