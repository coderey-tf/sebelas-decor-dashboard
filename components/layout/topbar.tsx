"use client";

import { Bell, Search, User } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-md">
      {/* Search Input */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-400 focus-within:border-pink-500/50 focus-within:ring-1 focus-within:ring-pink-500/50 w-72">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Cari prospek, nama, lokasi..."
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative rounded-lg border border-slate-800 p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">Admin Sebelas</p>
            <p className="text-[10px] text-slate-400">admin@sebelasdecor.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
