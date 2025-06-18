import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageContentProps {
  content: string;
}

export default function MessageContent({ content }: MessageContentProps) {
  // Handle different summary request types
  if (content.startsWith("Summarize this")) {
    const summaryType = content.includes("note:")
      ? "note"
      : content.includes("task:")
      ? "task"
      : content.includes("flashcard set:")
      ? "flashcard set"
      : null;

    if (summaryType) {
      return (
        <div className="space-y-2">
          <p className="font-semibold">Summarize {summaryType}:</p>
          <div className="pl-2 border-l-2 border-current space-y-1">
            {summaryType === "note" &&
              // Handle note summary
              parseNoteSummary(content)}
            {summaryType === "task" &&
              // Handle task summary
              parseTaskSummary(content)}
            {summaryType === "flashcard set" &&
              // Handle flashcard set summary
              parseFlashcardSummary(content)}
          </div>
        </div>
      );
    }
  }

  // For regular messages, use markdown rendering
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc pl-4 space-y-1" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal pl-4 space-y-1" />
          ),
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-xl font-bold" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-lg font-bold" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-base font-bold" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Helper functions to parse different summary types
function parseNoteSummary(content: string) {
  const [, ...contentParts] = content.split("Title:");
  if (contentParts.length) {
    const [title, ...contentArr] = contentParts[0].split("Content:");
    const noteContent = contentArr.join("Content:").trim();

    return (
      <>
        <p className="font-medium">{title.trim()}</p>
        {noteContent && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {noteContent}
          </p>
        )}
      </>
    );
  }
  return null;
}

function parseTaskSummary(content: string) {
  const [, ...contentParts] = content.split("Title:");
  if (contentParts.length) {
    const parts = contentParts[0].split("\n").filter(Boolean);
    const taskDetails: Record<string, string> = {};

    parts.forEach((part) => {
      const [key, ...value] = part.split(":");
      if (key && value.length) {
        taskDetails[key.trim()] = value.join(":").trim();
      }
    });

    return (
      <>
        <p className="font-medium">{taskDetails["Title"]}</p>
        {taskDetails["Description"] && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {taskDetails["Description"]}
          </p>
        )}
        <div className="flex flex-wrap gap-2 text-xs">
          {taskDetails["Priority"] && (
            <span
              className={`px-2 py-0.5 rounded ${
                taskDetails["Priority"] === "high"
                  ? "bg-red-100 text-red-800"
                  : taskDetails["Priority"] === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {taskDetails["Priority"]}
            </span>
          )}
          {taskDetails["Due Date"] && (
            <span className="text-gray-600 dark:text-gray-400">
              Due: {taskDetails["Due Date"]}
            </span>
          )}
        </div>
      </>
    );
  }
  return null;
}

function parseFlashcardSummary(content: string) {
  const [, ...contentParts] = content.split("Title:");
  if (contentParts.length) {
    const [title, ...cardsContent] = contentParts[0].split("Cards:");
    const cards = cardsContent.join("Cards:").trim();

    return (
      <>
        <p className="font-medium">{title.trim()}</p>
        {cards && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="italic">Contains flashcards data</p>
          </div>
        )}
      </>
    );
  }
  return null;
}
