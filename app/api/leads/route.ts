import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, phone, event_date, location, event_type, package: pkg, theme, notes } = body;

    if (!event_date && !phone && !customer_name) {
      return NextResponse.json(
        { error: "Minimal harus menyertakan nama, phone, atau event_date" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        customerName: customer_name || "Guest Chatbot",
        phone: phone || null,
        eventDate: event_date ? new Date(event_date) : null,
        location: location || null,
        eventType: event_type || "Wedding",
        package: pkg || null,
        theme: theme || null,
        status: "Inquiry",
        notes: notes || "Tersimpan otomatis dari RAG Chatbot",
        source: "chatbot",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lead berhasil tersimpan dari chatbot via Prisma ORM",
      data: lead,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ API POST /api/leads error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
