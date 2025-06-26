import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../../services/api/task.api";
import TaskCard from "../../components/task/TaskCard";
import TaskModal from "../../components/task/TaskModal";
import type { Task, TaskPayload } from "../../types/task.type";
import TaskViewModal from "../../components/task/TaskViewModal";

export default function GroupTasksPage() {
  const { groupId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const location = useLocation();
  const [groupName, setGroupName] = useState<string>(
    location.state?.groupName || ""
  );

  useEffect(() => {
    loadTasks();
    if (location.state && location.state.groupName)
      setGroupName(location.state.groupName);
    // eslint-disable-next-line
  }, [groupId, location.state]);

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

  const handleSave = async (data: TaskPayload) => {
    if (!groupId) return;
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id!, {
          ...data,
          groupId,
        });
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );
      } else {
        const created = await createTask({ ...data, groupId });
        setTasks((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      alert("Failed to save task. Please try again.");
    }
  };

  const closeModal = () => {
    setEditingTask(null);
    setModalOpen(false);
  };

  // Handlers for edit, delete, toggle, subtask toggle
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete task. Please try again.");
    }
  };
  const handleToggle = async (task: Task) => {
    try {
      const updated = await updateTask(task._id!, {
        ...task,
        completed: !task.completed,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (err) {
      alert("Failed to update task. Please try again.");
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
      const updatedSubtasks = [...(task.subtasks || [])];
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        completed,
      };
      const updatedTask = {
        ...task,
        subtasks: updatedSubtasks,
      };
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));
      const response = await updateTask(taskId, updatedTask);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? response : t)));
    } catch (err) {
      alert("Failed to update subtask. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {groupName ? `${groupName} Tasks` : "Group Tasks"}
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
                onToggle={() => handleToggle(task)}
                onEdit={() => handleEdit(task)}
                onDelete={() => handleDelete(task._id!)}
                onView={setViewingTask}
                onSubtaskToggle={handleSubtaskToggle}
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
                    title: editingTask.title,
                    description: editingTask.description,
                    dueDate: editingTask.dueDate,
                    priority: editingTask.priority as
                      | "low"
                      | "medium"
                      | "high"
                      | undefined,
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
