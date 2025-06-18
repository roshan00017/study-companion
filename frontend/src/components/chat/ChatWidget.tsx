import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatBubbleOvalLeftEllipsisIcon as ChatIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import api from "../../services/api";

import SelectionModal from "./SelectionModal";
import MessageContent from "./MessageContent";
import type {
  Message,
  QuickPrompt,
  SelectableItem,
} from "../../types/chat.type";
import { chatStorage } from "../../services/chat-storage";
import CardModal from "../flashCards/CardModal";
import TaskModal from "../task/TaskModal";
import NoteModal from "../notes/NoteModal";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSelection, setShowSelection] = useState<{
    type: "notes" | "tasks" | "flashcards";
    items: SelectableItem[];
  } | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const location = useLocation();
  const chatPath = location.pathname;
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [inputModal, setInputModal] = useState<{
    type: "note" | "task" | "flashcard";
    title: string;
    topic: string;
    setId?: string;
  } | null>(null);
const [pendingSetId, setPendingSetId] = useState<string | null>(null);
  useEffect(() => {
    const savedMessages = chatStorage.getChats(chatPath);
    setMessages(savedMessages);
  }, [chatPath]);

  useEffect(() => {
    chatStorage.saveChats(chatPath, messages);
  }, [messages, chatPath]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleGenerateContent = async (type: string, topic: string,setId?: string) => {
    try {
      setLoading(true);
      const response = await api.post(`/ai/generate/${type}`, { topic,setId });
      const generatedData = response.data.data;

      // Map the data according to type
      const modalContent = {
        type,
        data:
          type === "note"
            ? {
                title: generatedData.title,
                content: generatedData.content,
                taskId: generatedData.taskId,
              }
            : type === "task"
            ? {
                title: generatedData.title,
                description: generatedData.description,
                priority: generatedData.priority || "medium",
                dueDate: generatedData.dueDate,
                subtasks: generatedData.subtasks || [],
              }
            : type === "flashcard"
            ? {
                setId: generatedData.setId,
                cards: generatedData.cards || [],
              }
            : null,
      };
      setGeneratedContent(modalContent);
      // Add these lines to show the appropriate modal
      switch (type) {
        case "note":
          setShowNoteModal(true);
          break;
        case "task":
          setShowTaskModal(true);
          break;
        case "flashcard":
          setShowCardModal(false);
          break;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've generated a ${type} about "${topic}". You can review and edit it now.`,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error while generating content.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  const getSection = (): "notes" | "tasks" | "flashcards" => {
    if (location.pathname.includes("notes")) return "notes";
    if (location.pathname.includes("tasks")) return "tasks";
    if (location.pathname.includes("flashcards")) return "flashcards";
    // Default to "notes" or any valid section if none matches
    return "notes";
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const send = async (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/query", {
        section: getSection(),
        message: content,
      });

      const reply: Message = {
        role: "assistant",
        content: res.data.data.response || "Sorry, I didn't get that.",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to get response from AI." },
      ]);
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    const section = getSection();
    try {
      let items: SelectableItem[] = [];
      switch (section) {
        case "notes":
          const notesRes = await api.get("/notes");
          items = notesRes.data.data;
          break;
        case "tasks":
          const tasksRes = await api.get("/tasks");
          items = tasksRes.data.data;
          break;
        case "flashcards":
          const setsRes = await api.get("/flashcards/sets");
          items = setsRes.data.data;
          break;
      }
      setShowSelection({ type: section, items });
    } catch (err) {
      console.error("Failed to load items:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Failed to load items for summarization.",
        },
      ]);
    }
  };

  const handleItemSelect = async (item: SelectableItem) => {
    setShowSelection(null);
    const section = getSection();

    // If in flashcards section and no pendingSetId, this is for card creation
  if (section === "flashcards" && !pendingSetId && inputModal === null) {
    setPendingSetId(item._id);
    setInputModal({
      type: "flashcard",
      title: `Enter topic for "${item.title}"`,
      topic: "",
      setId: item._id,
    });
    return;
  }
    let prompt = "";

    switch (section) {
      case "notes":
        const plainContent = stripHtml(item.content || "");
        prompt = `Summarize this note:\nTitle: ${item.title}\nContent: ${plainContent}`;
        break;
      case "tasks":
        prompt = `Summarize this task:\nTitle: ${item.title}\nDescription: ${
          item.description || ""
        }\nPriority: ${item.priority || "Not set"}\nDue Date: ${
          item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "Not set"
        }`;
        break;
      case "flashcards":
        try {
          const cardsRes = await api.get(`/flashcards/sets/${item._id}/cards`);
          const cards = cardsRes.data.data;
          const formattedCards = cards.map((card: any) => ({
            question: stripHtml(card.question),
            answer: stripHtml(card.answer),
          }));
          prompt = `Summarize this flashcard set:\nTitle: ${
            item.title
          }\nCards:\n${JSON.stringify(formattedCards, null, 2)}`;
        } catch (err) {
          console.error("Failed to fetch flashcards:", err);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "⚠️ Failed to load flashcards for summarization.",
            },
          ]);
          return;
        }
        break;
    }

    send(prompt);
  };

  const quickPrompts = (): QuickPrompt[] => {
    const section = getSection();
    if (section === "notes") {
      return [
        {
          label: "📝 Create Note",
          action: () =>
            setInputModal({
              type: "note",
              title: "Create New Note",
              topic: "",
            }),
        },
        {
          label: "📄 Summarize",
          action: handleSummarize,
        },
      ];
    }
    if (section === "tasks") {
      return [
        {
          label: "✅ Create Task",
          action: () =>
            setInputModal({
              type: "task",
              title: "Create New Task",
              topic: "",
            }),
        },
        {
          label: "📋 Summarize",
          action: handleSummarize,
        },
      ];
    }
    if (section === "flashcards") {
      return [
           {
        label: "📚 Create Cards",
        action: async () => {
          // Fetch sets and show selection modal
          try {
            const setsRes = await api.get("/flashcards/sets");
            setShowSelection({ type: "flashcards", items: setsRes.data.data });
          } catch (err) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: "⚠️ Failed to load flashcard sets.",
              },
            ]);
          }
        },
      },
        {
          label: "🔍 Summarize",
          action: handleSummarize,
        },
      ];
    }
    return [
      { label: "💡 Study Tips", text: "Give me study tips" },
      { label: "📚 Learning Plan", text: "Help me create a learning plan" },
    ];
  };
const handleInputSubmit = async (topic: string) => {
  if (!inputModal) return;

  setInputModal(null);

  if (inputModal.type === "flashcard" && pendingSetId) {
    await handleGenerateContent("flashcard", topic, pendingSetId);
    setPendingSetId(null);
  } else {
    await handleGenerateContent(inputModal.type, topic);
  }
};
  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 
            rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 
            flex items-center justify-center"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <ChatIcon className="h-6 w-6" />
          )}
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 
              rounded-xl shadow-xl flex flex-col overflow-hidden z-50 border
              dark:border-gray-700"
          >
            <div
              className="p-3 border-b dark:border-gray-700 flex flex-wrap gap-2 
              bg-gray-50 dark:bg-gray-800"
            >
              {quickPrompts().map((prompt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm bg-white dark:bg-gray-700 hover:bg-gray-50 
                    dark:hover:bg-gray-600 px-3 py-1.5 rounded-lg shadow-sm 
                    border border-gray-200 dark:border-gray-600 transition-colors
                    text-gray-700 dark:text-gray-200"
                  onClick={() => {
                    if (prompt.action) {
                      prompt.action();
                    } else if (prompt.text) {
                      send(prompt.text);
                    }
                  }}
                >
                  {prompt.label}
                </motion.button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
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

            <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex gap-2">
                <input
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 
                    dark:border-gray-700 bg-white dark:bg-gray-700
                    text-gray-800 dark:text-gray-200 
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-all duration-200"
                  placeholder="Ask me something..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => send()}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700
                    text-white rounded-xl shadow-sm hover:shadow-md
                    transition-all duration-200 disabled:opacity-50
                    flex items-center justify-center"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSelection && (
          <SelectionModal
            type={showSelection.type}
            items={showSelection.items}
            onSelect={handleItemSelect}
            onClose={() => setShowSelection(null)}
          />
        )}
      </AnimatePresence>

      {showNoteModal && generatedContent?.type === "note" && (
        <NoteModal
          initial={generatedContent.data}
          onClose={() => {
            setShowNoteModal(false);
            setGeneratedContent(null);
          }}
          onSubmit={async (data) => {
            try {
              const res = await api.post("/notes", data);
              const newNote = res.data.data;

              // Emit event with the complete note data
              window.dispatchEvent(
                new CustomEvent("noteCreated", {
                  detail: newNote,
                })
              );

              setShowNoteModal(false);
              setGeneratedContent(null);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "✅ Note created successfully!",
                },
              ]);
            } catch (err) {
              console.error("Failed to create note:", err);
            }
          }}
        />
      )}

      {showTaskModal && generatedContent?.type === "task" && (
        <TaskModal
          initial={generatedContent.data}
          onClose={() => {
            setShowTaskModal(false);
            setGeneratedContent(null);
          }}
          onSubmit={async (data) => {
            try {
              const res = await api.post("/tasks", data);
              // Emit a custom event
              window.dispatchEvent(
                new CustomEvent("taskCreated", {
                  detail: res.data.data,
                })
              );

              setShowTaskModal(false);
              setGeneratedContent(null);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "✅ Task created successfully!",
                },
              ]);
            } catch (err) {
              console.error("Failed to create task:", err);
            }
          }}
        />
      )}

      {showCardModal && generatedContent?.type === "flashcard" && (
        <CardModal
          initial={generatedContent.data}
          onClose={() => {
            setShowCardModal(false);
            setGeneratedContent(null);
          }}
          onSubmit={async (data) => {
            try {
              const res = await api.post("/flashcards/cards", data);
              // Emit a custom event
              window.dispatchEvent(
                new CustomEvent("flashcardCreated", {
                  detail: res.data.data,
                })
              );

              setShowCardModal(false);
              setGeneratedContent(null);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "✅ Flashcards created successfully!",
                },
              ]);
            } catch (err) {
              console.error("Failed to create flashcards:", err);
            }
          }}
        />
      )}
      <AnimatePresence>
        {inputModal && (
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
                onChange={(e) =>
                  setInputModal({
                    ...inputModal,
                    topic: e.target.value,
                  })
                }
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 
                dark:border-gray-700 bg-white dark:bg-gray-700
                text-gray-800 dark:text-gray-200 mb-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputModal.topic) {
                    handleInputSubmit(inputModal.topic);
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setInputModal(null)}
                  className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400
                  hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleInputSubmit(inputModal.topic)}
                  disabled={!inputModal.topic}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white
                  disabled:opacity-50 hover:bg-blue-700"
                >
                  Generate
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
