import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlusIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/solid";

import {
  getSets,
  createSet,
  deleteSet,
} from "../../services/api/flashcard.api";
import SetModal from "../../components/flashCards/SetModal";

import type { FlashcardSet } from "../../types/flashcard.type";
import FlashcardSetCard from "../../components/flashCards/FlashcardSet";

export default function FlashcardsPage() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [filteredSets, setFilteredSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  

  useEffect(() => {
    loadSets();
  }, []);

  useEffect(() => {
    const searchText = search.toLowerCase();
    setFilteredSets(
      sets.filter(
        (set) =>
          set.title.toLowerCase().includes(searchText) ||
          set.description?.toLowerCase().includes(searchText)
      )
    );
  }, [search, sets]);

  const loadSets = async () => {
    setLoading(true);
    try {
      const data = await getSets();
      setSets(data);
    } catch (err) {
      console.error("Failed to load flashcard sets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: { title: string; description?: string }) => {
    try {
      const newSet = await createSet(data);
      setSets((prev) => [newSet, ...prev]);
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to create flashcard set:", err);
      alert("Failed to create flashcard set. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this flashcard set?"))
      return;

    try {
      await deleteSet(id);
      setSets((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete flashcard set:", err);
      alert("Failed to delete flashcard set. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Flashcard Sets
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-700 
              text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl 
              transition-all duration-200 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Set</span>
          </motion.button>
        </div>

        <div className="relative mb-8">
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flashcard sets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 
              dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-800/80 
              backdrop-blur-sm text-gray-800 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-green-500 focus:border-transparent 
              transition-all duration-200 shadow-sm hover:shadow-md"
          />
        </div>

    {loading ? (
          <div className="flex justify-center items-center h-34">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSets.map((set) => (
                <motion.div
                  key={set._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-34 flex" 
                >
                  <FlashcardSetCard
                    set={set}
                    onDelete={() => handleDelete(set._id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence>
          {modalOpen && (
            <SetModal
              onClose={() => setModalOpen(false)}
              onSubmit={handleSave}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
