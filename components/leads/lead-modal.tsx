"use client";

import { useState, useEffect } from "react";
import { Lead, EventType, LeadStatus } from "@/types/database";
import { X, Save, Sparkles } from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leadData: Partial<Lead>) => void;
  initialData?: Lead | null;
}

export function LeadModal({ isOpen, onClose, onSave, initialData }: LeadModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState<EventType>("Wedding");
  const [pkg, setPkg] = useState("Paket Indoor Basic");
  const [theme, setTheme] = useState("Modern Elegant");
  const [status, setStatus] = useState<LeadStatus>("Inquiry");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customer_name || "");
      setPhone(initialData.phone || "");
      setEventDate(initialData.event_date || "");
      setLocation(initialData.location || "");
      setEventType(initialData.event_type || "Wedding");
      setPkg(initialData.package || "Paket Indoor Basic");
      setTheme(initialData.theme || "Modern Elegant");
      setStatus(initialData.status || "Inquiry");
      setNotes(initialData.notes || "");
    } else {
      setCustomerName("");
      setPhone("");
      setEventDate("");
      setLocation("");
      setEventType("Wedding");
      setPkg("Paket Indoor Basic");
      setTheme("Modern Elegant");
      setStatus("Inquiry");
      setNotes("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      customer_name: customerName,
      phone,
      event_date: eventDate,
      location,
      event_type: eventType,
      package: pkg,
      theme,
      status,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {initialData ? "Edit Prospek / Lead" : "Tambah Lead Manual"}
              </h2>
              <p className="text-xs text-slate-400">
                {initialData ? "Perbarui informasi status & acara" : "Input data inquiry calon klien baru"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Nama Pelanggan / Mempelai</label>
              <input
                type="text"
                required
                placeholder="misal: Rina & Budi"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-200 focus:border-pink-500/50 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">No. WhatsApp / HP</label>
              <input
                type="text"
                placeholder="misal: 628123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-200 focus:border-pink-500/50 focus:outline-none"
              />
            </div>

            {/* Event Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tanggal Acara</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-200 focus:border-pink-500/50 focus:outline-none"
              />
            </div>

            {/* Event Type */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Jenis Acara</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-200 focus:border-pink-500/50 focus:outline-none"
              >
                <option value="Wedding">Wedding (Pernikahan)</option>
                <option value="Engagement">Engagement (Lamaran)</option>
                <option value="Birthday">Birthday / Ulang Tahun</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Lokasi / Gedung Acara</label>
              <input
                type="text"
                placeholder="misal: Gedung Kartika, Jakarta Selatan"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-200 focus:border-pink-500/50 focus:outline-none"
              />
            </div>

            {/* Package */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Paket Dekorasi</label>
              <select
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-200 focus:border-pink-500/50 focus:outline-none"
              >
                <option value="Paket Indoor Basic">Paket Indoor Basic (Rp 3.5M)</option>
                <option value="Paket Indoor VIP">Paket Indoor VIP (Rp 7.5M)</option>
                <option value="Paket Outdoor Garden">Paket Outdoor Garden (Rp 6.0M)</option>
                <option value="Paket Outdoor Beach">Paket Outdoor Beach (Rp 8.0M)</option>
                <option value="Paket Akad Nikah">Paket Akad Nikah (Rp 4.5M)</option>
                <option value="Custom Decor">Custom Decor Package</option>
              </select>
            </div>

            {/* Theme */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tema Dekorasi</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-200 focus:border-pink-500/50 focus:outline-none"
              >
                <option value="Rustic Minimalist">Rustic Minimalist</option>
                <option value="Modern Elegant">Modern Elegant</option>
                <option value="Traditional Jawa">Traditional Jawa</option>
                <option value="Glamour Gold">Glamour Gold</option>
                <option value="Boho Chic">Boho Chic</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Status Pipeline</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-200 focus:border-pink-500/50 focus:outline-none"
              >
                <option value="Inquiry">Inquiry (Baru Tanya)</option>
                <option value="Follow-up">Follow-up (Proses Diskusi)</option>
                <option value="Booked">Booked (Tanggal Direservasi)</option>
                <option value="DP Paid">DP Paid (DP 50% Masuk)</option>
                <option value="Completed">Completed (Acara Selesai)</option>
                <option value="Cancelled">Cancelled (Batal)</option>
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Catatan Khusus</label>
              <textarea
                rows={2}
                placeholder="Catatan tambahan, permintaan khusus warna bunga, dll."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-sm text-slate-200 focus:border-pink-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-rose-600 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Data Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
