"use client";

import { useChat } from "@ai-sdk/react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase/database.type";
import { IoArrowUp } from "react-icons/io5";
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
  // vercel supabase sdk
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  // supabase client
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // get user from supabase
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [user, supabase.auth]);

  const renderMessageContent = (message: (typeof messages)[0]) => {
    return message.parts.map((part, i) => {
      if (part.type === "text") {
        // Convert markdown to HTML and sanitize it
        const html = marked(part.text) as string;
        const sanitizedHTML = DOMPurify.sanitize(html);
        return (
          <div
            key={`${message.id}-${i}`}
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        );
      }
      return null;
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="py-4 text-center text-2xl font-bold">
        Helo {username}{" "}
      </div>

      <div className="overflow-y-auto">
        <div className="mx-auto w-[800px] p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 whitespace-pre-wrap ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div className="font-semibold">
                {message.role === "user" ? "You: " : "AI: "}
              </div>
              {renderMessageContent(message)}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto w-[800px] pb-6">
        <div className="w-full rounded-2xl bg-gray-100 px-3 py-2.5">
          <textarea
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
                  handleSubmit(e as unknown as React.FormEvent);
                }
              }
            }}
            rows={2}
            className="max-h-[200px] w-full resize-none bg-transparent focus:outline-none"
          />
          <div className="flex w-full items-center justify-end bg-transparent">
            <button
              disabled={input.trim() === ""}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-blue-500 p-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IoArrowUp size={24} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
