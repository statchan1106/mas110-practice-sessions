import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lads-linear-algebra-lab.statchan1106.chatgpt.site'),
  title: 'KAIST MAS110 — Foundations of LADS',
  description:
    'An independent interactive TA companion for KAIST MAS110 · Linear Algebra for Data Science.',
  openGraph: {
    title: 'KAIST MAS110 — Foundations of LADS',
    description:
      'Concept primer, prediction, execution, visual interpretation, and the complete notebook library.',
    images: [
      {
        url: 'https://lads-linear-algebra-lab.statchan1106.chatgpt.site/og.png',
        width: 1200,
        height: 630,
        alt: 'Foundations of LADS — See every row operation.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KAIST MAS110 — Foundations of LADS',
    description: 'Concept primer, interactive walkthrough, and complete notebook library.',
    images: ['https://lads-linear-algebra-lab.statchan1106.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
