import { type ReactNode } from "react";

export type ChatMessageProps = {
  role: "user" | "assistant";
  children: ReactNode;
  className?: string;
};

export function ChatMessage({
  role,
  children,
  className = "",
}: ChatMessageProps) {
  if (role === "user") {
    return (
      <div
        className={`ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2.5 text-sm text-white ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`max-w-[90%] rounded-2xl rounded-bl-md bg-page px-3.5 py-2.5 text-sm leading-relaxed text-ink ${className}`}
    >
      {children}
    </div>
  );
}
