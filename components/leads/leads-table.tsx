"use client";

import { useState, useEffect } from "react";
import { Lead, STATUS_COLORS, EVENT_TYPE_COLORS } from "@/types/database";
import { formatDateShort } from "@/lib/utils";
import { Search, Phone, MapPin, Calendar, Edit2, Trash2 } from "lucide-react";

interface LeadsTableProps {
  initialLeads: Lead[];
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (id: string) => void;
}

export function LeadsTable({ initialLeads, onEditLead, onDeleteLead }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const handleDelete = (lead: Lead) => {
    if (confirm(`Yakin ingin menghapus data prospek "${lead.customer_name || 'Tanpa Nama'}"?`)) {
      if (onDeleteLead) {
        onDeleteLead(lead.id);
      }
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      (lead.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (lead.phone || "").includes(search);

    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-300 w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama, no HP, atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {["ALL", "Inquiry", "Follow-up", "Booked", "DP Paid", "Completed", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                  : "bg-slate-900/40 text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {status === "ALL" ? "Semua Status" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Component */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Pelanggan</th>
                <th className="px-5 py-3.5">Jenis Acara</th>
                <th className="px-5 py-3.5">Tanggal Acara</th>
                <th className="px-5 py-3.5">Paket & Tema</th>
                <th className="px-5 py-3.5">Status Pipeline</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500 italic">
                    Tidak ditemukan data lead yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Customer Info */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-100">{lead.customer_name || "Tanpa Nama"}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Phone className="h-3 w-3 text-emerald-400" />
                        <span>{lead.phone || "-"}</span>
                      </div>
                    </td>

                    {/* Event Type */}
                    <td className="px-5 py-4">
                      {lead.event_type ? (
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${EVENT_TYPE_COLORS[lead.event_type]}`}>
                          {lead.event_type}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </td>

                    {/* Event Date & Location */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-pink-400" />
                        {lead.event_date ? formatDateShort(lead.event_date) : "TBD"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3 text-sky-400" />
                        <span className="truncate max-w-[160px]">{lead.location || "TBD"}</span>
                      </div>
                    </td>

                    {/* Package & Theme */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-200">{lead.package || "-"}</div>
                      <div className="text-xs text-slate-400">{lead.theme || "-"}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditLead && onEditLead(lead)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-pink-400 hover:text-pink-300 bg-pink-500/10 px-2.5 py-1.5 rounded-lg border border-pink-500/20 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(lead)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-1.5 rounded-lg border border-rose-500/20 transition-colors cursor-pointer"
                          title="Hapus Lead"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
