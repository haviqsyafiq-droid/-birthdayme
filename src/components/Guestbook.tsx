"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Guestbook() {
  const [wishes, setWishes] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const fetchWishes = async () => {
    try {
      const res = await fetch("/api/wishes");
      if (res.ok) {
        const data = await res.json();
        setWishes(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWishes();

    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      if (localStorage.getItem("hanif_wish_submitted") === "true") {
        setHasSubmitted(true);
      }
    }

    const channel = supabase
      .channel('public:wishes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, payload => {
        setWishes(current => {
          if (current.find(w => w.id === payload.new.id)) return current;
          return [payload.new, ...current].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, isAnonymous }),
      });
      const data = await res.json();

      if (res.ok) {
        setName("");
        setMessage("");
        setIsAnonymous(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
        fetchWishes();
        
        if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
          setHasSubmitted(true);
          localStorage.setItem("hanif_wish_submitted", "true");
        }
      } else {
        setErrorMsg(data.error || "Gagal mengirim ucapan.");
        if (res.status === 429) {
          if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
            setHasSubmitted(true);
            localStorage.setItem("hanif_wish_submitted", "true");
          }
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-16 sm:space-y-24 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={() => setShowToast(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background text-foreground px-6 sm:px-10 py-10 sm:py-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center gap-6 w-full max-w-xl border-2 border-[var(--border-color)]"
            >
              <h4 className="font-bold text-[24px] tracking-tight">Jazakumullah Khairan Katsiran</h4>
              <p className="text-[20px] opacity-90 leading-relaxed font-light">
                Semoga Allah membalas doa tulus Anda dengan kebaikan yang berlipat ganda. Semoga Allah senantiasa merahmati Anda beserta keluarga, memberikan kesehatan yang paripurna, keberkahan rezeki yang melimpah, dan memudahkan segala urusan Anda di dunia maupun di akhirat kelak. Amin Ya Rabbal 'Alamin.
              </p>
              <button 
                onClick={() => setShowToast(false)} 
                className="mt-4 px-10 py-4 bg-foreground text-background rounded-full font-semibold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity cursor-pointer"
              >
                Tutup Pesan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="clean-border rounded-2xl p-8 sm:p-16 bg-panel shadow-sm">
        <h2 className="text-2xl sm:text-4xl font-semibold text-foreground mb-8 sm:mb-12 tracking-tight">
          Tinggalkan Pesan & Doa
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
          {errorMsg && (
            <div className="text-red-500 text-sm sm:text-base font-medium">
              {errorMsg}
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Nama Anda"
                required
                disabled={hasSubmitted}
                maxLength={50}
                className="w-full px-0 py-3 sm:py-4 border-b border-[var(--border-color)] bg-transparent text-foreground placeholder-[var(--muted)] focus:border-foreground outline-none transition-colors text-lg sm:text-xl disabled:opacity-50"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <label className={`flex items-center gap-3 group ${hasSubmitted ? "opacity-50" : "cursor-pointer"}`}>
              <div className="relative flex items-center justify-center w-6 h-6 border-2 border-[var(--border-color)] rounded-md group-hover:border-foreground transition-colors">
                <input 
                  type="checkbox"
                  disabled={hasSubmitted}
                  className="absolute opacity-0 w-full h-full cursor-pointer disabled:cursor-default"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                {isAnonymous && <div className="w-3 h-3 bg-foreground rounded-sm" />}
              </div>
              <span className="text-sm sm:text-base text-muted group-hover:text-foreground transition-colors">Sembunyikan nama (Hamba Allah)</span>
            </label>
          </div>
          <div>
            <textarea
              placeholder="Tuliskan harapan & doa terbaik Anda..."
              required
              disabled={hasSubmitted}
              rows={4}
              maxLength={500}
              className="w-full px-0 py-3 sm:py-4 border-b border-[var(--border-color)] bg-transparent text-foreground placeholder-[var(--muted)] focus:border-foreground outline-none transition-colors resize-none text-lg sm:text-xl disabled:opacity-50"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || hasSubmitted}
              className="group w-full sm:w-auto bg-foreground text-background px-8 sm:px-12 py-4 sm:py-5 rounded-full font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg shadow-[0_8px_30px_rgba(var(--foreground-rgb),0.12)] hover:shadow-[0_8px_30px_rgba(var(--foreground-rgb),0.2)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
            >
              <span>{isSubmitting ? "Mengirim..." : hasSubmitted ? "Pesan Terkirim" : "Kirim Pesan"}</span>
              {!hasSubmitted && !isSubmitting && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-8 sm:space-y-12">
        <h3 className="text-sm sm:text-base font-semibold text-muted uppercase tracking-widest border-b border-[var(--border-color)] pb-4 sm:pb-6">
          Daftar Pesan ({wishes.length})
        </h3>
        
        <div className="space-y-8 sm:space-y-12">
          {wishes.length === 0 ? (
            <div className="text-muted text-sm sm:text-base">
              Belum ada pesan yang masuk.
            </div>
          ) : (
            wishes.slice(0, 4).map((wish) => {
              const isAnon = wish.name?.endsWith("||ANON");
              const displayName = isAnon ? "Hamba Allah" : wish.name;

              return (
                <div key={wish.id} className="pb-8 sm:pb-12 border-b border-[var(--border-color)] last:border-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <h4 className="font-semibold text-foreground text-xl sm:text-2xl">{displayName}</h4>
                    <span className="text-xs sm:text-sm text-muted">
                      {new Date(wish.created_at || wish.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-foreground opacity-80 leading-relaxed text-base sm:text-xl whitespace-pre-wrap">
                    {wish.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {wishes.length > 4 && (
          <div className="pt-4 flex justify-center">
            <a 
              href="/wishes" 
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-foreground hover:bg-foreground hover:text-background transition-colors uppercase tracking-widest border border-foreground rounded-full px-8 py-4 cursor-pointer"
            >
              Buka Pesan Lainnya
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
