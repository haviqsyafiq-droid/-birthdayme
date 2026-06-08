import type { Metadata } from "next";
import { Lora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BirthdayMe - Hanif Firas Syafiq",
  description: "Personal Guestbook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${lora.variable} min-h-full flex flex-col font-sans selection:bg-foreground selection:text-background transition-colors duration-500`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
