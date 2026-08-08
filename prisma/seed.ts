import "dotenv/config";
import { PrismaClient, EventType, LeadStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seeding leads data...");

  // Clean existing data
  await prisma.activityLog.deleteMany();
  await prisma.lead.deleteMany();
  console.log("🧹 Cleaned existing leads and activity logs.");

  const leadsData = [
    {
      customerName: "Siti Rahmawati & Budi Santoso",
      phone: "081234567890",
      eventDate: new Date("2026-09-15"),
      location: "Ballroom Hotel Santika, Surabaya",
      eventType: EventType.Wedding,
      package: "Gold Package",
      theme: "Javanese Modern Royal",
      status: LeadStatus.DpPaid,
      notes: "DP 50% sudah diterima. Minta request backdrop pelaminan warna terracotta dan dominan mawar putih.",
      source: "chatbot",
      createdAt: new Date("2026-07-10T10:30:00Z"),
      activities: {
        create: [
          {
            action: "Lead Created",
            details: "Lead masuk via Whatsapp Chatbot AI",
            performedBy: "system",
            createdAt: new Date("2026-07-10T10:30:00Z"),
          },
          {
            action: "Consultation Done",
            details: "Diskusi tema dan paket via WhatsApp",
            performedBy: "admin",
            createdAt: new Date("2026-07-12T14:00:00Z"),
          },
          {
            action: "DP Payment Confirmed",
            details: "Pembayaran DP sebesar Rp 5.000.000 terverifikasi",
            performedBy: "admin",
            createdAt: new Date("2026-07-15T09:15:00Z"),
          },
        ],
      },
    },
    {
      customerName: "Anisa Putri & Dimas Rizky",
      phone: "085711223344",
      eventDate: new Date("2026-10-20"),
      location: "Gedung Wanita, Malang",
      eventType: EventType.Wedding,
      package: "Silver Package",
      theme: "Rustic Pastel Garden",
      status: LeadStatus.Booked,
      notes: "Sudah menyetujui penawaran harga. Menunggu jadwal pembayaran DP minggu depan.",
      source: "instagram",
      createdAt: new Date("2026-07-20T11:00:00Z"),
      activities: {
        create: [
          {
            action: "Lead Created",
            details: "DM Instagram menanyakan penawaran dekorasi wedding outdoor",
            performedBy: "admin",
            createdAt: new Date("2026-07-20T11:00:00Z"),
          },
          {
            action: "Proposal Sent",
            details: "Mengirimkan PDF penawaran Silver Package",
            performedBy: "admin",
            createdAt: new Date("2026-07-21T08:30:00Z"),
          },
        ],
      },
    },
    {
      customerName: "Clara Tan & Kevin",
      phone: "081987654321",
      eventDate: new Date("2026-08-28"),
      location: "Garden Resto & Function Hall, Sidoarjo",
      eventType: EventType.Engagement,
      package: "Intimate Engagement",
      theme: "White & Gold Luxury",
      status: LeadStatus.Completed,
      notes: "Acara lamaran lancar. Klien sangat puas dengan buket bunga dan photobooth.",
      source: "referral",
      createdAt: new Date("2026-06-01T15:20:00Z"),
      activities: {
        create: [
          {
            action: "Lead Created",
            details: "Rekomendasi dari mantan klien (Dewi & Agus)",
            performedBy: "admin",
            createdAt: new Date("2026-06-01T15:20:00Z"),
          },
          {
            action: "Event Completed",
            details: "Pekerjaan dekorasi selesai dan dibongkar dengan rapi",
            performedBy: "tim_dekorasi",
            createdAt: new Date("2026-08-28T21:00:00Z"),
          },
        ],
      },
    },
    {
      customerName: "Rina Kusuma (Ulang Tahun ke-17)",
      phone: "082199887766",
      eventDate: new Date("2026-11-05"),
      location: "Private Villa Batu, Malang",
      eventType: EventType.Birthday,
      package: "Custom Party Decor",
      theme: "Sweet Seventeen Euphoria Neon",
      status: LeadStatus.FollowUp,
      notes: "Minta contoh moodboard dekorasi lampu LED dan balon artistik.",
      source: "chatbot",
      createdAt: new Date("2026-08-01T09:45:00Z"),
      activities: {
        create: [
          {
            action: "Lead Created",
            details: "Tanya pricelist sweet 17 via Chatbot AI",
            performedBy: "system",
            createdAt: new Date("2026-08-01T09:45:00Z"),
          },
          {
            action: "Follow Up Sent",
            details: "Mengirimkan katalog foto acara ulang tahun sebelumnya",
            performedBy: "admin",
            createdAt: new Date("2026-08-03T10:00:00Z"),
          },
        ],
      },
    },
    {
      customerName: "Fajar Nugraha & Maya Indah",
      phone: "083812345678",
      eventDate: new Date("2026-12-12"),
      location: "Grand Mercure Hotel, Surabaya",
      eventType: EventType.Wedding,
      package: "Platinum Package",
      theme: "Fairytale Glass Canopy",
      status: LeadStatus.Inquiry,
      notes: "Menanyakan ketersediaan tanggal 12-12-2026 untuk venue indoor.",
      source: "website",
      createdAt: new Date("2026-08-04T16:10:00Z"),
      activities: {
        create: [
          {
            action: "Lead Created",
            details: "Mengisi form kontak di website utama",
            performedBy: "system",
            createdAt: new Date("2026-08-04T16:10:00Z"),
          },
        ],
      },
    },
    {
      customerName: "Dewi Lestari & Hendra",
      phone: "081377665544",
      eventDate: new Date("2026-07-04"),
      location: "Aula Masjid Al-Akbar, Surabaya",
      eventType: EventType.Wedding,
      package: "Bronze Package",
      theme: "Traditional Green Sage",
      status: LeadStatus.Cancelled,
      notes: "Dibatalkan karena keluarga memilih lokasi dan vendor di luar kota.",
      source: "whatsapp",
      createdAt: new Date("2026-05-15T08:00:00Z"),
      activities: {
        create: [
          {
            action: "Lead Created",
            details: "Chat WhatsApp langsung ke CS",
            performedBy: "admin",
            createdAt: new Date("2026-05-15T08:00:00Z"),
          },
          {
            action: "Lead Cancelled",
            details: "Klien mengonfirmasi pembatalan melalui WhatsApp",
            performedBy: "admin",
            createdAt: new Date("2026-05-20T13:30:00Z"),
          },
        ],
      },
    },
    {
      customerName: "PT Sinergi Abadi (Corporate Gala Dinner)",
      phone: "081122334455",
      eventDate: new Date("2026-11-25"),
      location: "Westin Convention Center, Surabaya",
      eventType: EventType.Other,
      package: "Corporate Event Decor",
      theme: "Modern Corporate Elegant Blue",
      status: LeadStatus.Inquiry,
      notes: "Minta penawaran panggung utama, photobooth, dan backdrop LED screen.",
      source: "website",
      createdAt: new Date("2026-08-05T14:20:00Z"),
      activities: {
        create: [
          {
            action: "Lead Created",
            details: "Inquiry resmi dari tim HR PT Sinergi Abadi",
            performedBy: "system",
            createdAt: new Date("2026-08-05T14:20:00Z"),
          },
        ],
      },
    },
  ];

  for (const lead of leadsData) {
    const createdLead = await prisma.lead.create({
      data: lead,
    });
    console.log(`✅ Created lead: ${createdLead.customerName} (${createdLead.status})`);
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
