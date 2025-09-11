import { useMemo, useState } from "react";
import SlideOver from "@/components/overlays/SlideOver";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useLeadsActions, useLeadsState } from "@/state/leads/useLeads";
import {
  isValidEmail,
  normalizeEmail,
  getEmailValidationMessage,
} from "@/lib/emailValidation";
import { simulateNetworkLatency } from "@/lib/delay";
import { generateUuidV4 } from "@/lib/id";
import { useOpportunitiesActions } from "@/state/opps/useOpps";
import type { Tone } from "@/components/ui/Badge";
import type { Lead, LeadStatus, Opportunity } from "@/types/types";

const STATUS_OPTIONS: Array<LeadStatus> = [
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "converted",
];

export default function LeadDetailPanel() {
  const { view, leads } = useLeadsState();
  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === view.selectedLeadId) || null,
    [leads, view.selectedLeadId]
  );
  const closePanel = useLeadsActions().selectLead.bind(null, null);

  if (!selectedLead) return null;

  return <PanelContent lead={selectedLead} onClose={closePanel} />;
}

function PanelContent({
  lead,
  onClose,
}: Readonly<{ lead: Lead; onClose: () => void }>) {
  const { updateLead } = useLeadsActions();
  const { add: addOpportunity } = useOpportunitiesActions();

  const [email, setEmail] = useState(lead.email);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [pending, setPending] = useState<"idle" | "saving" | "converting">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  const emailError = getEmailValidationMessage(email);
  const isDirty = email !== lead.email || status !== lead.status;

  async function handleSave() {
    if (emailError) return;
    setPending("saving");
    setErrorMsg("");
    const patch: Partial<Lead> = { email: normalizeEmail(email), status };
    const previous = { ...lead };

    // Optimistic update
    updateLead(lead.id, patch);
    try {
      await simulateNetworkLatency({
        minDelayMs: 500,
        maxDelayMs: 900,
        failureProbability: 0.15,
      });
      setPending("idle");
      onClose();
    } catch {
      updateLead(lead.id, previous); // rollback
      setErrorMsg("Failed to save. Please try again.");
      setPending("idle");
    }
  }

  function handleCancel() {
    setEmail(lead.email);
    setStatus(lead.status);
    setErrorMsg("");
    onClose();
  }

  async function handleConvert() {
    const finalEmail = normalizeEmail(email);
    if (!isValidEmail(finalEmail)) {
      setErrorMsg("Enter a valid email address before converting.");
      return;
    }
    setPending("converting");
    setErrorMsg("");
    const previous = { ...lead };

    // Optimistically mark converted + normalized email
    updateLead(lead.id, { status: "converted", email: finalEmail });

    try {
      await simulateNetworkLatency({
        minDelayMs: 500,
        maxDelayMs: 900,
        failureProbability: 0.1,
      });
      const opp: Opportunity = {
        id: generateUuidV4(),
        name: lead.name,
        stage: "prospecting",
        amount: undefined,
        accountName: lead.company,
        leadId: lead.id,
        createdAt: new Date().toISOString(),
      };
      addOpportunity(opp);
      setPending("idle");
      onClose();
    } catch {
      updateLead(lead.id, previous); // rollback
      setErrorMsg("Conversion failed. Changes were rolled back.");
      setPending("idle");
    }
  }

  function getTone(status: LeadStatus): Tone {
    switch (status) {
      case "qualified":
        return "green";
      case "contacted":
        return "amber";
      case "new":
        return "indigo";
      case "unqualified":
        return "rose";
      default:
        return "neutral";
    }
  }

  const tone = getTone(status);

  return (
    <SlideOver
      title={
        <div className="flex flex-col">
          <span className="text-zinc-900">{lead.name}</span>
          <span className="text-sm text-zinc-600">{lead.company}</span>
        </div>
      }
      open
      onClose={onClose}
      footer={
        <>
          <Button
            variant="secondary"
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
            variant="primary"
            disabled={pending !== "idle" || Boolean(emailError)}
            title="Convert this lead into an opportunity"
          >
            {pending === "converting" ? "Converting…" : "Convert Lead"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {errorMsg && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {errorMsg}
          </div>
        )}

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
            aria-describedby={emailError ? "email-error" : undefined}
            placeholder="name@company.com"
          />
          {emailError && (
            <p id="email-error" className="text-xs text-rose-600">
              {emailError}
            </p>
          )}
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
            <Badge tone={tone}>{status}</Badge>
          </div>
        </div>

        <div className="pt-2 text-xs text-zinc-500">
          Changes are saved with simulated latency and may randomly fail for
          demo purposes.
        </div>
      </div>
    </SlideOver>
  );
}
