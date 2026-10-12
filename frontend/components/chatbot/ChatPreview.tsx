import { Sparkles } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export type ChatPreviewProps = {
  className?: string;
};

export function ChatPreview({ className = "" }: ChatPreviewProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white p-4 shadow-elevated sm:p-5 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between border-b border-surface-border pb-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold text-ink">TrustPK AI</p>
        </div>
        <span className="text-brand-500" aria-hidden>
          ✦
        </span>
      </div>

      <div className="space-y-3">
        <ChatMessage role="user">
          Which universities offer BSCS in Lahore?
        </ChatMessage>
        <ChatMessage role="assistant">
          I found several universities offering BSCS programs. You can compare
          programs, admission requirements and merit information.
        </ChatMessage>
      </div>

      <div className="mt-4">
        <ChatInput />
      </div>

      <p className="mt-3 text-xs text-ink-subtle">
        Visual preview only — AI responses will connect in a later module.
      </p>
    </div>
  );
}
