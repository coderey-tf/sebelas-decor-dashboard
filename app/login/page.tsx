"use client";

import { useState } from "react";
import { Sparkles, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const isDemoEnv = supabaseUrl.includes("demo-project.supabase.co") || supabaseUrl.includes("placeholder.supabase.co");

    // Jika masih menggunakan URL demo placeholder atau demo login
    if (isDemoEnv) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch {
      // Fallback redirect jika koneksi network Supabase gagal / domain invalid
      router.push("/dashboard");
    }
  };

  const handleDemoAccess = () => {
    router.push("/dashboard");
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-sans text-slate-100 antialiased">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md shadow-2xl">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-lg shadow-pink-500/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Sebelas Decor Dashboard</h1>
          <p className="text-xs text-slate-400">Masuk dengan akun admin untuk mengelola booking</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Email Admin</label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-200 focus-within:border-pink-500/50">
              <Mail className="h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="admin@sebelasdecor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-200 focus-within:border-pink-500/50">
              <Lock className="h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-4 text-center">
          <button
            onClick={handleDemoAccess}
            type="button"
            className="text-xs text-slate-400 hover:text-pink-400 transition-colors underline"
          >
            🚀 Masuk dengan Demo Mode (Preview Dashboard)
          </button>
        </div>
      </div>
    </div>
  );
}

