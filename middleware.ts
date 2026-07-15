import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./config/i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/:locale/admin(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)", "/trpc(.*)"]);
const isPublicAdminRoute = createRouteMatcher([
  "/admin/login(.*)", 
  "/:locale/admin/login(.*)",
  "/admin/sign-up(.*)",
  "/:locale/admin/sign-up(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) && !isPublicAdminRoute(req)) {
    await auth.protect();
  }

  if (isApiRoute(req)) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
});


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - All files with extensions (e.g. sitemap.xml, robots.txt, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
