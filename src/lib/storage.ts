import type {
  LeadsViewState,
  LeadStatus,
  SortDir,
  SortKey,
} from "@/types/types";

const STORAGE_NAMESPACE = "mini-seller-console";
const LEADS_VIEW_KEY = `${STORAGE_NAMESPACE}:leads:view:v1`;

// ---------- Safe JSON helpers ----------

export function readJson<T>(key: string, defaultValue: T): T {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function writeJson<T>(key: string, value: T | undefined): void {
  try {
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore storage errors (e.g., privacy mode).
  }
}

// ---------- Leads view state persistence ----------

export const DEFAULT_LEADS_VIEW_STATE: LeadsViewState = {
  searchTerm: "",
  statusFilter: "all",
  sortKey: "score",
  sortDir: "desc",
  selectedLeadId: null,
};

// Runtime guards (intentionally lightweight; no external deps)
function isValidSortKey(candidate: unknown): candidate is SortKey {
  return candidate === "score" || candidate === "name";
}

function isValidSortDir(candidate: unknown): candidate is SortDir {
  return candidate === "asc" || candidate === "desc";
}

function isValidStatus(candidate: unknown): candidate is LeadStatus | "all" {
  return (
    candidate === "all" ||
    candidate === "new" ||
    candidate === "contacted" ||
    candidate === "qualified" ||
    candidate === "unqualified" ||
    candidate === "converted"
  );
}

function isValidLeadsViewState(
  candidate: unknown
): candidate is LeadsViewState {
  if (!candidate || typeof candidate !== "object") return false;
  const value = candidate as Partial<LeadsViewState>;
  return (
    typeof value.searchTerm === "string" &&
    isValidStatus(value.statusFilter) &&
    isValidSortKey(value.sortKey) &&
    isValidSortDir(value.sortDir) &&
    (value.selectedLeadId === null || typeof value.selectedLeadId === "string")
  );
}

export function loadLeadsViewState(): LeadsViewState {
  const stored = readJson<unknown>(LEADS_VIEW_KEY, DEFAULT_LEADS_VIEW_STATE);
  return isValidLeadsViewState(stored) ? stored : DEFAULT_LEADS_VIEW_STATE;
}

export function saveLeadsViewState(state: LeadsViewState): void {
  const sanitizedState: LeadsViewState = {
    searchTerm: state.searchTerm ?? "",
    statusFilter: isValidStatus(state.statusFilter)
      ? state.statusFilter
      : "all",
    sortKey: isValidSortKey(state.sortKey) ? state.sortKey : "score",
    sortDir: isValidSortDir(state.sortDir) ? state.sortDir : "desc",
    selectedLeadId: state.selectedLeadId ?? null,
  };
  writeJson(LEADS_VIEW_KEY, sanitizedState);
}

export function clearLeadsViewState(): void {
  try {
    localStorage.removeItem(LEADS_VIEW_KEY);
  } catch {
    // Ignore storage errors.
  }
}
