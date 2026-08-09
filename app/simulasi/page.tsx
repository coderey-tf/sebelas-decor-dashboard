"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const RAG_API_URL =
  process.env.NEXT_PUBLIC_RAG_API_URL || "http://127.0.0.1:5000/api/chat";

export default function SimulasiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [todayFormatted, setTodayFormatted] = useState("");
  const [simulatedPhone, setSimulatedPhone] = useState("081234567890");

  const chatBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setTodayFormatted(formatted);

    // Initial welcome message
    const now = getCurrentTime();
    setMessages([
      {
        id: "welcome-bot",
        sender: "bot",
        text: "Silakan ketik pertanyaan Anda, atau tanya tentang tanggal & paket dekorasi di bawah! 👇",
        timestamp: now,
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  const formatMessageText = (text: string) => {
    // Convert Markdown Image ![alt](url) -> <img>
    let formatted = text.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      (match, alt, url) => {
        // If image URL is relative (/static/...), prepend RAG host or full URL if needed
        let fullUrl = url;
        if (url.startsWith("/static/")) {
          const ragOrigin = new URL(RAG_API_URL).origin;
          fullUrl = `${ragOrigin}${url}`;
        }
        return `<div style="margin: 8px 0;"><img src="${fullUrl}" alt="${alt}" style="max-width: 100%; max-height: 280px; border-radius: 10px; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);" /></div>`;
      }
    );

    // Convert URLs -> <a> links
    formatted = formatted.replace(
      /(https:\/\/[\w\.\/\?\=\&\_\-%]+)/g,
      (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #53bdeb; text-decoration: underline; word-break: break-all;">${url}</a>`;
      }
    );

    // Format Bold & Newlines
    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n- /g, "\n• ")
      .replace(/\n/g, "<br/>");

    return formatted;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userText = textToSend.trim();
    const now = getCurrentTime();

    // Add user message
    const userMsgObj: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInputMessage("");
    setIsLoading(true);

    const updatedHistory = [...chatHistory, { role: "user", content: userText }];
    setChatHistory(updatedHistory);

    try {
      const response = await fetch(RAG_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: updatedHistory,
          phone: simulatedPhone, // Pass unique WhatsApp key
          source: "whatsapp_simulator",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.autoReply === false && !data.reply) {
        // Lead data is in DB, bot is silent so human admin handles the conversation
        return;
      }

      const botReply =
        data.reply || "Maaf, saya tidak dapat memproses tanggapan saat ini. 🙏";

      setChatHistory((prev) => [...prev, { role: "assistant", content: botReply }]);

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          timestamp: getCurrentTime(),
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: `⚠️ Maaf, tidak dapat terhubung ke server RAG Chatbot API (${RAG_API_URL}). Pastikan server RAG aktif.`,
          timestamp: getCurrentTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0b141a] text-[#e9edef] font-sans antialiased overflow-hidden">
      {/* App Container */}
      <div className="flex flex-col h-full max-w-[820px] w-full mx-auto bg-[#0b141a] relative border-x border-[#2a373f]/40 shadow-2xl">
        {/* HEADER */}
        <header className="flex items-center gap-3.5 px-4 py-3 bg-[#1f2c34] border-b border-[#2a373f] z-10 shrink-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00a884] to-[#005c4b] flex items-center justify-center text-xl shadow-md shrink-0">
            🌸
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-[#e9edef] leading-tight truncate">
              Sebelas Decor Chatbot (Simulasi Web)
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#2a3942] px-3 py-1.5 rounded-lg border border-[#3b4a54] shrink-0">
            <span className="text-xs text-[#8696a0]">📱 No. HP:</span>
            <input
              type="text"
              value={simulatedPhone}
              onChange={(e) => setSimulatedPhone(e.target.value)}
              placeholder="0812..."
              className="bg-transparent text-xs text-[#e9edef] w-28 font-mono outline-none focus:text-white"
              title="Simulasi Nomor WhatsApp Pengguna"
            />
          </div>
        </header>

        {/* CHAT BODY */}
        <div
          ref={chatBodyRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 bg-[#0b141a] scrollbar-thin scrollbar-thumb-white/10"
        >
          {/* Date Separator */}
          <div className="flex justify-center my-2">
            <span className="bg-[#1a2930] text-[#8696a0] text-xs px-4 py-1.5 rounded-lg shadow-sm">
              {todayFormatted || "Hari ini"}
            </span>
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-[#005c4b] to-[#00382e] rounded-xl p-5 mb-2 text-center border border-[#00a884]/20 shadow-lg">
            <div className="text-4xl mb-2">🌸✨</div>
            <h2 className="text-base font-semibold text-[#e9edef] mb-1">
              Selamat Datang di Simulasi Chatbot Sebelas Decor
            </h2>
            <p className="text-xs text-[#8696a0] leading-relaxed max-w-md mx-auto">
              Simulasi interaktif asisten virtual AI untuk pengecekan ketersediaan tanggal acara, info pricelist, katalog dekorasi, dan pendaftaran lead otomatis.
            </p>
          </div>

          {/* Messages List */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } animate-fadeIn`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed shadow-sm relative break-words ${
                  msg.sender === "user"
                    ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none"
                    : "bg-[#1f2c34] text-[#e9edef] rounded-tl-none border border-[#2a373f]"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatMessageText(msg.text),
                  }}
                />
                <span className="block text-[11px] text-[#8696a0] text-right mt-1 opacity-80">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-[#1f2c34] border border-[#2a373f] rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#8696a0] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#8696a0] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#8696a0] animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="flex items-end gap-2.5 p-3.5 bg-[#1f2c34] border-t border-[#2a373f] shrink-0">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputMessage);
                }
              }}
              placeholder="Ketik pesan Anda..."
              rows={1}
              className="w-full bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] text-sm rounded-xl px-4 py-2.5 outline-none resize-none max-h-28 focus:ring-2 focus:ring-[#00a884]/40 transition-all"
            />
          </div>
          <button
            onClick={() => handleSendMessage(inputMessage)}
            disabled={isLoading || !inputMessage.trim()}
            className="w-11 h-11 rounded-full bg-[#00a884] hover:bg-[#00c49a] active:scale-95 disabled:bg-[#2a3942] disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shrink-0 shadow-md"
            aria-label="Kirim pesan"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
