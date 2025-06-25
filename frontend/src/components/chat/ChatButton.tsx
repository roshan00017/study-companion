import { motion } from "framer-motion";
import {
  ChatBubbleOvalLeftEllipsisIcon as ChatIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 \
          rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 \
          flex items-center justify-center"
        onClick={onClick}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatIcon className="h-6 w-6" />
        )}
      </button>
    </motion.div>
  );
}
