import { StatCard } from "@/components/dashboard/stat-card";
import { ChartOverview } from "@/components/dashboard/chart-overview";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { Users, CalendarCheck, CheckCircle2, DollarSign } from "lucide-react";
import { Lead } from "@/types/database";

// Sample dummy data untuk tampilan awal jika database belum terisi
const sampleEvents: Lead[] = [
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
    event_date: "2026-11-05",
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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Overview Dashboard</h1>
        <p className="text-sm text-slate-400">Selamat datang kembali! Ini ringkasan operasional Sebelas Decor hari ini.</p>
      </div>

      {/* Grid Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Inquiry Chatbot"
          value="128"
          description="Total prospek masuk dari chatbot"
          icon={Users}
          colorScheme="pink"
          trend={{ value: "18%", isPositive: true }}
        />
        <StatCard
          title="Active Bookings"
          value="14"
          description="Acara mendatang yang di-booking"
          icon={CalendarCheck}
          colorScheme="purple"
          trend={{ value: "4 acara baru", isPositive: true }}
        />
        <StatCard
          title="Acara Selesai"
          value="42"
          description="Event sukses terselenggara"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Estimasi Omset"
          value="Rp 148.5M"
          description="Total dari booking aktif & DP"
          icon={DollarSign}
          colorScheme="sky"
          trend={{ value: "12%", isPositive: true }}
        />
      </div>

      {/* Grid Chart & Upcoming Events */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartOverview />
        <UpcomingEvents events={sampleEvents} />
      </div>
    </div>
  );
}
