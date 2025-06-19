import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlusIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/solid";

import {
  getNotes,
  createNote,
  deleteNote,
  updateNote,
} from "../../services/api/note.api";
import NoteCard from "../../components/notes/NoteCard";
import NoteModal from "../../components/notes/NoteModal";
import ViewNoteModal from "../../components/notes/ViewNoteModal";
import type { NotePayload } from "../../types/note.type";
import { useItemUpdates } from "../../hooks/useItemupdates";

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
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  useItemUpdates("note", (newNote) => {
    setNotes((prev) => [newNote, ...prev]);
  });
  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const searchText = search.toLowerCase();
    setFilteredNotes(
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchText) ||
          note.content.toLowerCase().includes(searchText)
      )
    );
  }, [search, notes]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
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
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
      alert("Failed to delete note. Please try again.");
    }
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const openViewModal = (note: Note) => {
    setViewingNote(note);
  };

  const closeModal = () => {
    setEditingNote(null);
    setModalOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-900 dark:to-gray-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 
            bg-clip-text text-transparent"
          >
            My Notes
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
            <span>Create Note</span>
          </motion.button>
        </div>

        <div className="relative mb-8">
          <SearchIcon
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 
            transform -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search your notes..."
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
          <div className="flex justify-center items-center h-64">
            <div
              className="animate-spin rounded-full h-12 w-12 
              border-b-2 border-green-600"
            ></div>
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
                    onView={() => openViewModal(note)}
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
          {viewingNote && (
            <ViewNoteModal
              title={viewingNote.title}
              content={viewingNote.content}
              onClose={() => setViewingNote(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
