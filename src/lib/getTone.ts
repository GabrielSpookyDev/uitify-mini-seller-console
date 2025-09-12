import type { LeadStatus } from "@/types/types";
import type { Tone } from "@/components/ui/Badge";

export default function getTone(status: LeadStatus): Tone {
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
