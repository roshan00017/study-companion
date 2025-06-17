import { useState } from "react";

interface Props {
  onClose: () => void;
  onSubmit: (data: { question: string; answer: string }) => void;
}

export default function CardModal({ onClose, onSubmit }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">New Flashcard</h2>
        <input
          className="w-full p-2 border rounded mb-2"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Answer"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => onSubmit({ question, answer })}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
