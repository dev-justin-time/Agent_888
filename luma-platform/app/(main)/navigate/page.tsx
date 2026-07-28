"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Heart, Sparkles, Wind } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { copyToClipboard } from "@/lib/utils";

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
  const endRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

        if (data.route_to_resources || data.response.includes("[ROUTE_TO_RESOURCES]")) {
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
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-4 text-sm leading-relaxed whitespace-pre-wrap shadow-xl ${
                msg.role === "user"
                  ? "bg-primary/20 text-primary rounded-[24px_24px_4px_24px] border border-primary/30"
                  : "glass-card inner-glow chat-bubble-luma text-on-surface"
              }`}
            >
              {msg.role === "luma" && <Heart size={14} className="text-pink-400 inline mr-2 mb-1" />}
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card inner-glow p-4 rounded-2xl rounded-bl-none border border-white/10 flex gap-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="text-xs font-label-sm text-primary border border-primary/30 rounded-full px-3 py-1 hover:bg-primary/10 transition-colors"
          >
            {prompt}
          </button>
        ))}
        <button
          onClick={() => setShowGrounding(true)}
          className="text-xs font-label-sm text-secondary border border-secondary/30 rounded-full px-3 py-1 hover:bg-secondary/10 transition-colors inline-flex items-center gap-1"
        >
          <Wind size={12} /> Grounding exercise
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 glass-card inner-glow rounded-full px-4 py-3 flex items-center gap-3 border border-white/10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak to the forest..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 font-body-md"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-inverse-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-90 transition-all disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>

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
              I'm ready to continue
            </Button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
