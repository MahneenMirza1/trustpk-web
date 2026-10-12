import { Bot } from "lucide-react";
import Link from "next/link";

export type ChatbotButtonProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Floating / launcher button for the TrustPK Chatbot.
 */
export function ChatbotButton({
  href = "/ai",
  onClick,
  className = "",
}: ChatbotButtonProps) {
  const content = (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-elevated transition-transform duration-200 hover:scale-105 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-200">
      <Bot className="h-7 w-7" aria-hidden />
      <span className="sr-only">Open TrustPK AI Chatbot</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={`fixed bottom-6 right-6 z-40 ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 ${className}`}
    >
      {content}
    </button>
  );
}
