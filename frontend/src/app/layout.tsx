﻿import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Randevu Platformu',
  description: 'Modern appointment platformu frontend uygulaması',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
