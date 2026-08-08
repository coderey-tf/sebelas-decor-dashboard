"use client";

import { useState } from "react";
import { Lead, EVENT_TYPE_COLORS, STATUS_COLORS } from "@/types/database";
import { formatDateShort } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Phone } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface EventCalendarProps {
  initialEvents: Lead[];
}

export function EventCalendar({ initialEvents }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8, 1)); // September 2026 default
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Ambil event pada tanggal tertentu
  const getEventsForDate = (date: Date) => {
    return initialEvents.filter((event) => {
      if (!event.event_date) return false;
      try {
        return isSameDay(parseISO(event.event_date), date);
      } catch {
        return false;
      }
    });
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Calendar Grid (2 Cols) */}
      <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm shadow-xl space-y-4">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: idLocale })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextMonth}
              className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2">
          <span>Sen</span>
          <span>Sel</span>
          <span>Rab</span>
          <span>Kam</span>
          <span>Jum</span>
          <span>Sab</span>
          <span>Min</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[85px] rounded-lg border p-1.5 cursor-pointer transition-all ${
                  !isCurrentMonth
                    ? "bg-slate-950/20 border-slate-900 text-slate-700 opacity-40"
                    : isSelected
                    ? "bg-pink-500/10 border-pink-500/50 shadow-md shadow-pink-500/10"
                    : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="text-right text-xs font-bold text-slate-400 mb-1">
                  {format(day, "d")}
                </div>

                {/* Event Markers */}
                <div className="space-y-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium border ${
                        ev.event_type ? EVENT_TYPE_COLORS[ev.event_type] : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {ev.customer_name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Detail Panel (1 Col) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-pink-400" />
          {selectedDate
            ? format(selectedDate, "dd MMMM yyyy", { locale: idLocale })
            : "Pilih Tanggal di Kalender"}
        </h3>

        {!selectedDate ? (
          <p className="text-xs text-slate-500 italic py-6 text-center">
            Klik salah satu tanggal pada kalender untuk melihat detail acara yang di-booking.
          </p>
        ) : selectedDateEvents.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-6 text-center">
            Tidak ada acara di-booking pada tanggal ini. Tanggal ini kosong & siap menerima booking baru!
          </p>
        ) : (
          <div className="space-y-3">
            {selectedDateEvents.map((ev) => (
              <div
                key={ev.id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-200">{ev.customer_name}</span>
                  {ev.event_type && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${EVENT_TYPE_COLORS[ev.event_type]}`}>
                      {ev.event_type}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-sky-400" /> {ev.location || "Lokasi tbd"}
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-emerald-400" /> {ev.phone || "-"}
                  </p>
                  <p className="text-slate-300 font-medium">Paket: {ev.package || "-"}</p>
                  <p className="text-slate-400 text-[11px]">Tema: {ev.theme || "-"}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[ev.status]}`}>
                    {ev.status}
                  </span>
                  <span className="text-[11px] text-slate-500">{ev.notes || "Tidak ada catatan"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
