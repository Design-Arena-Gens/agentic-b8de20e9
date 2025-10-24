import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Generatore Prompt Analisi di Mercato',
  description: 'Crea prompt completi per analisi di mercato in italiano',
  metadataBase: new URL('https://agentic-b8de20e9.vercel.app')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
