import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store";
import { setTasks, addTask, updateTask as updateTaskAction, removeTask } from "../../store/tasksSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  PlusIcon,
  MagnifyingGlassIcon as SearchIcon,
} from "@heroicons/react/24/solid";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/api/task.api";
import TaskCard from "../../components/task/TaskCard";
import TaskModal from "../../components/task/TaskModal";
import type { Task } from "../../types/task.type";
import TaskViewModal from "../../components/task/TaskViewModal";
// import { useItemUpdates } from "../../hooks/useItemupdates";

export default function TasksPage() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  // filteredTasks is now computed with useMemo below
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  // useItemUpdates("task", (newTask) => {
  //   dispatch(addTask(newTask));
  // });

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    const searchText = search.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchText) ||
        task.description?.toLowerCase().includes(searchText)
    );
  }, [search, tasks]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      dispatch(setTasks(data));
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Task) => {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, data);
        dispatch(updateTaskAction(updated));
      } else {
        const created = await createTask(data);
        dispatch(addTask(created));
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save task:", err);
      alert("Failed to save task. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(id);
      dispatch(removeTask(id));
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task. Please try again.");
    }
  };
  const handleSubtaskToggle = async (
    taskId: string,
    subtaskIndex: number,
    completed: boolean
  ) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

     const updatedSubtasks = task.subtasks ? [...task.subtasks] : [];
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        completed,
      };

      const updatedTask = {
        ...task,
        subtasks: updatedSubtasks,
      };

      // Optimistic update
      dispatch(updateTaskAction(updatedTask)); // Optimistic update

      // Call API
      const response = await updateTask(taskId, updatedTask);

      // Update with server response
      dispatch(updateTaskAction(response)); // Update with server response
    } catch (err) {
      console.error("Failed to update subtask:", err);
      alert("Failed to update subtask. Please try again.");
    }
  };
  const handleToggle = async (task: Task) => {
    try {
      const updated = await updateTask(task._id, {
        ...task,
        completed: !task.completed,
      });
      dispatch(updateTaskAction(updated));
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to update task. Please try again.");
    }
  };

  const closeModal = () => {
    setEditingTask(null);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            My Tasks
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
            <span>Create Task</span>
          </motion.button>
        </div>

        <div className="relative mb-8">
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTasks.map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard
                    task={task}
                    onToggle={handleToggle}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setModalOpen(true);
                    }}
                    onDelete={handleDelete}
                    onView={(t) => setViewingTask(t)}
                    onSubtaskToggle={handleSubtaskToggle}
                  />
                </motion.div>
              ))}
            </motion.div>
            {viewingTask && (
              <TaskViewModal
                task={viewingTask}
                onClose={() => setViewingTask(null)}
              />
            )}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {modalOpen && (
            <TaskModal
              initial={editingTask || undefined}
              onClose={closeModal}
              onSubmit={handleSave}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
