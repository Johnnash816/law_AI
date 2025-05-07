"use client";

import { useChat } from "@ai-sdk/react";
import { TextField } from "@mui/material";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked to be more secure
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // GitHub Flavored Markdown
});

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

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
    <div className="flex h-screen w-full flex-col">
      <div className="py-4 text-center text-2xl font-bold">Title</div>

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
        <TextField
          fullWidth
          placeholder="Say something..."
          onChange={handleInputChange}
          value={input}
          id="filled-basic"
          label="Message"
          variant="filled"
        />
      </form>
    </div>
  );
}
