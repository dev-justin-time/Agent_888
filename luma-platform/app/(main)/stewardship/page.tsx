"use client";

import { useState } from "react";
import { Copy, Check, Mail, FileText, Briefcase, Shield, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ESCROW_TOP_CALLS, OUTREACH_TOP_CALLS } from "@/data/top-calls";
import type { EscrowCall, OutreachCall } from "@/data/top-calls";
import { copyToClipboard } from "@/lib/utils";

interface OutreachResult {
  subject: string;
  body: string;
}

interface EscrowDocument {
  document_title: string;
  fund_source: string;
  designated_use: string;
  stewardship_strategy: string;
  disbursement_conditions: string;
}

interface EscrowResult {
  escrow_document: EscrowDocument;
}

export default function StewardshipPage() {
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("Eco-Conservation Agency");
  const [alignment, setAlignment] = useState("");
  const [outreach, setOutreach] = useState<OutreachResult | null>(null);
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [donorName, setDonorName] = useState("");
  const [donorType, setDonorType] = useState("Individual");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [useCase, setUseCase] = useState("");
  const [escrow, setEscrow] = useState<EscrowResult | null>(null);
  const [escrowLoading, setEscrowLoading] = useState(false);

  const generateOutreach = async (prefill?: OutreachCall) => {
    setOutreachLoading(true);
    const res = await fetch("/api/partner-outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        prefill
          ? {
              org_name: prefill.orgName,
              org_type: prefill.orgType,
              alignment_focus: prefill.alignment,
            }
          : { org_name: orgName, org_type: orgType, alignment_focus: alignment }
      ),
    });
    const data = await res.json();
    if (data.status === "success") setOutreach(data.outreach);
    setOutreachLoading(false);
  };

  const runOutreachScenario = (call: OutreachCall) => {
    if (outreachLoading) return;
    setOrgName(call.orgName);
    setOrgType(call.orgType);
    setAlignment(call.alignment);
    generateOutreach(call);
  };

  const generateEscrow = async (prefill?: EscrowCall) => {
    setEscrowLoading(true);
    const res = await fetch("/api/generate-escrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        prefill
          ? {
              donor_name: prefill.donorName,
              donor_type: prefill.donorType,
              amount: Number(prefill.amount) || 0,
              currency: prefill.currency,
              specific_use_case: prefill.useCase,
            }
          : {
              donor_name: donorName,
              donor_type: donorType,
              amount: Number(amount) || 0,
              currency,
              specific_use_case: useCase,
            }
      ),
    });
    const data = await res.json();
    if (data.status === "success") setEscrow({ escrow_document: data.escrow_document });
    setEscrowLoading(false);
  };

  const runEscrowScenario = (call: EscrowCall) => {
    if (escrowLoading) return;
    setDonorName(call.donorName);
    setDonorType(call.donorType);
    setAmount(call.amount);
    setCurrency(call.currency);
    setUseCase(call.useCase);
    generateEscrow(call);
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-section-gap">
      <section className="text-center">
        <Briefcase className="mx-auto text-primary mb-3" size={36} />
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Mission Stewardship</h2>
        <p className="font-body-lg text-body-md text-on-surface-variant mt-2">
          Manage outreach strategies and legal frameworks with clarity and transparency.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="text-primary" size={24} />
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Partner Outreach</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Generate a tailored partnership email.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="-mx-1 px-1">
              <p className="text-xs font-label-sm text-on-surface-variant mb-2 flex items-center gap-1">
                <Sparkles size={12} className="text-primary" /> Top 50 scenarios — tap to prefill &amp; generate
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {OUTREACH_TOP_CALLS.map((call) => (
                  <button
                    key={call.id}
                    onClick={() => runOutreachScenario(call)}
                    className="text-[11px] text-primary border border-primary/25 rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-primary/10 hover:border-primary/50 active:scale-95 transition-all"
                  >
                    {call.question}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            />
            <select
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none"
            >
              <option>Eco-Conservation Agency</option>
              <option>Private Land Steward</option>
              <option>Educational Institution</option>
              <option>Community Collective</option>
            </select>
            <textarea
              placeholder="Alignment focus"
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none min-h-[80px]"
            />
            <Button onClick={() => generateOutreach()} disabled={outreachLoading} className="w-full">
              {outreachLoading ? "Generating..." : "Generate outreach email"}
            </Button>
          </div>

          {outreach && (
            <div className="mt-6 relative bg-black/40 p-4 rounded-xl border border-white/10">
              <div className="flex gap-2 absolute top-2 right-2">
                <button
                  onClick={() => handleCopy(`Subject: ${outreach.subject}\n\n${outreach.body}`)}
                  className="p-2 rounded-md hover:bg-surface-container-high text-on-surface-variant"
                >
                  {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-xs text-primary font-bold mb-1">Subject: {outreach.subject}</p>
              <p className="text-sm text-on-surface-variant whitespace-pre-wrap">{outreach.body}</p>
              <a
                href={`mailto:?subject=${encodeURIComponent(outreach.subject)}&body=${encodeURIComponent(outreach.body)}`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail size={14} /> Open in email client
              </a>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-primary" size={24} />
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Escrow Instructions</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Transparent, value-first funding document.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="-mx-1 px-1">
              <p className="text-xs font-label-sm text-on-surface-variant mb-2 flex items-center gap-1">
                <Sparkles size={12} className="text-primary" /> Top 50 scenarios — tap to prefill &amp; generate
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {ESCROW_TOP_CALLS.map((call) => (
                  <button
                    key={call.id}
                    onClick={() => runEscrowScenario(call)}
                    className="text-[11px] text-primary border border-primary/25 rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-primary/10 hover:border-primary/50 active:scale-95 transition-all"
                  >
                    {call.question}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Donor name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="col-span-2 bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
              />
              <select
                value={donorType}
                onChange={(e) => setDonorType(e.target.value)}
                className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 outline-none"
              >
                <option>Individual</option>
                <option>Organization</option>
                <option>Foundation</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Specific use case (optional)"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/50 outline-none"
            />
            <Button onClick={() => generateEscrow()} disabled={escrowLoading} className="w-full">
              {escrowLoading ? "Generating..." : "Generate escrow document"}
            </Button>
          </div>

          {escrow && (
            <div className="mt-6 bg-black/40 p-4 rounded-xl border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                <FileText size={16} /> {escrow.escrow_document.document_title}
              </h4>
              <p className="text-xs text-on-surface-variant whitespace-pre-wrap">
                <strong>Fund source:</strong> {escrow.escrow_document.fund_source}
              </p>
              <p className="text-xs text-on-surface-variant whitespace-pre-wrap">
                <strong>Designated use:</strong> {escrow.escrow_document.designated_use}
              </p>
              <p className="text-xs text-on-surface-variant whitespace-pre-wrap">
                <strong>Stewardship strategy:</strong> {escrow.escrow_document.stewardship_strategy}
              </p>
              <p className="text-xs text-on-surface-variant whitespace-pre-wrap">
                <strong>Disbursement conditions:</strong> {escrow.escrow_document.disbursement_conditions}
              </p>
              <Button
                variant="outline"
                onClick={() => handleCopy(JSON.stringify(escrow.escrow_document, null, 2))}
                className="w-full"
              >
                <Copy size={14} /> Copy document JSON
              </Button>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
