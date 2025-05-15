"use client";

import { useChat } from "@ai-sdk/react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Database } from "@/utils/supabase/database.type";
import { IoArrowUp } from "react-icons/io5";
import { useRef, useEffect, useState } from "react";
// Configure marked to be more secure
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // GitHub Flavored Markdown
});

export default function Chat({
  username,
}: {
  username?: Database["public"]["Tables"]["user_profile"]["Row"]["username"];
}) {
  // vercel AI sdk
  const { stop, messages, input, handleInputChange, handleSubmit, status } =
    useChat({
      api: "/api/chat",
    });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Scroll on new messages or streaming status change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current && shouldAutoScroll) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" });
      }
    };

    if (status === "streaming" || status === "submitted") {
      scrollToBottom();
    }
  }, [messages, status, shouldAutoScroll]);

  // Reset auto-scroll when streaming ends
  useEffect(() => {
    if (status === "ready") {
      setShouldAutoScroll(true);
    }
  }, [status]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;

    setShouldAutoScroll(isAtBottom);
  };

  const handleSubmitWithReset = (e: React.FormEvent) => {
    handleSubmit(e);
    // Reset textarea height after submission
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const renderMessageContent = (message: (typeof messages)[0]) => {
    return message.parts.map((part, i) => {
      if (part.type === "text") {
        // Convert markdown to HTML and sanitize it
        const html = marked(part.text) as string;
        const sanitizedHTML = DOMPurify.sanitize(html);
        console.log(sanitizedHTML);
        return (
          <div
            key={`${message.id}-${i}`}
            className="prose break-words"
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        );
      }
      return null;
    });
  };

  return (
    <div className="bg-clrWhite flex h-full w-full items-center justify-center">
      {/* Inner container including chat and input */}
      <div
        className={`flex h-full w-[900px] flex-col items-center ${messages.length > 0 ? "justify-between" : "justify-center"}`}
      >
        {messages.length === 0 ? (
          <div className="w-full py-4 text-center text-2xl font-semibold">
            <h2>Hello {username}, I am your law assistant</h2>
            <p className="mt-2 text-base font-normal text-gray-500">
              How can I help you today?
            </p>
          </div>
        ) : (
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="w-full overflow-y-auto px-4"
          >
            <div className="mx-auto flex flex-col pt-4">
              {messages.map((message) =>
                message.role === "user" ? (
                  //user message
                  <div
                    key={message.id}
                    className="mb-4 w-fit max-w-[770px] self-end overflow-hidden rounded-xl bg-blue-50 px-5 py-2 break-words whitespace-pre-wrap"
                  >
                    {message.parts.map((part) => {
                      if (part.type === "text") {
                        return part.text;
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  //AI message
                  <div key={message.id} className="flex">
                    <div className="pt-2 text-xl font-semibold">AI: </div>
                    <div className="mb-4 max-w-[870px] self-start overflow-hidden px-5 pt-2 whitespace-pre-wrap">
                      {renderMessageContent(message)}
                    </div>
                  </div>
                ),
              )}
              {/* Loading spinner when submitted but not streaming */}
              {status === "submitted" && (
                <div className="mb-4 flex items-center gap-2 pt-2">
                  <div className="text-xl font-semibold">AI:</div>
                  <div className="mx-5 h-5 w-5 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitWithReset} className="mx-auto w-full pb-6">
          <div className="w-full rounded-2xl bg-gray-100 px-3 py-2.5">
            <textarea
              ref={textareaRef}
              value={input}
              placeholder="Say something... (Shift + Enter to new line)"
              onChange={(e) => {
                handleInputChange(e);
                // make textarea auto resize
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                // Make pressing enter to submit instead of default new line
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() !== "") {
                    handleSubmitWithReset(e as unknown as React.FormEvent);
                  }
                }
              }}
              rows={2}
              className="max-h-[200px] w-full resize-none bg-transparent focus:outline-none"
            />
            <div className="flex w-full items-center justify-end bg-transparent">
              {status === "submitted" || status === "streaming" ? (
                <button
                  type="button"
                  onClick={stop}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-red-500 p-2.5 text-white hover:bg-red-600"
                >
                  <div className="bg-clrWhite h-3 w-3 rounded-xs" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={input.trim() === ""}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-500 p-1 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IoArrowUp size={24} />
                </button>
              )}
            </div>
          </div>
          {status === "error" && (
            <p className="mt-4 text-red-500">
              An error occurred. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
