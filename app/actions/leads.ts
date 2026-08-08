"use server";

import { prisma } from "@/lib/prisma";
import { Lead, EventType, LeadStatus } from "@/types/database";

// Helper untuk mentransformasi record Prisma ke UI type Lead
function mapPrismaLeadToLead(item: any): Lead {
  return {
    id: item.id,
    customer_name: item.customerName,
    phone: item.phone,
    event_date: item.eventDate ? item.eventDate.toISOString().split("T")[0] : null,
    location: item.location,
    event_type: item.eventType as EventType,
    package: item.package,
    theme: item.theme,
    status: (item.status === "FollowUp" ? "Follow-up" : item.status === "DpPaid" ? "DP Paid" : item.status) as LeadStatus,
    notes: item.notes,
    source: item.source,
    created_at: item.createdAt.toISOString(),
    updated_at: item.updatedAt.toISOString(),
  };
}

export async function getLeads(): Promise<Lead[]> {
  try {
    const rawLeads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rawLeads.map(mapPrismaLeadToLead);
  } catch (error) {
    console.error("❌ Prisma getLeads error:", error);
    return [];
  }
}

export async function createLeadAction(data: {
  customer_name?: string;
  phone?: string;
  event_date?: string;
  location?: string;
  event_type?: EventType;
  package?: string;
  theme?: string;
  status?: LeadStatus;
  notes?: string;
}) {
  try {
    const mappedStatus =
      data.status === "Follow-up"
        ? ("FollowUp" as any)
        : data.status === "DP Paid"
        ? ("DpPaid" as any)
        : data.status || "Inquiry";

    const created = await prisma.lead.create({
      data: {
        customerName: data.customer_name || "Tanpa Nama",
        phone: data.phone || null,
        eventDate: data.event_date ? new Date(data.event_date) : null,
        location: data.location || null,
        eventType: (data.event_type as any) || "Wedding",
        package: data.package || "Paket Indoor Basic",
        theme: data.theme || "Modern Elegant",
        status: mappedStatus,
        notes: data.notes || null,
        source: "manual",
      },
    });

    return { success: true, data: mapPrismaLeadToLead(created) };
  } catch (error: any) {
    console.error("❌ Prisma createLead error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateLeadAction(
  id: string,
  data: {
    customer_name?: string;
    phone?: string;
    event_date?: string;
    location?: string;
    event_type?: EventType;
    package?: string;
    theme?: string;
    status?: LeadStatus;
    notes?: string;
  }
) {
  try {
    const mappedStatus =
      data.status === "Follow-up"
        ? ("FollowUp" as any)
        : data.status === "DP Paid"
        ? ("DpPaid" as any)
        : data.status;

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        customerName: data.customer_name,
        phone: data.phone,
        eventDate: data.event_date ? new Date(data.event_date) : null,
        location: data.location,
        eventType: data.event_type as any,
        package: data.package,
        theme: data.theme,
        status: mappedStatus,
        notes: data.notes,
      },
    });

    return { success: true, data: mapPrismaLeadToLead(updated) };
  } catch (error: any) {
    console.error("❌ Prisma updateLead error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLeadAction(id: string) {
  try {
    await prisma.lead.delete({
      where: { id },
    });
    return { success: true };
  } catch (error: any) {
    console.error("❌ Prisma deleteLead error:", error);
    return { success: false, error: error.message };
  }
}
