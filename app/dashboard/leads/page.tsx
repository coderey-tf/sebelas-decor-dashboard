"use client";

import { useState, useEffect } from "react";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadModal } from "@/components/leads/lead-modal";
import { Lead } from "@/types/database";
import { Plus, DatabaseCheck } from "lucide-react";
import {
  getLeads,
  createLeadAction,
  updateLeadAction,
  deleteLeadAction,
} from "@/app/actions/leads";

// Sample initial leads
const initialLeadsData: Lead[] = [
  {
    id: "1",
    customer_name: "Rina & Budi",
    phone: "628123456789",
    event_date: "2026-10-15",
    location: "Gedung Kartika, Jakarta",
    event_type: "Wedding",
    package: "Paket Indoor VIP",
    theme: "Modern Elegant",
    status: "DP Paid",
    notes: "DP 50% sudah diterima, request bunga mawar putih",
    source: "chatbot",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    customer_name: "Siti & Agus",
    phone: "628987654321",
    event_date: "2026-09-20",
    location: "Halaman Rumah, Bandung",
    event_type: "Engagement",
    package: "Paket Akad Nikah",
    theme: "Rustic Minimalist",
    status: "Booked",
    notes: "Menunggu pelunasan H-3",
    source: "chatbot",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    customer_name: "Maya & Dimas",
    phone: "628112233445",
    event_date: "2026-11-05",
    location: "Taman Bunga, Bogor",
    event_type: "Wedding",
    package: "Paket Outdoor Garden",
    theme: "Boho Chic",
    status: "Follow-up",
    notes: "Klien masih minta revisi warna backdrop",
    source: "chatbot",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeadsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Fetch leads from Prisma Server Actions on mount
  useEffect(() => {
    async function loadData() {
      const prismaLeads = await getLeads();
      if (prismaLeads && prismaLeads.length > 0) {
        setLeads(prismaLeads);
        return;
      }

      // Fallback local storage
      const saved = localStorage.getItem("sebelas_decor_leads");
      if (saved) {
        try {
          setLeads(JSON.parse(saved));
        } catch {
          setLeads(initialLeadsData);
        }
      }
    }

    loadData();
  }, []);

  const syncLeads = (newLeads: Lead[]) => {
    setLeads(newLeads);
    try {
      localStorage.setItem("sebelas_decor_leads", JSON.stringify(newLeads));
    } catch {
      // Ignore
    }
  };

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (id: string) => {
    await deleteLeadAction(id);
    const updated = leads.filter((item) => item.id !== id);
    syncLeads(updated);
  };

  const handleSaveLead = async (leadData: Partial<Lead>) => {
    if (leadData.id) {
      // Edit existing lead via Prisma
      const res = await updateLeadAction(leadData.id, leadData as any);
      const updatedLead = res.success ? res.data : leadData;

      const updated = leads.map((item) =>
        item.id === leadData.id
          ? ({ ...item, ...updatedLead, updated_at: new Date().toISOString() } as Lead)
          : item
      );
      syncLeads(updated);
    } else {
      // Add new lead via Prisma
      const res = await createLeadAction(leadData as any);
      const newLead: Lead = res.success
        ? (res.data as Lead)
        : {
            id: String(Date.now()),
            customer_name: leadData.customer_name || "Tanpa Nama",
            phone: leadData.phone || null,
            event_date: leadData.event_date || null,
            location: leadData.location || null,
            event_type: leadData.event_type || "Wedding",
            package: leadData.package || "Paket Indoor Basic",
            theme: leadData.theme || "Modern Elegant",
            status: leadData.status || "Inquiry",
            notes: leadData.notes || null,
            source: "manual",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

      syncLeads([newLead, ...leads]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Manajemen Leads & Booking</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              <DatabaseCheck className="h-3 w-3" /> Prisma ORM
            </span>
          </div>
          <p className="text-sm text-slate-400">Kelola prospek yang masuk dari RAG Chatbot dan status pipeline acara.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-rose-600 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Lead Manual
        </button>
      </div>

      {/* Leads Table */}
      <LeadsTable initialLeads={leads} onEditLead={handleOpenEditModal} onDeleteLead={handleDeleteLead} />

      {/* Modal Dialog */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        initialData={editingLead}
      />
    </div>
  );
}
