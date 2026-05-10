import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yeezify',
  description: 'Your personal Ye music experience',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-ye-black text-white">
      <body className="min-h-full bg-ye-black text-white antialiased">{children}</body>
    </html>
  );
}
