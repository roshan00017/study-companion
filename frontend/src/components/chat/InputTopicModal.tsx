import { motion } from "framer-motion";
import React from "react";

interface InputTopicModalProps {
  inputModal: {
    type: "note" | "task" | "flashcard";
    title: string;
    topic: string;
    setId?: string;
  };
  onChange: (topic: string) => void;
  onClose: () => void;
  onSubmit: (topic: string) => void;
}

export default function InputTopicModal({ inputModal, onChange, onClose, onSubmit }: InputTopicModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {inputModal.title}
        </h3>
        <input
          type="text"
          placeholder="Enter topic..."
          value={inputModal.topic}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 \
            dark:border-gray-700 bg-black dark:bg-gray-700\
            text-gray-800 dark:text-gray-200 mb-4"
          onKeyDown={e => {
            if (e.key === "Enter" && inputModal.topic) {
              onSubmit(inputModal.topic);
            }
          }}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400\
              hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(inputModal.topic)}
            disabled={!inputModal.topic}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white\
              disabled:opacity-50 hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      </div>
    </motion.div>
  );
}
