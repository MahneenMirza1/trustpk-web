"use client";

import {
  Bot,
  ExternalLink,
  Send,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { askUniversityAI } from "@/services/universityApi";
import type { AskAIResponse } from "@/types/university";

export type AskUniversityAIProps = {
  universityId: number;
  universityName: string;
  admissionPortalUrl?: string | null;
  className?: string;
};

const SUGGESTED_QUESTIONS = [
  "Can I apply with 72%?",
  "What is the merit formula?",
  "Do I need an entry test?",
  "Is this university recognized?",
  "What was the closing merit?",
];

export function AskUniversityAI({
  universityId,
  universityName,
  admissionPortalUrl,
  className = "",
}: AskUniversityAIProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AskAIResponse | null>(null);
  const [error, setError] = useState("");

  async function handleAsk(promptText?: string) {
    const q = (promptText || question).trim();
    if (!q) return;

    if (promptText) {
      setQuestion(promptText);
    }

    try {
      setLoading(true);
      setError("");
      const data = await askUniversityAI(universityId, q);
      setResponse(data);
    } catch (err) {
      console.error("Ask AI error:", err);
      setError(
        "Unable to complete AI query right now. Please refer to official sources."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      className={`border-2 border-brand-500/30 bg-gradient-to-br from-brand-50/40 via-white to-white p-6 sm:p-8 ${className}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-surface-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-navy to-brand-700 text-white shadow-soft">
            <Bot className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy">Still confused?</h2>
            <p className="text-xs sm:text-sm text-ink-muted">
              Ask TrustPK AI about {universityName} admission criteria and merit.
            </p>
          </div>
        </div>

        <span className="hidden items-center gap-1 rounded-full bg-brand-100/70 px-2.5 py-1 text-[11px] font-semibold text-brand-800 sm:inline-flex">
          <Sparkles className="h-3 w-3" /> Grounded in Verified Data
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {/* Suggested Quick Question Chips */}
        <div>
          <span className="text-xs font-semibold text-ink-subtle">
            Suggested questions:
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAsk(q)}
                className="rounded-lg border border-surface-border bg-white px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Ask a question about eligibility, aggregate, entry tests..."
            className="flex-1 rounded-xl border border-surface-border bg-page px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />

          <Button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="px-5"
          >
            {loading ? (
              "Checking..."
            ) : (
              <>
                <span>Ask AI</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>

        {error && <p className="text-xs font-semibold text-danger">{error}</p>}

        {/* AI Answer Box */}
        {response && (
          <div className="mt-4 rounded-xl border border-brand-200 bg-white p-5 shadow-soft animate-fade-in text-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-navy">
              <Bot className="h-4 w-4 text-brand-600" />
              <span>TrustPK Assistant</span>
            </div>

            <div className="mt-2.5 whitespace-pre-line leading-relaxed text-ink">
              {response.answer}
            </div>

            {/* Citations & Official Link */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border/70 pt-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink-subtle">Citations:</span>
                {response.citations.map((c, i) => (
                  <a
                    key={i}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-surface-muted px-2 py-0.5 text-brand-700 hover:underline"
                  >
                    {c.title} <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ))}
              </div>

              {(response.official_portal_url || admissionPortalUrl) && (
                <a
                  href={response.official_portal_url || admissionPortalUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-700 hover:underline"
                >
                  Official Admission Portal →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
