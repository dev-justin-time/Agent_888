"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Phone, ShieldAlert, Info } from "lucide-react";
import { EXPERT_TOPIC_MAP, EXPERT_TOPICS } from "@/lib/constants";
import { ExpertIcon } from "@/components/experts/ExpertIcon";
import { GlassCard } from "@/components/ui/GlassCard";
import TopQuestions from "@/components/experts/TopQuestions";
import { TOP_CALLS_BY_EXPERT } from "@/data/top-calls";
import { cn } from "@/lib/utils";
import {
  ChatComposer,
  MessageBubble,
  PromptChips,
  TypingBubble,
  useAutoScroll,
} from "@/components/chat/ChatUI";

interface Message {
  role: "user" | "expert";
  text: string;
  urgent?: boolean;
}

export default function ExpertChatPage() {
  const params = useParams<{ topic: string }>();
  const topicId = Array.isArray(params?.topic) ? params.topic[0] : params?.topic;
  const topic = topicId ? EXPERT_TOPIC_MAP[topicId] : undefined;
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const sentQ = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUrgent, setHasUrgent] = useState(false);
  const endRef = useAutoScroll([messages, isLoading]);

  useEffect(() => {
    if (topic) {
      setMessages([
        {
          role: "expert",
          text: `Hey. 💙 I'm Luma's ${topic.label} guide. This stays completely private and anonymous — nothing here is stored. What would you like to think through?`,
        },
      ]);
      setHasUrgent(false);
      setInput("");
    }
  }, [topicId, topic]);

  // Auto-send a question from the Question Library (?q=…).
  useEffect(() => {
    if (topic && q && !sentQ.current) {
      sentQ.current = true;
      const timer = setTimeout(() => handleSend(q), 250);
      return () => clearTimeout(timer);
    }
    // handleSend is recreated each render; only fire once the topic is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, q]);

  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16 space-y-6">
        <ShieldAlert className="mx-auto text-error" size={40} />
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          That expert isn&apos;t here
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          The topic you picked doesn&apos;t exist. Let&apos;s get you back to the full list.
        </p>
        <Link
          href="/experts"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-headline-md text-sm font-medium active:scale-95 transition-transform"
        >
          <ArrowLeft size={16} /> All experts
        </Link>
      </div>
    );
  }

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/expert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicId, message: userMsg }),
      });
      const data = await res.json();

      if (data.status === "success" && data.response) {
        const urgent = data.priority === "URGENT_SAFETY_PROTOCOL";
        if (urgent) setHasUrgent(true);
        setMessages((prev) => [
          ...prev,
          { role: "expert", text: data.response, urgent },
        ]);
        // Redirect only when the expert's answer explicitly signals resources
        // (marker-driven, same as the Navigate chat) — never on raw keywords.
        if (data.route_to_resources && data.response.includes("[ROUTE_TO_RESOURCES]") && !urgent) {
          router.push("/resources");
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "expert",
            text: data.message || "I'm having trouble hearing you. Can you try again?",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "expert",
          text: "I couldn't reach the guide right now. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back + expert header */}
      <div className="space-y-4">
        <Link
          href="/experts"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> All experts
        </Link>

        <GlassCard hover={false} className="p-6">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
              <ExpertIcon icon={topic.icon} className="text-primary" size={28} />
            </span>
            <div>
              <h2 className="font-headline-md text-headline-md text-primary font-semibold">
                {topic.label}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                {topic.tagline}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {EXPERT_TOPICS.map((other) => (
              <button
                key={other.id}
                onClick={() => router.push(`/experts/${other.id}`)}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 transition-colors border",
                  other.id === topic.id
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/30"
                )}
              >
                <ExpertIcon icon={other.icon} size={12} />
                {other.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-on-surface-variant/80">
            <Info size={14} className="text-secondary flex-shrink-0 mt-0.5" />
            <p>
              {topic.label} guidance is educational. For serious or urgent matters, a
              qualified human should be involved — Luma will point you to resources when
              it matters.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Chat */}
      <div className="flex flex-col h-[calc(100dvh-430px)] min-h-[320px] max-h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              role={msg.role === "user" ? "user" : "assistant"}
              text={msg.text}
              urgent={msg.urgent}
            />
          ))}

          {isLoading && <TypingBubble />}

          {/* Searchable library of the 50 most common questions for this expert */}
          {messages.length <= 1 && !isLoading && (
            <TopQuestions
              calls={TOP_CALLS_BY_EXPERT[topic.id] ?? []}
              onSelect={handleSend}
              title={`50 most common ${topic.label.toLowerCase()} questions`}
              placeholder={`Search ${topic.label.toLowerCase()} questions…`}
            />
          )}
          <div ref={endRef} />
        </div>

        {/* Urgent strip */}
        {hasUrgent && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-error/10 border border-error/30">
        <p className="text-sm text-error font-medium">
          💙 Please reach a human right now. You matter. The message above lists
          numbers for your region.
        </p>
        <a
          href="tel:988"
          className="inline-flex items-center gap-2 bg-error text-on-error px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
        >
          <Phone size={16} /> Call 988 (US)
        </a>
          </div>
        )}

        {/* Suggested prompts */}
        {messages.length <= 1 && !isLoading && (
          <PromptChips prompts={topic.prompts} onSelect={handleSend} />
        )}

        <ChatComposer
          value={input}
          onChange={setInput}
          onSubmit={() => handleSend()}
          placeholder={`Ask the ${topic.label.toLowerCase()} guide...`}
          busy={isLoading}
        />
      </div>
    </div>
  );
}
