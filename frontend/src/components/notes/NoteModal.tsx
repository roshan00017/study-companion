import { useEffect, useState } from "react";

import { getTasks } from "../../services/api/task.api";
import type { NotePayload } from "../../types/note.type";

interface Props {
  initial?: NotePayload;
  onSubmit: (data: NotePayload) => void;
  onClose: () => void;
}

export default function NoteModal({ initial, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<NotePayload>(
    initial || { title: "", content: "", taskId: "" }
  );
  const [tasks, setTasks] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    (async () => {
      const taskList = await getTasks();
      setTasks(taskList);
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {initial ? "Edit Note" : "New Note"}
        </h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          rows={4}
          className="w-full p-2 border rounded mb-2"
        />
        <select
          name="taskId"
          value={form.taskId || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">No Task</option>
          {tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {initial ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
