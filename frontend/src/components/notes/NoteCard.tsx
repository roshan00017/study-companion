
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  title: string;
  content: string;
  onDelete: () => void;
  onEdit: () => void;
  onView: () => void;
}

export default function NoteCard({
  title,
  content,
  onDelete,
  onEdit,
  onView,
}: Props) {
  const getPlainText = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText;
  };

  const getPreviewText = (text: string, limit: number = 250) => {
    const plainText = getPlainText(text);
    if (plainText.length <= limit) return plainText;
    return plainText.substring(0, limit) + "...";
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-[150px] flex flex-col p-4 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
        {title}
      </h3>

      <div className="flex-grow overflow-hidden">
        <p className="text-gray-600 text-sm line-clamp-4">
          {getPreviewText(content)}
        </p>
      </div>

      <div className="flex gap-3 justify-end mt-2 w-full">
        <button
          onClick={onView}
          className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 transition-colors"
        >
          <EyeIcon className="h-4 w-4" />
          View
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <PencilIcon className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
