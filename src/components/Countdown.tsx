"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownProps {
  birthDate: Date;
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <div className="relative overflow-hidden h-20 sm:h-32 lg:h-40 w-full flex justify-center items-center bg-panel clean-border rounded-2xl">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute text-5xl sm:text-7xl lg:text-9xl font-light tracking-tighter text-foreground"
        >
          {value.toString().padStart(2, '0')}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Countdown({ birthDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ Hari: 0, Jam: 0, Menit: 0, Detik: 0 });
  const [timePassed, setTimePassed] = useState({ Hari: 0, Jam: 0, Menit: 0, Detik: 0 });
  const [progress, setProgress] = useState(0);
  const [isBirthdayDay, setIsBirthdayDay] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      const isBirthday = now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate();
      setIsBirthdayDay(isBirthday);

      let nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      if (now.getTime() > nextBirthday.getTime() && !isBirthday) {
        nextBirthday = new Date(now.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
      }
      
      const diff = nextBirthday.getTime() - now.getTime();
      setTimeLeft({
        Hari: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        Jam: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        Menit: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
        Detik: Math.max(0, Math.floor((diff / 1000) % 60)),
      });

      const passedMs = now.getTime() - birthDate.getTime();
      setTimePassed({
        Hari: Math.floor(passedMs / (1000 * 60 * 60 * 24)),
        Jam: Math.floor((passedMs / (1000 * 60 * 60)) % 24),
        Menit: Math.floor((passedMs / 1000 / 60) % 60),
        Detik: Math.floor((passedMs / 1000) % 60),
      });

      const maxAgeMs = 63 * 365.25 * 24 * 60 * 60 * 1000;
      setProgress(Math.min((passedMs / maxAgeMs) * 100, 100));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-16">
      {!isBirthdayDay ? (
        <div className="grid grid-cols-4 gap-4 sm:gap-8 text-center">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <AnimatedNumber value={value} />
              <div className="text-xs sm:text-base text-muted uppercase tracking-widest mt-4 sm:mt-6 font-semibold">
                {unit}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl sm:text-6xl font-bold text-foreground mb-4"
          >
            Barakallah Fii Umrik!
          </motion.h2>
          <p className="text-muted text-lg">Hari ini adalah hari milad Anda.</p>
        </div>
      )}

      <div className="clean-border rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-panel">
        <h3 className="text-sm sm:text-lg font-semibold text-foreground uppercase tracking-widest mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[var(--border-color)] pb-6 gap-4">
          <span>Progres Usia</span>
          <span className="text-foreground">{progress.toFixed(6)}%</span>
        </h3>
        <div className="h-3 w-full bg-[var(--border-color)] rounded-full overflow-hidden mb-8">
          <motion.div 
            className="h-full bg-foreground rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted font-mono tracking-wide uppercase">Jejak Terlalui:</span>
            <span className="text-xs sm:text-sm text-foreground font-mono tracking-wide">
              {timePassed.Hari.toLocaleString('id-ID')} Hari {timePassed.Jam} Jam {timePassed.Menit} Menit {timePassed.Detik} Detik
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-[var(--border-color)]/50">
            <div className="text-xs sm:text-sm text-muted uppercase tracking-widest font-semibold opacity-70">
              Rata-rata Usia: 63 Tahun
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
