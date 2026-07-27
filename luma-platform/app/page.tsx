"use client";
import { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, MapPin, Users, Shield, Send, Heart, Sparkles, 
  ExternalLink, CheckCircle2, Lock, Globe, Briefcase, FileText, Copy, Check
} from "lucide-react";

type Tab = "navigate" | "resources" | "community" | "stewardship";

export default function LumaMobileApp() {
  const [activeTab, setActiveTab] = useState<Tab>("navigate");
  const [messages, setMessages] = useState<{ role: "user" | "luma"; text: string }[]>([
    { role: "luma", text: "Hey. 💙 I'm Luma. This is a completely private, anonymous space. Nothing you say here is stored. What's on your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [escrowDoc, setEscrowDoc] = useState<any>(null);
  const [partnerEmail, setPartnerEmail] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = "I'm reminded of someone who felt exactly like their brain was a browser with 100 tabs open. They tried a few things:\n\n1. The Brain Dump: They just typed every looping thought into a notes app. The Outcome: It didn't solve the tasks, but it cleared their mental RAM.\n\n2. The 5-Minute Micro-Step: They picked the smallest task and set a timer. The Outcome: It broke the paralysis.\n\nDoes any of those feel like a gentle place to start?";
      setMessages(prev => [...prev, { role: "luma", text: responseText }]);
      setIsTyping(false);
    }, 1200);
  };

  const generateMockEscrow = () => {
    setEscrowDoc({
      title: "Luma Mission Stewardship Instruction",
      fund_source: "Anonymous Donor / Partner Organization",
      designated_use: "General Purpose Funding (Unrestricted)",
      stewardship_strategy: "Suggested (Not Required): Allocate 70% to immediate user support infrastructure, 20% to provider verification, and 10% to a sustainability reserve. We do not dictate this. If our service is excellent, the mission will grow naturally. If it is not, the funds will not grow, and that is a fair and honest outcome.",
      disbursement_conditions: "Funds are released in tranches based on verified, value-delivered milestones. No funds are used for user data monetization, as we do not collect user data."
    });
  };

  const generateMockPartnerEmail = () => {
    setPartnerEmail({
      subject: "Aligning on privacy-first life navigation",
      body: "Hi Team,\n\nI've been following your recent work in accessible community support, and it deeply resonates with what we're building at Luma.\n\nLuma is a zero-label, completely anonymous life navigation platform. We don't diagnose; we guide. We don't store data; we protect privacy.\n\nI believe our approaches could powerfully complement each other. Would you be open to a brief, 15-minute exploratory chat next week to see if there's alignment?\n\nWarmly,\nLuma Partnership Team"
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col max-w-md mx-auto relative shadow-2xl">
      <div className="bg-emerald-900/30 border-b border-emerald-800/50 px-4 py-2 flex items-center justify-center gap-2 text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
        <Lock size={12} /> Ephemeral Session • No Records Kept • 100% Anonymous
      </div>

      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === "navigate" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user" ? "bg-emerald-600 text-white rounded-br-none" : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"
                  }`}>
                    {msg.role === "luma" && <Heart size={14} className="text-pink-400 inline mr-2 mb-1" />}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-4 rounded-2xl rounded-bl-none border border-gray-700 flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Share what's on your mind..." className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-5 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                <button type="submit" disabled={!input.trim() || isTyping} className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white p-3 rounded-full transition-all flex-shrink-0">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="p-4 space-y-6">
            <div className="text-center pt-4">
              <MapPin className="mx-auto text-emerald-400 mb-2" size={32} />
              <h2 className="text-xl font-bold">Support & Assistance</h2>
              <p className="text-xs text-gray-400 mt-1">Sponsors, Grants & Hotlines</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2"><Globe size={16} className="text-emerald-400" /> Immediate Connections</h3>
              <div className="bg-gray-800/50 p-3 rounded-xl flex justify-between items-center">
                <div><p className="text-sm font-medium">988 Lifeline</p><p className="text-xs text-gray-400">Call or Text</p></div>
                <button className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-medium">Call</button>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2"><Heart size={16} className="text-pink-400" /> Payment Assistance</h3>
              <div className="bg-gray-800/50 p-3 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium">OpenHeart Foundation</p>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Verified</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">Therapy Grants up to $500</p>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-1">Apply Securely <ExternalLink size={12} /></button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "community" && (
          <div className="p-4 space-y-6">
            <div className="text-center pt-4">
              <Users className="mx-auto text-indigo-400 mb-2" size={32} />
              <h2 className="text-xl font-bold">Luma_Nation</h2>
              <p className="text-xs text-gray-400 mt-1">Verified Professionals • Off-Platform Handoff</p>
            </div>
            <div className="bg-indigo-900/20 border border-indigo-800/50 rounded-xl p-4 flex gap-3">
              <Shield className="text-indigo-400 flex-shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-indigo-300">Zero-Record Privacy</h4>
                <p className="text-xs text-indigo-200/70 mt-1">All providers are verified. Connections route securely off Luma. We keep absolutely no records.</p>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div><p className="font-semibold text-gray-200">Dr. Aris Thorne</p><p className="text-xs text-gray-400">Life Navigator</p></div>
                <CheckCircle2 className="text-emerald-400" size={20} />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">Sliding Scale ($0-$20)</span>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium">Connect Securely <ExternalLink size={14} /></button>
            </div>
          </div>
        )}

        {activeTab === "stewardship" && (
          <div className="p-4 space-y-6">
            <div className="text-center pt-4">
              <Briefcase className="mx-auto text-amber-400 mb-2" size={32} />
              <h2 className="text-xl font-bold">Mission Stewardship</h2>
              <p className="text-xs text-gray-400 mt-1">Partner Outreach & Fund Escrow</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2"><FileText size={16} className="text-amber-400" /> Partner Outreach Generator</h3>
              <button onClick={generateMockPartnerEmail} className="w-full bg-amber-600/20 text-amber-400 border border-amber-600/30 py-2 rounded-lg text-sm font-medium mb-3">Generate Outreach Draft</button>
              {partnerEmail && (
                <div className="bg-black/40 p-4 rounded-xl border border-gray-700 relative">
                  <button onClick={() => copyToClipboard(partnerEmail.body)} className="absolute top-2 right-2 text-gray-400 hover:text-white">
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                  <p className="text-xs text-amber-400 font-bold mb-1">Subject: {partnerEmail.subject}</p>
                  <p className="text-xs text-gray-300 whitespace-pre-wrap">{partnerEmail.body}</p>
                </div>
              )}
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2"><Shield size={16} className="text-emerald-400" /> Escrow Instruction Generator</h3>
              <p className="text-xs text-gray-400 mb-3">Generate transparent, flexible funding instructions. Value-first. No mandates.</p>
              <button onClick={generateMockEscrow} className="w-full bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 py-2 rounded-lg text-sm font-medium mb-3">Generate Escrow Document</button>
              {escrowDoc && (
                <div className="bg-black/40 p-4 rounded-xl border border-gray-700 space-y-3">
                  <div><p className="text-[10px] text-gray-500 uppercase">Designated Use</p><p className="text-xs text-gray-200">{escrowDoc.designated_use}</p></div>
                  <div><p className="text-[10px] text-gray-500 uppercase">Suggested Stewardship Strategy</p><p className="text-xs text-gray-300 italic">{escrowDoc.stewardship_strategy}</p></div>
                  <div><p className="text-[10px] text-gray-500 uppercase">Disbursement Conditions</p><p className="text-xs text-gray-300">{escrowDoc.disbursement_conditions}</p></div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 max-w-md mx-auto">
        <div className="flex justify-around items-center py-3">
          {[
            { id: "navigate", icon: MessageCircle, label: "Navigate" },
            { id: "resources", icon: MapPin, label: "Resources" },
            { id: "community", icon: Users, label: "Luma_Nation" },
            { id: "stewardship", icon: Briefcase, label: "Stewardship" }
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? "text-emerald-400" : "text-gray-500"}`}>
              <tab.icon size={22} fill={activeTab === tab.id ? "currentColor" : "none"} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="h-2 bg-gray-900" />
      </nav>
    </div>
  );
}