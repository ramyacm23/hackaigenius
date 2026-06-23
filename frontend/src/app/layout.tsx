import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "HackGenius AI",
  description: "Turn any hackathon problem statement into a winning solution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-brand">⚡ HackGenius</span>
              <span className="hidden text-sm text-slate-400 sm:inline">
                AI
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/" className="text-slate-600 hover:text-brand">
                New
              </Link>
              <Link href="/history" className="text-slate-600 hover:text-brand">
                History
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-center text-xs text-slate-400">
          HackGenius AI — built for hackathon winners.
        </footer>
      </body>
    </html>
  );
}
