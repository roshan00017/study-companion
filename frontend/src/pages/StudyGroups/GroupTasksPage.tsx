import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createTask, getTasks } from "../../services/api/task.api";
import TaskCard from "../../components/task/TaskCard";
import TaskModal from "../../components/task/TaskModal";
import type { Task } from "../../types/task.type";
import TaskViewModal from "../../components/task/TaskViewModal";

export default function GroupTasksPage() {
  const { groupId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line
  }, [groupId]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks(groupId);
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Task) => {
    // Attach groupId to the payload
    if (!groupId) return;
    try {
      await createTask({ ...data, groupId });
      loadTasks();
      closeModal();
    } catch (err) {
      alert("Failed to create task. Please try again.");
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
            Group Tasks
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
          >
            <span>+ Create Task</span>
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length === 0 && <div>No tasks found for this group.</div>}
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                onView={setViewingTask}
                onSubtaskToggle={() => {}}
              />
            ))}
          </div>
        )}
        {viewingTask && (
          <TaskViewModal
            task={viewingTask}
            onClose={() => setViewingTask(null)}
          />
        )}
        {modalOpen && (
          <TaskModal
            initial={
              editingTask
                ? {
                    _id: editingTask._id,
                    title: editingTask.title,
                    description: editingTask.description,
                    dueDate: editingTask.dueDate,
                    priority: editingTask.priority,
                    completed: editingTask.completed,
                    subtasks: editingTask.subtasks,
                    groupId: editingTask.groupId,
                  }
                : undefined
            }
            onClose={closeModal}
            onSubmit={handleSave}
          />
        )}
      </div>
    </div>
  );
}
