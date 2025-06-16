interface Props {
  title: string;
  content: string;
  onDelete: () => void;
  onEdit: () => void;
}

export default function NoteCard({ title, content, onDelete, onEdit }: Props) {
  return (
    <div className="bg-white shadow rounded p-4 relative">
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-gray-700 whitespace-pre-line">{content}</p>

      <div className="flex gap-2 mt-4 justify-end">
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
