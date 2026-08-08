export type EventType = "Wedding" | "Engagement" | "Birthday" | "Other";

export type LeadStatus =
  | "Inquiry"
  | "Follow-up"
  | "Booked"
  | "DP Paid"
  | "Completed"
  | "Cancelled";

export interface Lead {
  id: string;
  customer_name: string | null;
  phone: string | null;
  event_date: string | null;
  location: string | null;
  event_type: EventType | null;
  package: string | null;
  theme: string | null;
  status: LeadStatus;
  notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  lead_id: string;
  action: string;
  details: string | null;
  performed_by: string;
  created_at: string;
}

export interface DashboardStats {
  totalInquiries: number;
  activeBookings: number;
  completedEvents: number;
  estimatedRevenue: number;
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  Inquiry: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Follow-up": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Booked: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "DP Paid": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Completed: "bg-green-500/20 text-green-300 border-green-500/30",
  Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  Wedding: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Engagement: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Birthday: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Other: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};
