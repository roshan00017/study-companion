import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatButton from "./ChatButton";
import api from "../../services/api";
import SelectionModal from "./SelectionModal";
import ChatQuickPrompts from "./ChatQuickPrompts";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import InputTopicModal from "./InputTopicModal";
import type {
  Message,
  QuickPrompt,
  SelectableItem,
} from "../../types/chat.type";
import { chatStorage } from "../../services/chat-storage";
import CardModal from "../flashCards/CardModal";
import TaskModal from "../task/TaskModal";
import NoteModal from "../notes/NoteModal";
import { useDispatch } from "react-redux";
import { addNote } from "../../store/notesSlice";

// --- ChatWidget Component ---
export default function ChatWidget() {
  // --- Redux ---
  const dispatch = useDispatch();

  // --- State ---
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal and selection state
  const [showSelection, setShowSelection] = useState<{
    type: "notes" | "tasks" | "flashcards";
    items: SelectableItem[];
  } | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  // Input modal for topic/set selection
  const [inputModal, setInputModal] = useState<{
    type: "note" | "task" | "flashcard";
    title: string;
    topic: string;
    setId?: string;
  } | null>(null);
  const [pendingSetId, setPendingSetId] = useState<string | null>(null);

  // --- Refs and location ---
  const location = useLocation();
  const chatPath = location.pathname;
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
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

  // --- Utility Functions ---
  const getSection = (): "notes" | "tasks" | "flashcards" => {
    if (location.pathname.includes("notes")) return "notes";
    if (location.pathname.includes("tasks")) return "tasks";
    if (location.pathname.includes("flashcards")) return "flashcards";
    return "notes";
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // --- Chat/AI Functions ---
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

  const handleGenerateContent = async (
    type: string,
    topic: string,
    setId?: string
  ) => {
    try {
      setLoading(true);
      const response = await api.post(`/ai/generate/${type}`, { topic, setId });
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

      // Show the appropriate modal
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

  // --- Summarize and Selection ---
  const handleSummarize = async () => {
    const section = getSection();
    try {
      let items: SelectableItem[] = [];
      switch (section) {
        case "notes":
          items = (await api.get("/notes")).data.data;
          break;
        case "tasks":
          items = (await api.get("/tasks")).data.data;
          break;
        case "flashcards":
          items = (await api.get("/flashcards/sets")).data.data;
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
        prompt = `Summarize this note:\nTitle: ${item.title}\nContent: ${stripHtml(
          item.content || ""
        )}`;
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

  // --- Quick Prompts ---
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

  // --- Input Modal Submit ---
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

  // --- Render ---
  return (
    <>
      {/* Floating Chat Button */}
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />

      {/* Chat Modal */}
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
            {/* Quick Prompts */}
            <ChatQuickPrompts
              prompts={quickPrompts()}
              onPrompt={(prompt) => {
                if (prompt.action) {
                  prompt.action();
                } else if (prompt.text) {
                  send(prompt.text);
                }
              }}
            />

            {/* Messages */}
            <ChatMessages messages={messages} loading={loading} chatEndRef={chatEndRef} />

            {/* Input */}
            <div className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
              <ChatInput
                input={input}
                loading={loading}
                onInputChange={(e) => setInput(e.target.value)}
                onSend={() => send()}
                onInputKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Modal */}
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

      {/* Note Modal */}
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

              // Update Redux store with the new note
              dispatch(addNote(newNote));
             
              setShowNoteModal(false);
              setGeneratedContent(null);
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "✅ Note created successfully!" },
              ]);
            } catch (err) {
              console.error("Failed to create note:", err);
            }
          }}
        />
      )}

      {/* Task Modal */}
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
                { role: "assistant", content: "✅ Task created successfully!" },
              ]);
            } catch (err) {
              console.error("Failed to create task:", err);
            }
          }}
        />
      )}

      {/* Flashcard Modal */}
      {showCardModal && generatedContent?.type === "flashcard" && (
        <CardModal
          initial={generatedContent.data}
          onClose={() => {
            setShowCardModal(false);
            setGeneratedContent(null);
          }}
          onSubmit={async (data) => {
            try {
             
              window.dispatchEvent(
                new CustomEvent("flashcardCreated", { detail: data })
              );
              setShowCardModal(false);
              setGeneratedContent(null);
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "✅ Flashcards created successfully!" },
              ]);
            } catch (err) {
              console.error("Failed to create flashcards:", err);
            }
          }}
        />
      )}

      {/* Input Modal for topic */}
      <AnimatePresence>
        {inputModal && (
          <InputTopicModal
            inputModal={inputModal}
            onChange={(topic) => setInputModal({ ...inputModal, topic })}
            onClose={() => setInputModal(null)}
            onSubmit={handleInputSubmit}
          />
        )}
      </AnimatePresence>
    </>
  );
}