import type { Metadata } from 'next';
import './globals.css';

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://lads-linear-algebra-lab.statchan1106.chatgpt.site'
).replace(/\/$/, '');

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'KAIST MAS110 Practice Sessions',
  description:
    'Chapter-by-chapter practice materials for KAIST MAS110 · Linear Algebra for Data Science.',
  openGraph: {
    title: 'KAIST MAS110 Practice Sessions',
    description:
      'Review lecture ideas, trace the Python line by line, and compare each visible mathematical change.',
    images: [
      {
        url: `${siteUrl}/og-mas110.png`,
        width: 1730,
        height: 909,
        alt: 'An augmented matrix before and after one Gaussian elimination step.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KAIST MAS110 Practice Sessions',
    description:
      'Chapter-by-chapter visual code walkthroughs for Linear Algebra for Data Science.',
    images: [`${siteUrl}/og-mas110.png`],
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
