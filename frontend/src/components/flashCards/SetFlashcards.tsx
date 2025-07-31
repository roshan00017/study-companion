import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  getFlashcardsBySet,
  createFlashcard,
  deleteCards,
} from "../../services/api/flashcard.api";

import CardModal from "./CardModal";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store";
import {
  setFlashcards,
  addFlashcard,
  removeFlashcard,
  clearFlashcards,
} from "../../store/flashcardsSlice";
import BackButton from "../button/back-button";

export default function SetFlashcards() {
  const { setId } = useParams();
  const dispatch = useDispatch();
  const { setId: reduxSetId, cards } = useSelector(
    (state: RootState) => state.flashcards
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (setId && setId !== reduxSetId) {
      loadCards();
    }
    // Clear cards when unmounting or setId changes
    return () => {
      dispatch(clearFlashcards());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setId]);

  const loadCards = async () => {
    if (!setId) return;
    setLoading(true);
    try {
      const data = await getFlashcardsBySet(setId);
      dispatch(setFlashcards({ setId, cards: data }));
    } catch (err) {
      console.error("Failed to load flashcards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: { question: string; answer: string }) => {
    if (!setId) return;
    try {
      const newCard = await createFlashcard({ setId, ...data });
      dispatch(addFlashcard(newCard));
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to create flashcard:", err);
      alert("Failed to create flashcard. Please try again.");
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?"))
      return;

    try {
      await deleteCards(cardId);
      dispatch(removeFlashcard(cardId));
    } catch (err) {
      console.error("Failed to delete flashcard:", err);
      alert("Failed to delete flashcard. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <BackButton className="mb-4" />
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Flashcards
          </h1>

          <div className="flex gap-4">
            <Link
              to={`/dashboard/flashcards/${setId}/quiz`}
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg \
                shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Quiz
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen(true)}
              className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-700 \
                text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl \
                transition-all duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Card</span>
            </motion.button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {cards.map((card) => (
                <motion.div
                  key={card._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {card.question}
                  </h3>
                  <p className="text-gray-600 mb-4">{card.answer}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(card._id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence>
          {modalOpen && (
            <CardModal
              onClose={() => setModalOpen(false)}
              onSubmit={handleSave}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
