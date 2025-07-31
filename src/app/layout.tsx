import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Web3Provider } from "@/app/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verifund",
  description: "On-Chain Crowdfunding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window !== "undefined") {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        /Received `false` for a non-boolean attribute `invalid`/.test(args[0])
      ) {
        return;
      }
      originalError(...args);
    };
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider>
            <Toaster position="top-right" />
            <main className="min-h-screen bg-background">
              <Navbar />
              {children}
              <Footer />
            </main>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
