import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface Props {
  title: string;
  content: string;
  onClose: () => void;
}

export default function ViewNoteModal({ title, content, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white w-full max-w-3xl rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div
            className="ql-editor !p-0 !overflow-visible prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
