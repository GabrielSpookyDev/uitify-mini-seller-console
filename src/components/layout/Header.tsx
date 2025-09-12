import React, { useState } from "react";
import { useLeadsState, useVisibleLeads } from "@/state/leads/useLeads";
import {
  useOpportunitiesActions,
  useOpportunitiesState,
} from "@/state/opps/useOpps";
import { clearLeads } from "@/lib/storage";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { RotateCcw } from "lucide-react";

function StatChip({
  label,
  value,
}: Readonly<{ label: string; value: React.ReactNode }>) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm ring-1 ring-white/30">
      <span className="text-indigo-100">{label}:</span>
      <span className="font-semibold text-white">{value}</span>
    </span>
  );
}

export default function Header() {
  const { leads } = useLeadsState();
  const visibleLeads = useVisibleLeads();
  const { list: opportunities } = useOpportunitiesState();
  const { reset } = useOpportunitiesActions();
  const [isResetting, setIsResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  function handleResetClick() {
    setShowResetModal(true);
  }

  function handleResetConfirm() {
    setShowResetModal(false);
    setIsResetting(true);
    reset();
    clearLeads();
    setTimeout(() => window.location.reload(), 500);
  }

  return (
    <header className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-grid mask-radial" />

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Mini Seller Console
            </h1>
            <p className="mt-2 max-w-xl leading-6 text-indigo-100/90">
              Triage leads and convert them into opportunities.
              <br />
              Local-first, fast, and beautiful.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatChip label="Leads" value={leads.length} />
            <StatChip label="Filtered Leads" value={visibleLeads.length} />
            <StatChip label="Opportunities" value={opportunities.length} />
            <Button
              icon={RotateCcw}
              onClick={handleResetClick}
              disabled={isResetting}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              title="Reset all data"
              label="Reset Data"
            />
          </div>
        </div>
      </div>

      <Modal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Data"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowResetModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleResetConfirm}>
              Reset Everything
            </Button>
          </>
        }
      >
        <p className="text-zinc-600">
          This will clear all opportunities and lead changes, returning to the
          original data.
        </p>
        <p className="text-zinc-600 mt-2 font-medium">
          This action cannot be undone.
        </p>
      </Modal>
    </header>
  );
}
