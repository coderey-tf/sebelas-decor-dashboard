import { Lead, STATUS_COLORS, EVENT_TYPE_COLORS } from "@/types/database";
import { formatDateShort } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface UpcomingEventsProps {
  events: Lead[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Acara Mendatang</h3>
          <p className="text-xs text-slate-400">Jadwal dekorasi terdekat yang sudah di-booking</p>
        </div>
        <Link
          href="/dashboard/calendar"
          className="text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
        >
          Lihat Kalender →
        </Link>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada acara mendatang.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/40 p-3.5 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-200">{event.customer_name || "Tanpa Nama"}</span>
                  {event.event_type && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${EVENT_TYPE_COLORS[event.event_type]}`}>
                      {event.event_type}
                    </span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-pink-400" />
                    {event.event_date ? formatDateShort(event.event_date) : "Tanggal tbd"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-sky-400" />
                    {event.location || "Lokasi tbd"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold text-slate-300">{event.package || "Custom Package"}</p>
                <p className="text-[11px] text-slate-500">{event.theme || "Standard Theme"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
