import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import api from "../../services/api";
import type { Flashcard } from "../../types/flashcard.type";

interface QuizAnswer {
  flashcardId: string;
  userAnswer: string;
}

interface QuizResult {
  correct: number;
  total: number;
  results: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export default function QuizPage() {
  const { setId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/flashcards/quiz/start/${setId}`);
      setCards(res.data.data.flashcards);
      setAnswers([]);
      setResult(null);
      setError(null);
    } catch (err) {
      setError("Failed to load quiz questions");
      console.error("Error loading quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [setId]);

  const handleChange = (idx: number, value: string) => {
    const cur = [...answers];
    cur[idx] = { flashcardId: cards[idx]._id, userAnswer: value };
    setAnswers(cur);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await api.post("flashcards/quiz/submit", { answers });
      setResult(res.data.data);
    } catch (err) {
      setError("Failed to submit quiz");
      console.error("Error submitting quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <button
            onClick={() => navigate(`/dashboard/flashcards/${setId}`)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-4"
          >
            Back to Flashcards
          </button>
          <button
            onClick={loadQuiz}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Quiz Results
            </h2>
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-xl font-semibold">
                Score: {result.correct} out of {result.total} correct
              </p>
              <p className="text-gray-600">
                ({((result.correct / result.total) * 100).toFixed(1)}%)
              </p>
            </div>

            <div className="space-y-4">
              {result.results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-lg ${
                    r.isCorrect ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <p className="font-semibold mb-2">Q: {r.question}</p>
                  <p
                    className={`${
                      r.isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    Your answer: {r.userAnswer}
                  </p>
                  {!r.isCorrect && (
                    <p className="text-gray-600">
                      Correct answer: {r.correctAnswer}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => navigate(`/dashboard/flashcards/${setId}`)}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Flashcards
              </button>
              <button
                onClick={loadQuiz}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(`/dashboard/flashcards/${setId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Flashcards
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Quiz Time!</h2>

          <AnimatePresence>
            <div className="space-y-4">
              {cards.map((card, idx) => (
                <motion.div
                  key={card._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 p-6 rounded-lg"
                >
                  <p className="font-semibold text-lg mb-3">{card.question}</p>
                  <input
                    type="text"
                    placeholder="Your answer"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200"
                    onChange={(e) => handleChange(idx, e.target.value)}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-lg
              hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Submit Quiz
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
