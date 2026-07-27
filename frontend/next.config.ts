import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: 'dist',

  allowedDevOrigins: ['10.0.0.90'],
};

export default withNextIntl(nextConfig);
