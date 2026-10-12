import { Bot } from "lucide-react";
import { ChatPreview } from "@/components/chatbot/ChatPreview";
import { Button } from "@/components/common/Button";
import { Section, SectionHeading } from "@/components/common/Section";
import { homeCopy } from "@/lib/copy/home";

export function AISection() {
  return (
    <Section id="ai-preview" tone="white">
      <SectionHeading
        align="center"
        title={homeCopy.ai.heading}
        description={homeCopy.ai.subheading}
      />

      <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-brand-800/20 bg-gradient-to-br from-navy via-navy-800 to-brand-700 p-5 shadow-elevated sm:p-8 lg:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="text-white">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <Bot className="h-6 w-6 text-brand-200" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              Ask TrustPK
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              Ask questions about universities, jobs, scholarships, schemes, and
              trusted digital information — all from one assistant.
            </p>
            <div className="mt-7">
              <Button href="/ai" variant="white" size="lg" showArrow>
                {homeCopy.ai.cta}
              </Button>
            </div>
          </div>

          <ChatPreview />
        </div>
      </div>
    </Section>
  );
}
