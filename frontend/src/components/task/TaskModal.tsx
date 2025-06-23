import { useState } from "react";
import type { Task } from "../../types/task.type";

interface Props {
  initial?: Task;
  onSubmit: (data: Task) => void;
  onClose: () => void;
}

export default function TaskModal({ initial, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<Task>(
    initial || {
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      completed: false,
      subtasks: [],
    } as Omit<Task, '_id'> as Task
  );

  const updateField = (name: string, value: any) =>
    setForm({ ...form, [name]: value });

  const addSubtask = () =>
    setForm({
      ...form,
      subtasks: [...(form.subtasks || []), { title: "", completed: false }],
    });
  const updateSubtask = (idx: number, title: string) => {
    const s = [...(form.subtasks || [])];
    s[idx].title = title;
    setForm({ ...form, subtasks: s });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {initial ? "Edit Task" : "New Task"}
        </h2>

        <input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => updateField("dueDate", e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <select
          value={form.priority}
          onChange={(e) => updateField("priority", e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          {["low", "medium", "high"].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <div>
          <h4 className="font-semibold">Subtasks</h4>
          {(form.subtasks || []).map((st, idx) => (
            <input
              key={idx}
              value={st.title}
              onChange={(e) => updateSubtask(idx, e.target.value)}
              placeholder="Subtask title"
              className="w-full p-2 border rounded mb-1"
            />
          ))}
          <button
            type="button"
            onClick={addSubtask}
            className="mt-2 text-blue-600"
          >
            + Add Subtask
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              // Remove _id if it's empty or not present
              const { _id, ...rest } = form;
              if (!_id) {
                onSubmit(rest as Task);
              } else {
                onSubmit(form);
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {initial ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
