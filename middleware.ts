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
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

