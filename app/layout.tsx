import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LADS Lab — 데이터과학 선형대수학',
  description:
    '예측하고, 한 줄씩 실행하고, 행렬의 변화를 눈으로 확인하는 선형대수학 학습 공간',
  openGraph: {
    title: 'LADS Lab — 데이터과학 선형대수학',
    description:
      '생각하고, 실행하고, 이해하는 선형대수학 인터랙티브 TA 학습 공간',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'LADS Lab — 생각하고, 실행하고, 이해하는 선형대수학',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LADS Lab — 데이터과학 선형대수학',
    description:
      '생각하고, 실행하고, 이해하는 선형대수학 인터랙티브 TA 학습 공간',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
