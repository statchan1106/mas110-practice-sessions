import type { NextConfig } from 'next';

const isPagesBuild = process.env.GITHUB_PAGES_BUILD === 'true';
const pagesBaseUrl = (process.env.PAGES_BASE_URL ?? '').replace(/\/$/, '');

const nextConfig: NextConfig = isPagesBuild
  ? {
      output: 'export',
      ...(pagesBaseUrl ? { assetPrefix: pagesBaseUrl } : {}),
    }
  : {};

export default nextConfig;
