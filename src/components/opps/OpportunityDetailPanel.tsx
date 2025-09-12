import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { X, Building, DollarSign, Tag } from "lucide-react";
import { useOpportunitiesActions } from "@/state/opps/useOpps";
import { simulateNetworkLatency } from "@/lib/delay";
import type { Opportunity, OpportunityStage } from "@/types/types";

const STAGE_OPTIONS: Array<OpportunityStage> = [
  "prospecting",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

export default function OpportunityDetailPanel({
  selectedOpportunity,
}: Readonly<{
  selectedOpportunity: Opportunity;
}>) {
  const { updateOpportunity } = useOpportunitiesActions();
  const closePanel = useOpportunitiesActions().selectOpportunity.bind(
    null,
    null
  );
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [name, setName] = useState(selectedOpportunity.name);
  const [accountName, setAccountName] = useState(
    selectedOpportunity.accountName
  );
  const [stage, setStage] = useState<OpportunityStage>(
    selectedOpportunity.stage
  );
  const [amount, setAmount] = useState<string>(
    selectedOpportunity.amount?.toString() || ""
  );
  const [pending, setPending] = useState<"idle" | "saving">("idle");
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

  const isDirty =
    name !== selectedOpportunity.name ||
    accountName !== selectedOpportunity.accountName ||
    stage !== selectedOpportunity.stage ||
    amount !== (selectedOpportunity.amount?.toString() || "");

  async function handleSave() {
    setPending("saving");
    setErrorMsg("");
    const patch: Partial<Opportunity> = {
      name,
      accountName,
      stage,
      amount: amount ? parseFloat(amount) : undefined,
    };
    const previous = { ...selectedOpportunity };

    updateOpportunity(selectedOpportunity.id, patch);
    try {
      await simulateNetworkLatency({
        minDelayMs: 500,
        maxDelayMs: 900,
        failureProbability: 0.15,
      });
      setPending("idle");
      closePanel();
    } catch {
      updateOpportunity(selectedOpportunity.id, previous);
      setErrorMsg("Failed to save. Please try again.");
      setPending("idle");
    }
  }

  function handleCancel() {
    setName(selectedOpportunity.name);
    setAccountName(selectedOpportunity.accountName);
    setStage(selectedOpportunity.stage);
    setAmount(selectedOpportunity.amount?.toString() || "");
    setErrorMsg("");
    closePanel();
  }

  const getStageColor = (stage: OpportunityStage) => {
    switch (stage) {
      case "won":
        return "text-green-600";
      case "lost":
        return "text-red-600";
      case "negotiation":
        return "text-blue-600";
      case "proposal":
        return "text-yellow-600";
      default:
        return "text-zinc-600";
    }
  };

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
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: "blur(4px)" }}
        exit={{ backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
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
                className="flex items-baseline gap-2 text-base font-semibold text-zinc-900 max-w-xs"
                title={`${selectedOpportunity.id} - Opportunity Details`}
              >
                <span className="truncate">{selectedOpportunity.id.slice(0, 8)}...</span>
                <span>-</span>
                <span>Opportunity Details</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <Badge className={getStageColor(selectedOpportunity.stage)}>
                  {selectedOpportunity.stage}
                </Badge>
                <span className="text-sm font-medium text-zinc-700">
                  {selectedOpportunity.amount != null
                    ? new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(selectedOpportunity.amount)
                    : "No amount set"}
                </span>
              </div>
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

              {/* Opportunity Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <Building className="h-4 w-4" />
                  <span>Opportunity Details</span>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="opp-name"
                      className="text-sm font-medium text-zinc-900"
                    >
                      Name
                    </label>
                    <Input
                      id="opp-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Opportunity name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="opp-account"
                      className="text-sm font-medium text-zinc-900"
                    >
                      Account Name
                    </label>
                    <Input
                      id="opp-account"
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Account name"
                    />
                  </div>
                </div>
              </div>

              {/* Stage */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <Tag className="h-4 w-4" />
                  <span>Stage</span>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="opp-stage"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Current Stage
                  </label>
                  <div className="flex items-center gap-2">
                    <Select
                      id="opp-stage"
                      value={stage}
                      onChange={(e) =>
                        setStage(e.target.value as OpportunityStage)
                      }
                      aria-label="Update opportunity stage"
                    >
                      {STAGE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <DollarSign className="h-4 w-4" />
                  <span>Financial Details</span>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="opp-amount"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Amount (Optional)
                  </label>
                  <Input
                    id="opp-amount"
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
                disabled={pending !== "idle" || !isDirty}
              >
                {pending === "saving" ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
