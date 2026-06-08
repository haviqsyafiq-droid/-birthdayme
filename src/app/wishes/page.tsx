"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SmoothScroll } from "@/components/SmoothScroll";
import { GalaxyBackground } from "@/components/GalaxyBackground";

export default function WishesPage() {
  const [wishes, setWishes] = useState<any[]>([]);

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

  return (
    <>
      <SmoothScroll />
      <GalaxyBackground />
      <ThemeToggle />
      <main className="min-h-screen flex flex-col items-center w-full relative z-10 py-24 sm:py-32 px-4 sm:px-6 md:px-12">
        <div className="w-full max-w-4xl mx-auto space-y-12">
          <Link href="/" className="inline-flex items-center gap-3 text-muted hover:text-foreground transition-colors uppercase tracking-widest text-sm font-semibold mb-8 border border-[var(--border-color)] px-6 py-3 rounded-full">
            <ArrowLeft size={16} /> Kembali
          </Link>
          
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Semua Pesan & Doa ({wishes.length})
          </h1>

          <div className="space-y-8 sm:space-y-12 pt-8">
            {wishes.length === 0 ? (
              <div className="text-muted text-sm sm:text-base">
                Belum ada pesan yang masuk.
              </div>
            ) : (
              wishes.map((wish) => {
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
        </div>
      </main>
    </>
  );
}
