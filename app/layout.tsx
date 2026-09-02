import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lads-linear-algebra-lab.statchan1106.chatgpt.site'),
  title: 'Foundations of LADS — Interactive Course Companion',
  description:
    'Predict a row operation, run one line, and see exactly how Gaussian elimination creates each zero.',
  openGraph: {
    title: 'Foundations of LADS',
    description:
      'See every row operation.',
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
    title: 'Foundations of LADS',
    description: 'See every row operation.',
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
