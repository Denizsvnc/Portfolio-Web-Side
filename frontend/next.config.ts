import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  distDir: 'dist',
  // @ts-ignore - allowedDevOrigins Next.js tarafından isteniyor ancak tip tanımında eksik olabilir
  allowedDevOrigins: ['10.0.0.90'],
};

export default withNextIntl(nextConfig);
