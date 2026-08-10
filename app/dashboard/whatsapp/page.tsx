"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { MessageSquare, CheckCircle2, AlertCircle, Copy, Check, ShieldCheck, Smartphone } from "lucide-react";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (params: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      AppEvents: {
        logPageView: () => void;
      };
      login: (
        callback: (response: {
          authResponse?: {
            code?: string;
          };
        }) => void,
        options: {
          config_id: string;
          response_type: string;
          override_default_response_type: boolean;
        }
      ) => void;
    };
  }
}

export default function WhatsAppConnectPage() {
  const [sdkReady, setSdkReady] = useState(false);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [wabaId, setWabaId] = useState<string | null>(null);
  const [phoneNumberId, setPhoneNumberId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "cancelled">("idle");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // 1. Inisialisasi FB SDK
    window.fbAsyncInit = function () {
      if (window.FB) {
        window.FB.init({
          appId: "1061127523554734", // App ID milikmu
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });
        window.FB.AppEvents.logPageView();
        setSdkReady(true);
      }
    };

    // Jika SDK sudah terload sebelumnya
    if (window.FB) {
      setSdkReady(true);
    }

    // 2. Tangkap Event Selesai dari Meta Embedded Signup
    const handleMetaMessage = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) {
        return;
      }

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data.type === "WA_EMBEDDED_SIGNUP" && data.event === "FINISH") {
          console.log("🎉 BERHASIL COEXISTENCE:", data.data);
          if (data.data) {
            setWabaId(data.data.waba_id || null);
            setPhoneNumberId(data.data.phone_number_id || null);
          }
          setConnectionStatus("success");
        }
      } catch {
        // Abaikan pesan selain dari Meta
      }
    };

    window.addEventListener("message", handleMetaMessage);
    return () => {
      window.removeEventListener("message", handleMetaMessage);
    };
  }, []);

  // 3. Trigger Pop-up Embedded Signup
  const launchWhatsAppSignup = () => {
    if (!window.FB) {
      alert("Facebook SDK belum siap. Silakan refresh halaman dan coba lagi.");
      return;
    }

    window.FB.login(
      function (response) {
        if (response.authResponse && response.authResponse.code) {
          const code = response.authResponse.code;
          console.log("✅ Authorization Code Diterima:", code);
          setAuthCode(code);
          setConnectionStatus("success");
        } else {
          console.log("Login dibatalkan pengguna.");
          setConnectionStatus("cancelled");
        }
      },
      {
        config_id: "1552212973350194", // Configuration ID milikmu
        response_type: "code",
        override_default_response_type: true,
      }
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <>
      {/* Inject Facebook SDK Script */}
      <Script
        id="facebook-jssdk"
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.fbAsyncInit) {
            window.fbAsyncInit();
          }
        }}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <MessageSquare className="h-7 w-7 text-emerald-400" />
              Connect WhatsApp Business
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Hubungkan nomor WhatsApp Sebelas Decor menggunakan Meta Embedded Signup (Mode Coexistence).
            </p>
          </div>
        </div>

        {/* Info Banner Coexistence */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-300 text-sm flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-200">Mode Coexistence Aktif</p>
            <p className="text-emerald-300/90 text-xs mt-0.5">
              WhatsApp di HP Kakak tetap aktif & tidak akan ter-logout. Fitur ini memungkinkan aplikasi WhatsApp seluler dan Bot Dashboard Sebelas Decor berjalan secara bersamaan.
            </p>
          </div>
        </div>

        {/* Main Action Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Smartphone className="h-8 w-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-white">📱 Hubungkan Nomor WhatsApp</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Klik tombol di bawah untuk mengaktifkan Mode Coexistence<br />
              (WhatsApp di HP tetap aktif & tidak akan ter-logout).
            </p>
          </div>

          <div>
            <button
              onClick={launchWhatsAppSignup}
              className="inline-flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold px-8 py-3.5 rounded-xl text-base shadow-lg shadow-[#25d366]/25 transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <MessageSquare className="h-5 w-5 fill-current" />
              Hubungkan WhatsApp Sebelas Decor
            </button>

            {!sdkReady && (
              <p className="text-xs text-slate-500 mt-2">Memuat Facebook SDK...</p>
            )}
          </div>
        </div>

        {/* Connection Result / Status Output */}
        {connectionStatus === "success" && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-lg">
              <CheckCircle2 className="h-6 w-6" />
              Selamat! Nomor WhatsApp Berhasil Terhubung dalam Mode Coexistence.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Authorization Code */}
              {authCode && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 col-span-full">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Authorization Code</span>
                    <button
                      onClick={() => copyToClipboard(authCode, "code")}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {copiedField === "code" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedField === "code" ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-slate-200 break-all bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {authCode}
                  </p>
                </div>
              )}

              {/* WABA ID */}
              {wabaId && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>WABA ID</span>
                    <button
                      onClick={() => copyToClipboard(wabaId, "waba")}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {copiedField === "waba" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedField === "waba" ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {wabaId}
                  </p>
                </div>
              )}

              {/* Phone Number ID */}
              {phoneNumberId && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Phone Number ID</span>
                    <button
                      onClick={() => copyToClipboard(phoneNumberId, "phoneId")}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {copiedField === "phoneId" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedField === "phoneId" ? "Tersalin" : "Salin"}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {phoneNumberId}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {connectionStatus === "cancelled" && (
          <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 text-amber-300 text-sm flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
            <span>Proses login dibatalkan pengguna. Silakan klik tombol di atas untuk mencoba lagi.</span>
          </div>
        )}
      </div>
    </>
  );
}
