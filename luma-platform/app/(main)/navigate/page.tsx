"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wind } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import TopQuestions from "@/components/experts/TopQuestions";
import { NAVIGATOR_TOP_CALLS } from "@/data/top-calls";
import {
  ChatComposer,
  MessageBubble,
  PromptChips,
  TypingBubble,
  useAutoScroll,
} from "@/components/chat/ChatUI";

interface Message {
  role: "user" | "luma";
  text: string;
}

const SUGGESTED_PROMPTS = [
  "I'm feeling overwhelmed by everything right now",
  "Help me ground myself in this moment",
  "I need help finding support resources",
];

export default function NavigatePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "luma",
      text: "Hey. 💙 I'm Luma. This is a completely private, anonymous space. Nothing you say here is stored. What's on your mind today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const endRef = useAutoScroll([messages]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const sentQ = useRef(false);

  // Auto-send a question from the Question Library (?q=…).
  useEffect(() => {
    if (q && !sentQ.current) {
      sentQ.current = true;
      const timer = setTimeout(() => handleSend(q), 250);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg = text.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      if (data.status === "success" && data.response) {
        setMessages((prev) => [...prev, { role: "luma", text: data.response }]);

        if (data.route_to_resources) {
          router.push("/resources");
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "luma", text: data.message || "I'm having trouble hearing you. Can you try again?" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "luma", text: "I couldn't reach the guide right now. Please check your connection and try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-160px)] max-w-3xl mx-auto">
      <section className="text-center mb-6">
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Navigate</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-2">
          Share what is on your mind. Luma listens, guides, and never records.
        </p>
      </section>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            role={msg.role === "user" ? "user" : "assistant"}
            text={msg.text}
          />
        ))}

        {isLoading && <TypingBubble />}

        {/* Searchable library of the 50 most common ways people open up */}
        {messages.length <= 1 && !isLoading && (
          <TopQuestions
            calls={NAVIGATOR_TOP_CALLS}
            onSelect={handleSend}
            title="50 most common things on people's minds"
            placeholder="Search what's on your mind…"
            compact
          />
        )}
        <div ref={endRef} />
      </div>

      <PromptChips prompts={SUGGESTED_PROMPTS} onSelect={handleSend}>
        <button
          onClick={() => setShowGrounding(true)}
          className="text-xs font-label-sm text-secondary border border-secondary/30 rounded-full px-3 py-1 hover:bg-secondary/10 transition-colors inline-flex items-center gap-1"
        >
          <Wind size={12} /> Grounding exercise
        </button>
      </PromptChips>

      <ChatComposer
        value={input}
        onChange={setInput}
        onSubmit={() => handleSend()}
        placeholder="Speak to the forest..."
        busy={isLoading}
      />

      {showGrounding && (
        <div className="fixed inset-0 z-[60] bg-surface/90 backdrop-blur-xl flex items-center justify-center p-6">
          <GlassCard className="max-w-md w-full p-8 text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
              <Wind size={40} className="text-primary" />
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">Sensory Grounding</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Breathe in for 4 counts, hold for 4, out for 6. The forest breathes with you.
            </p>
            <Button onClick={() => setShowGrounding(false)} variant="outline">
              I&apos;m ready to continue
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
