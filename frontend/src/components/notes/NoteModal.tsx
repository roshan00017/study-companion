import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import type { NotePayload } from "../../types/note.type";
import { getTasks } from "../../services/api/task.api";

interface Props {
  initial?: NotePayload;
  onSubmit: (data: NotePayload) => void;
  onClose: () => void;
}
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const formats = ["header", "bold", "italic", "underline", "list", "bullet"];

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContentChange = (value: string) => {
    setForm({ ...form, content: value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6 shadow-md max-h-[90vh] overflow-y-auto">
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

        <div className="mb-4">
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            className="h-64 mb-12"
            preserveWhitespace={true}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
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
