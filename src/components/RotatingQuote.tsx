"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUOTES = [
  {
    text: "Sebaik-baik manusia adalah yang paling panjang umurnya dan paling baik amalnya.",
    source: "HR. Tirmidzi"
  },
  {
    text: "Dan Aku tidak menciptakan jin dan manusia melainkan supaya mereka beribadah kepada-Ku.",
    source: "QS. Adz-Dzariyat: 56"
  },
  {
    text: "Manfaatkanlah lima perkara sebelum datang lima perkara: masa mudamu sebelum masa tuamu...",
    source: "HR. Al Hakim"
  },
  {
    text: "Tidaklah bergeser kedua kaki seorang hamba pada hari kiamat sehingga ia ditanya tentang umurnya untuk apa ia habiskan.",
    source: "HR. Tirmidzi"
  }
];

export function RotatingQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % QUOTES.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto text-center py-12 border-y border-[var(--border-color)] relative h-[220px] sm:h-[180px] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute w-full px-6 flex flex-col items-center justify-center"
        >
          <p className="text-xl sm:text-3xl italic text-muted font-light tracking-wide leading-relaxed max-w-[90%] mx-auto text-center">
            "{QUOTES[index].text}"
          </p>
          <p className="text-xs sm:text-sm font-semibold text-foreground tracking-widest uppercase mt-6 text-center">
            [ {QUOTES[index].source} ]
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
