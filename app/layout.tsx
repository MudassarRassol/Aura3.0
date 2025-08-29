import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import { Providers } from "@/components/providers";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI AURA3.0",
  description: "Aura 3.0 is an AI-powered therapy assistant designed to provide mental wellness support, mindfulness exercises, and guided self-care activities. The app uses modern AI integration, a clean UI, and interactive features to help users improve their emotional health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
           <Header/>
           {children}
           <Footer/>
           <Toaster />
        </Providers>
      </body>
    </html>
  );
}
