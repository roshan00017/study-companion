import { AnimatePresence, motion } from "framer-motion";
import MessageContent from "./MessageContent";
import type { Message } from "../../types/chat.type";
import type { RefObject }  from "react";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
 chatEndRef: RefObject<HTMLDivElement | null>
}

export default function ChatMessages({ messages, loading, chatEndRef }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
      <AnimatePresence>
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`inline-block max-w-[80%] px-4 py-2 rounded-xl
                ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
            >
              <MessageContent content={m.content} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 italic px-4"
        >
          Thinking...
        </motion.p>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}
