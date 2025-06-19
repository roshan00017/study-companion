import Loader from "../../components/ui/Loader";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
  Squares2X2Icon,
  EyeIcon,
  PlayCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import NoteModal from "../../components/notes/NoteModal";
import ViewNoteModal from "../../components/notes/ViewNoteModal";
import TaskModal from "../../components/task/TaskModal";
import TaskViewModal from "../../components/task/TaskViewModal";
import SetModal from "../../components/flashCards/SetModal";

export default function DashboardHome() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // State for summary counts and recent items
  const [counts, setCounts] = useState({
    notes: 0,
    tasks: 0,
    flashcards: 0,
  });
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [recentSets, setRecentSets] = useState<any[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Modal state for view/create
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);
  const [viewingNote, setViewingNote] = useState<any | null>(null);
  const [viewingTask, setViewingTask] = useState<any | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setSummaryLoading(true);
        const [notesRes, tasksRes, setsRes] = await Promise.all([
          api.get("/notes"),
          api.get("/tasks"),
          api.get("/flashcards/sets"),
        ]);
        setCounts({
          notes: notesRes.data.data.length,
          tasks: tasksRes.data.data.length,
          flashcards: setsRes.data.data.length,
        });
        setRecentNotes(notesRes.data.data.slice(0,3));
        setRecentTasks(tasksRes.data.data.slice(0,3));
        setRecentSets(setsRes.data.data.slice(0,3));
      } catch (err) {
        // fallback: don't block dashboard
      } finally {
        setSummaryLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          {/* Welcome Section */}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{user?.email}</p>

          {/* Summary Cards Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link
                to="/dashboard/notes"
                className="flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 hover:shadow-lg transition"
              >
                <BookOpenIcon className="h-10 w-10 text-blue-600 mb-2" />
                <span className="font-semibold text-lg text-blue-700 dark:text-blue-200">
                  Notes
                </span>
                <span className="text-2xl font-bold mt-2">
                  {summaryLoading ? "..." : counts.notes}
                </span>
              </Link>
              <Link
                to="/dashboard/tasks"
                className="flex flex-col items-center bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg p-6 hover:shadow-lg transition"
              >
                <ClipboardDocumentListIcon className="h-10 w-10 text-green-600 mb-2" />
                <span className="font-semibold text-lg text-green-700 dark:text-green-200">
                  Tasks
                </span>
                <span className="text-2xl font-bold mt-2">
                  {summaryLoading ? "..." : counts.tasks}
                </span>
              </Link>
              <Link
                to="/dashboard/flashcards"
                className="flex flex-col items-center bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-lg p-6 hover:shadow-lg transition"
              >
                <Squares2X2Icon className="h-10 w-10 text-yellow-600 mb-2" />
                <span className="font-semibold text-lg text-yellow-700 dark:text-yellow-200">
                  Flashcards
                </span>
                <span className="text-2xl font-bold mt-2">
                  {summaryLoading ? "..." : counts.flashcards}
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Notes Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-200">
              Recent Notes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentNotes.length === 0 && (
                <div className="text-gray-500 text-sm">No notes yet.</div>
              )}
              {recentNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 flex flex-col"
                >
                  <span className="font-semibold text-blue-800 dark:text-blue-200 mb-2 truncate">
                    {note.title}
                  </span>
                  <button
                    onClick={() => setViewingNote(note)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors mt-auto"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-200">
              Recent Tasks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentTasks.length === 0 && (
                <div className="text-gray-500 text-sm">No tasks yet.</div>
              )}
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-green-50 dark:bg-green-900 rounded-lg p-4 flex flex-col"
                >
                  <span className="font-semibold text-green-800 dark:text-green-200 mb-2 truncate">
                    {task.title}
                  </span>
                  <button
                    onClick={() => setViewingTask(task)}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors mt-auto"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Flashcard Sets Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-700 dark:text-yellow-200">
              Recent Flashcard Sets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentSets.length === 0 && (
                <div className="text-gray-500 text-sm">No sets yet.</div>
              )}
              {recentSets.map((set) => (
                <div
                  key={set._id}
                  className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 flex flex-col"
                >
                  <span className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 truncate">
                    {set.title}
                  </span>
                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/dashboard/flashcards/${set._id}`}
                      className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View
                    </Link>
                    <button
                      onClick={() =>
                        navigate(`/dashboard/flashcards/${set._id}/quiz`)
                      }
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <PlayCircleIcon className="h-4 w-4" />
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips/Announcement Section */}
          <div className="mb-8 flex items-center gap-3 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <LightBulbIcon className="h-6 w-6 text-yellow-400" />
            <span className="text-blue-800 dark:text-blue-200 font-medium">
              Tip: Use the chat widget for AI-powered study help, summaries, and card generation!
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="mt-10 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Logout
          </motion.button>
        </motion.div>
      </div>

      {/* Modals for create/view */}
      {showNoteModal && (
        <NoteModal
          onClose={() => setShowNoteModal(false)}
          onSubmit={() => {
            setShowNoteModal(false);
            // Optionally reload notes here
          }}
        />
      )}
      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={() => {
            setShowTaskModal(false);
            // Optionally reload tasks here
          }}
        />
      )}
      {showSetModal && (
        <SetModal
          onClose={() => setShowSetModal(false)}
          onSubmit={() => {
            setShowSetModal(false);
            // Optionally reload sets here
          }}
        />
      )}
      {viewingNote && (
        <ViewNoteModal
          title={viewingNote.title}
          content={viewingNote.content}
          onClose={() => setViewingNote(null)}
        />
      )}
      {viewingTask && (
        <TaskViewModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
        />
      )}
    </div>
  );
}