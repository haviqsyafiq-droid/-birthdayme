"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mouse, Share2, MailOpen } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { Guestbook } from "@/components/Guestbook";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RotatingQuote } from "@/components/RotatingQuote";
import { GalaxyBackground } from "@/components/GalaxyBackground";
import { SmoothScroll } from "@/components/SmoothScroll";

function OpenScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.button
        onClick={onOpen}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="px-12 py-4 border border-[var(--border-color)] rounded-full text-sm sm:text-base tracking-[0.4em] uppercase font-light hover:bg-foreground hover:text-background transition-colors duration-500 cursor-pointer"
      >
        OPEN
      </motion.button>
    </motion.div>
  );
}

function Preloader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground text-background"
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
      onAnimationComplete={onComplete}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-light text-3xl sm:text-5xl tracking-[0.3em]"
      >
        H.F.S.
      </motion.div>
    </motion.div>
  );
}

function TypewriterText({ text, className = "" }: { text: string, className?: string }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      key={key}
      className={`font-bold tracking-tight text-foreground px-4 leading-tight ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child} className="inline-block">
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function Home() {
  const [hasOpened, setHasOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const birthDate = new Date(2003, 5, 9); // 9 June 2003

  useEffect(() => {
    if (localStorage.getItem("hanif_welcome_opened")) {
      setHasOpened(true);
      setLoading(false); // Skip everything if already opened before
    }
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (!isChecking) {
      if (!hasOpened || loading) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    }
  }, [hasOpened, loading, isChecking]);

  const handleOpenClick = () => {
    setHasOpened(true);
    localStorage.setItem("hanif_welcome_opened", "true");
  };

  if (isChecking) return null;

  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  return (
    <>
      <AnimatePresence>
        {!hasOpened && (
          <OpenScreen onOpen={handleOpenClick} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasOpened && loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <SmoothScroll />
      <GalaxyBackground />
      <ThemeToggle />

      <main className="flex-1 flex flex-col items-center w-full relative z-10">
        {hasOpened && !loading && (
          <>
            {/* Hero Section (Full Screen) */}
            <section className="w-full min-h-[100svh] flex flex-col items-center justify-center relative">
              <div className="flex flex-col items-end gap-2 sm:gap-4">
                <TypewriterText 
                  text="Hanif Firas Syafiq" 
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] text-center sm:text-right" 
                />
                <TypewriterText 
                  text="BirthdayMe" 
                  className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] opacity-70 text-right pr-4 sm:pr-8" 
                />
              </div>
              
              <motion.div 
                className="absolute bottom-12 right-6 sm:right-12 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Mouse size={32} className="text-foreground" />
                <span className="text-xs tracking-widest mt-2 uppercase font-medium text-foreground">Scroll</span>
              </motion.div>
            </section>

            {/* Content Section */}
            <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center space-y-32 sm:space-y-40 pb-12">
              
              {/* Rotating Quote Section */}
              <motion.div 
                variants={itemVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }}
                className="w-full"
              >
                <RotatingQuote />
              </motion.div>

              {/* Countdown component */}
              <motion.div 
                variants={itemVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }}
                className="w-full"
              >
                <Countdown birthDate={birthDate} />
              </motion.div>

              {/* Guestbook component */}
              <motion.div 
                variants={itemVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }}
                className="w-full"
              >
                <Guestbook />
              </motion.div>

            </section>
          </>
        )}
      </main>
    </>
  );
}
