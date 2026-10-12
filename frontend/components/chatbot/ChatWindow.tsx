import { Bot, Sparkles, X } from "lucide-react";
import { type ReactNode } from "react";
import { ChatInput } from "./ChatInput";

export type ChatWindowProps = {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
};

/**
 * Dedicated ChatWindow modal / panel for full chatbot conversations.
 */
export function ChatWindow({
  isOpen,
  onClose,
  children,
  className = "",
}: ChatWindowProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 flex h-[32rem] w-96 flex-col overflow-hidden rounded-2xl border border-surface-border bg-white shadow-elevated ${className}`}
      role="dialog"
      aria-label="TrustPK AI Chat Window"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border bg-gradient-to-r from-navy via-navy-800 to-brand-700 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
            <Bot className="h-4 w-4 text-brand-200" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">TrustPK Assistant</h3>
            <p className="text-[11px] text-white/70">Always here to help</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat window"
          className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {children || (
          <div className="rounded-xl bg-page p-3 text-center text-xs text-ink-muted">
            <Sparkles className="mx-auto mb-1 h-4 w-4 text-brand-600" />
            Ask any question about universities, government schemes, or scholarships.
          </div>
        )}
      </div>

      {/* Footer input */}
      <div className="border-t border-surface-border p-3">
        <ChatInput />
      </div>
    </div>
  );
}
