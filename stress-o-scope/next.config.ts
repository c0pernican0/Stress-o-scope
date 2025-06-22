import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com;
  child-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  object-src 'none';
  form-action 'self';
  frame-ancestors 'none';
  base-uri 'self';
  connect-src 'self' *.groq.com; // Allow connections to Groq API and Vercel insights
`;
// Note: 'unsafe-eval' might be needed for some dev tools or specific libraries.
// 'unsafe-inline' for styles is common with CSS-in-JS or Tailwind inline styles if not strictly managed.
// For production, aim to remove 'unsafe-eval' and minimize 'unsafe-inline' if possible by using nonces or hashes.

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(), // Minify the CSP string
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Permissions-Policy can be added here to restrict browser features
  // {
  //   key: 'Permissions-Policy',
  //   value: 'camera=(), microphone=(), geolocation=()',
  // }
];

const nextConfig: NextConfig = {
  reactStrictMode: true, // Already good for development
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  // If using @next/bundle-analyzer, it would be configured here too
  // Example from previous step (ensure it's merged if both are needed):
  // const withBundleAnalyzer = require('@next/bundle-analyzer')({
  //   enabled: process.env.ANALYZE === 'true',
  // });
  // module.exports = withBundleAnalyzer(nextConfig);
  // For .ts, it's a bit different:
  //
  // import bundleAnalyzer from '@next/bundle-analyzer';
  // const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
  // export default withBundleAnalyzer(nextConfig);
  // For now, just focusing on headers. Bundle analyzer setup is in README.
};

export default nextConfig;
