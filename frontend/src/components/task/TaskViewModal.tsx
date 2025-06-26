import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { XMarkIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import type { Task } from "../../types/task.type";

import ViewNoteModal from "../notes/ViewNoteModal";
import { getNotesByTaskId } from "../../services/api/task.api";

interface Props {
  task: Task;
  onClose: () => void;
}

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function TaskViewModal({ task, onClose }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    loadNotes();
  }, [task._id]);

  const loadNotes = async () => {
    try {
      const data = await getNotesByTaskId(task._id!);
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Existing task details code... */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {task.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`text-sm ${
                    task.completed ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Due Date
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {task.description || "No description provided"}
            </p>
          </div>

          {/* Subtasks */}
          {(task.subtasks ?? []).length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Subtasks
              </h3>
              <ul className="space-y-2">
                {(task.subtasks ?? []).map((subtask, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span
                      className={`text-gray-600 dark:text-gray-400 ${
                        subtask.completed ? "line-through" : ""
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Related Notes Section */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Related Notes
            </h3>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
            ) : notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map((note) => (
                  <motion.button
                    key={note._id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedNote(note)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 
                      hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors
                      flex items-center gap-2"
                  >
                    <DocumentTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-200">
                      {note.title}
                    </span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No notes attached to this task
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Note View Modal */}
      {selectedNote && (
        <ViewNoteModal
          title={selectedNote.title}
          content={selectedNote.content}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </motion.div>
  );
}
