import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/api/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import ChatWidget from "@/components/chat/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
