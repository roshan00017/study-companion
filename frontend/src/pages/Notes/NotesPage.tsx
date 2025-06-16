import { useEffect, useState } from "react";

import {
  getNotes,
  createNote,
  deleteNote,
  updateNote,
} from "../../services/api/note.api";
import NoteCard from "../../components/notes/NoteCard";
import NoteModal from "../../components/notes/NoteModal";
import type { NotePayload } from "../../types/note.type";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlusIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/solid";

interface Note {
  _id: string;
  title: string;
  content: string;
  taskId?: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const searchText = search.toLowerCase();
    setFilteredNotes(
      notes.filter((note) => note.title.toLowerCase().includes(searchText))
    );
  }, [search, notes]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: NotePayload) => {
    try {
      if (editingNote) {
        const updated = await updateNote(editingNote._id, data);
        setNotes((prev) =>
          prev.map((n) => (n._id === updated._id ? updated : n))
        );
      } else {
        const created = await createNote(data);
        setNotes((prev) => [created, ...prev]);
      }
      closeModal();
    } catch {
      alert("Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingNote(null);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            My Notes
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Note</span>
          </motion.button>
        </div>

        <div className="relative mb-8">
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
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
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredNotes.map((note) => (
                <motion.div
                  key={note._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <NoteCard
                    title={note.title}
                    content={note.content}
                    onDelete={() => handleDelete(note._id)}
                    onEdit={() => openEditModal(note)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <AnimatePresence>
          {modalOpen && (
            <NoteModal
              initial={editingNote || undefined}
              onClose={closeModal}
              onSubmit={handleSave}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
