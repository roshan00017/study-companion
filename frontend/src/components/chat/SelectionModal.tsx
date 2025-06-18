import { motion } from "framer-motion";
import type { SelectableItem } from "../../types/chat.type";


interface SelectionModalProps {
  type: "notes" | "tasks" | "flashcards";
  items: SelectableItem[];
  onSelect: (item: SelectableItem) => void;
  onClose: () => void;
}

export default function SelectionModal({
  type,
  items,
  onSelect,
  onClose,
}: SelectionModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">
          Select {type.charAt(0).toUpperCase() + type.slice(1)} to Summarize
        </h3>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item._id}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700
                hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <h4 className="font-medium">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {item.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
