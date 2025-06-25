import { useState } from "react";

interface Props {
  onSubmit: (data: { name: string; description?: string }) => void;
  onClose: () => void;
}

export default function StudyGroupModal({ onSubmit, onClose }: Props) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError("Group name is required");
      return;
    }
    onSubmit({ name: form.name.trim(), description: form.description.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create Study Group</h2>
        <input
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Group Name"
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Description (optional)"
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
