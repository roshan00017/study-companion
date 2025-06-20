import { motion } from "framer-motion";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import React from "react";

interface ChatInputProps {
  input: string;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function ChatInput({
  input,
  loading,
  onInputChange,
  onSend,
  onInputKeyDown,
}: ChatInputProps) {
  return (
    <div className="flex gap-2">
      <input
        className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 \
          dark:border-gray-700 bg-white dark:bg-gray-700\
          text-gray-800 dark:text-gray-200 \
          placeholder-gray-500 dark:placeholder-gray-400\
          focus:ring-2 focus:ring-blue-500 focus:border-transparent \
          transition-all duration-200"
        placeholder="Ask me something..."
        value={input}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSend}
        disabled={loading}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700\
          text-white rounded-xl shadow-sm hover:shadow-md\
          transition-all duration-200 disabled:opacity-50\
          flex items-center justify-center"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
