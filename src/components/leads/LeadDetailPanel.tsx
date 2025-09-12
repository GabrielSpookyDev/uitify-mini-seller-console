import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { X, Mail, User, Tag, DollarSign } from "lucide-react";
import { useLeadsActions } from "@/state/leads/useLeads";
import {
  isValidEmail,
  normalizeEmail,
  getEmailValidationMessage,
} from "@/lib/emailValidation";
import { simulateNetworkLatency } from "@/lib/delay";
import { generateUuidV4 } from "@/lib/id";
import { useOpportunitiesActions } from "@/state/opps/useOpps";
import type { Lead, LeadStatus, Opportunity } from "@/types/types";

const STATUS_OPTIONS: Array<LeadStatus> = [
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "converted",
];

export default function LeadDetailPanel({
  selectedLead,
}: Readonly<{
  selectedLead: Lead;
}>) {
  const { updateLead } = useLeadsActions();
  const { add: addOpportunity } = useOpportunitiesActions();
  const closePanel = useLeadsActions().selectLead.bind(null, null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState(selectedLead.name);
  const [company, setCompany] = useState(selectedLead.company);
  const [email, setEmail] = useState(selectedLead.email);
  const [status, setStatus] = useState<LeadStatus>(selectedLead.status);
  const [amount, setAmount] = useState<string>("");
  const [pending, setPending] = useState<"idle" | "saving" | "converting">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  // ESC closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePanel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel]);

  // Focus panel when opened
  useEffect(() => {
    if (panelRef.current) {
      const timer = setTimeout(() => panelRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, []);

  const emailError = getEmailValidationMessage(email);
  const isDirty =
    name !== selectedLead.name ||
    company !== selectedLead.company ||
    email !== selectedLead.email ||
    status !== selectedLead.status;

  async function handleSave() {
    if (emailError) return;
    setPending("saving");
    setErrorMsg("");
    const patch: Partial<Lead> = {
      name,
      company,
      email: normalizeEmail(email),
      status,
    };
    const previous = { ...selectedLead };

    updateLead(selectedLead.id, patch);
    try {
      await simulateNetworkLatency({
        minDelayMs: 500,
        maxDelayMs: 900,
        failureProbability: 0.15,
      });
      setPending("idle");
      closePanel();
    } catch {
      updateLead(selectedLead.id, previous);
      setErrorMsg("Failed to save. Please try again.");
      setPending("idle");
    }
  }

  function handleCancel() {
    setName(selectedLead.name);
    setCompany(selectedLead.company);
    setEmail(selectedLead.email);
    setStatus(selectedLead.status);
    setAmount("");
    setErrorMsg("");
    closePanel();
  }

  async function handleConvert() {
    const finalEmail = normalizeEmail(email);
    if (!isValidEmail(finalEmail)) {
      setErrorMsg("Enter a valid email address before converting.");
      return;
    }
    setPending("converting");
    setErrorMsg("");
    const previous = { ...selectedLead };

    try {
      await simulateNetworkLatency({
        minDelayMs: 500,
        maxDelayMs: 900,
        failureProbability: 0.1,
      });

      const opp: Opportunity = {
        id: generateUuidV4(),
        name,
        stage: "prospecting",
        amount: amount ? parseFloat(amount) : undefined,
        accountName: company,
        leadId: selectedLead.id,
        createdAt: new Date().toISOString(),
      };

      addOpportunity(opp);
      updateLead(selectedLead.id, { status: "converted", email: finalEmail });

      setPending("idle");
      closePanel();
    } catch {
      updateLead(selectedLead.id, previous);
      setErrorMsg("Conversion failed. Changes were rolled back.");
      setPending("idle");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-50 pointer-events-auto"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        aria-hidden="true"
        onClick={closePanel}
        className="absolute inset-0 bg-black/20"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-y-0 right-0 w-full md:max-w-md"
        aria-modal="true"
        aria-labelledby="slideover-title"
      >
        <Card
          ref={panelRef}
          tabIndex={-1}
          rounded="md:rounded-l-2xl"
          className="flex h-full flex-col outline-none"
        >
          <div className="flex items-start justify-between border-b border-zinc-200 px-4 py-3">
            <div className="flex flex-col">
              <div
                id="slideover-title"
                className="flex items-baseline gap-2 text-base font-semibold text-zinc-900"
              >
                <span>{selectedLead.id}</span>
                <span>-</span>
                <span>{selectedLead.name}</span>
              </div>
              <span className="text-zinc-600 mt-1">{selectedLead.company}</span>
            </div>
            <Button
              variant="ghost"
              icon={X}
              onClick={closePanel}
              aria-label="Close panel"
            />
          </div>

          <div className="flex-1 overflow-auto px-4 py-3">
            <div className="space-y-6">
              {errorMsg && (
                <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {errorMsg}
                </div>
              )}

              {/* Lead Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <User className="h-4 w-4" />
                  <span>Lead Details</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="lead-name"
                      className="text-sm font-medium text-zinc-900"
                    >
                      Name
                    </label>
                    <Input
                      id="lead-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Lead name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="lead-company"
                      className="text-sm font-medium text-zinc-900"
                    >
                      Company
                    </label>
                    <Input
                      id="lead-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <Mail className="h-4 w-4" />
                  <span>Contact Information</span>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="lead-email"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Email
                  </label>
                  <Input
                    id="lead-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(emailError)}
                    placeholder="name@company.com"
                  />
                  {emailError && (
                    <p id="email-error" className="text-xs text-rose-600">
                      {emailError}
                    </p>
                  )}
                </div>
              </div>

              {/* Lead Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <Tag className="h-4 w-4" />
                  <span>Lead Status</span>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="lead-status"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <Select
                      id="lead-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as LeadStatus)}
                      aria-label="Update lead status"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              {/* Opportunity Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <DollarSign className="h-4 w-4" />
                  <span>Opportunity Details</span>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="opportunity-amount"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Amount (Optional)
                  </label>
                  <Input
                    id="opportunity-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="pt-2 text-xs text-zinc-500">
                Changes are saved with simulated latency and may randomly fail
                for demo purposes.
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 px-4 py-3">
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="danger"
                onClick={handleCancel}
                disabled={pending !== "idle"}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={pending !== "idle" || Boolean(emailError) || !isDirty}
              >
                {pending === "saving" ? "Saving…" : "Save changes"}
              </Button>
              <Button
                onClick={handleConvert}
                disabled={
                  pending !== "idle" ||
                  Boolean(emailError) ||
                  selectedLead.status === "converted"
                }
                title={
                  selectedLead.status === "converted"
                    ? "Lead already converted"
                    : "Convert this lead into an opportunity"
                }
              >
                {(() => {
                  if (pending === "converting") return "Converting…";
                  if (selectedLead.status === "converted") return "Already Converted";
                  return "Convert Lead";
                })()}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
