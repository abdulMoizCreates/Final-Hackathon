import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/api/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import ChatWidget from "@/components/chat/ChatWidget";

/* Display — geometric grotesque for headlines & brand (Space Grotesk, 300–700 variable) */
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

/* UI & body — the clean, neutral workhorse (Inter variable) */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Data — timestamps, ids, tabular figures */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HCM Lite",
  description: "Human capital management — attendance, leave and payroll that agree with each other",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${grotesk.variable} ${inter.variable} ${geistMono.variable} antialiased`}
        style={{ background: "var(--canvas)" }}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <ChatWidget />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
