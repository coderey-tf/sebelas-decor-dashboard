"use client";

import { useState, useEffect } from "react";
import { EventCalendar } from "@/components/calendar/event-calendar";
import { Lead } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

const sampleCalendarEvents: Lead[] = [
  {
    id: "1",
    customer_name: "Rina & Budi",
    phone: "628123456789",
    event_date: "2026-09-15",
    location: "Gedung Kartika, Jakarta",
    event_type: "Wedding",
    package: "Paket Indoor VIP",
    theme: "Modern Elegant",
    status: "DP Paid",
    notes: "DP 50% sudah diterima",
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
    event_date: "2026-09-28",
    location: "Taman Bunga, Bogor",
    event_type: "Wedding",
    package: "Paket Outdoor Garden",
    theme: "Boho Chic",
    status: "Follow-up",
    notes: "Klien masih minta revisi warna",
    source: "chatbot",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<Lead[]>(sampleCalendarEvents);

  const supabase = createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isDemoEnv =
    supabaseUrl.includes("demo-project.supabase.co") ||
    supabaseUrl.includes("placeholder.supabase.co") ||
    !supabaseUrl;

  useEffect(() => {
    async function loadEvents() {
      if (!isDemoEnv) {
        try {
          const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("event_date", { ascending: true });

          if (!error && data && data.length > 0) {
            setEvents(data as Lead[]);
            return;
          }
        } catch {
          // Fallback to local storage
        }
      }

      const saved = localStorage.getItem("sebelas_decor_leads");
      if (saved) {
        try {
          setEvents(JSON.parse(saved));
        } catch {
          setEvents(sampleCalendarEvents);
        }
      }
    }

    loadEvents();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Kalender Jadwal Acara</h1>
        <p className="text-sm text-slate-400">Pantau ketersediaan tanggal dan jadwal dekorasi mendatang secara visual.</p>
      </div>

      {/* Event Calendar */}
      <EventCalendar initialEvents={events} />
    </div>
  );
}
