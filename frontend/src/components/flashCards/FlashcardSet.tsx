
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import type { FlashcardSet } from "../../types/flashcard.type";

interface Props {
  set: FlashcardSet;
  onDelete: () => void;
}

export default function FlashcardSetCard({ set, onDelete }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col p-4 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{set.title}</h3>

      {set.description && (
        <p className="text-gray-600 text-sm flex-grow">{set.description}</p>
      )}

      <div className="flex gap-3 justify-end mt-4">
        <Link
          to={`/dashboard/flashcards/${set._id}`}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <EyeIcon className="h-4 w-4" />
          View Cards
        </Link>
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
