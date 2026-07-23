import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // We exclude /admin and other next.js internals here
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for all requests that have a locale prefix
    '/(tr|en|de|ru)/:path*',

    // Enable redirects that add the missing locale
    // (e.g. `/pathnames` -> `/en/pathnames`)
    // Exclude /admin, API routes, next static files, etc.
    '/((?!api|_next|_vercel|admin|.*\\..*).*)'
  ]
};
