import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yeezify',
  description: 'Your personal Ye music experience',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
