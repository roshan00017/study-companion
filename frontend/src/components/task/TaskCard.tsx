import {
  CheckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Task } from "../../types/task.type";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
  onSubtaskToggle?: (
    taskId: string,
    subtaskIndex: number,
    completed: boolean
  ) => void;
}


export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onView,
  onSubtaskToggle,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col p-4 w-full h-56"> {/* <-- add h-56 */}
      <div className="flex justify-between items-start">
        <h3
          className={`text-lg font-semibold text-gray-800 ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`px-2 py-1 rounded text-xs ${
            task.priority === "high"
              ? "bg-red-100 text-red-800"
              : task.priority === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.dueDate && (
        <p className="text-sm text-gray-600 mt-1">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
        {task.description}
      </p>

   {task.subtasks.length > 0 && (
        <div
          className="mt-2 space-y-1 overflow-y-auto"
          style={{ maxHeight: "4.5rem" }} // ~72px, adjust as needed to fit inside h-56 card
        >
          {task.subtasks.map((subtask, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <button
                onClick={() =>
                  onSubtaskToggle?.(task._id, idx, !subtask.completed)
                }
                className={`flex items-center hover:text-gray-800 transition-colors ${
                  subtask.completed ? "text-green-600" : "text-gray-400"
                }`}
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <span className={subtask.completed ? "line-through" : ""}>
                {subtask.title}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 justify-end mt-auto pt-4">
        {/* mt-auto pushes buttons to the bottom */}
        <button
          onClick={() => onToggle(task)}
          className={`flex items-center gap-1 text-sm ${
            task.completed
              ? "text-gray-600 hover:text-gray-700"
              : "text-green-600 hover:text-green-700"
          } transition-colors`}
        >
          <CheckIcon className="h-4 w-4" />
          {task.completed ? "Undo" : "Complete"}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <PencilIcon className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
        <button
          onClick={() => onView(task)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700 transition-colors"
        >
          <EyeIcon className="h-4 w-4" />
          View
        </button>
      </div>
    </div>
  );
}