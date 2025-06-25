import { motion } from "framer-motion";
import type { QuickPrompt } from "../../types/chat.type";

interface ChatQuickPromptsProps {
  prompts: QuickPrompt[];
  onPrompt: (prompt: QuickPrompt) => void;
}

export default function ChatQuickPrompts({ prompts, onPrompt }: ChatQuickPromptsProps) {
  return (
    <div className="p-3 border-b dark:border-gray-700 flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800">
      {prompts.map((prompt, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 \
            dark:hover:bg-gray-600 px-3 py-1.5 rounded-lg shadow-sm \
            border border-gray-200 dark:border-gray-600 transition-colors\
            text-gray-700 dark:text-gray-200"
          onClick={() => onPrompt(prompt)}
        >
          {prompt.label}
        </motion.button>
      ))}
    </div>
  );
}
