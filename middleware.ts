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

export default clerkMiddleware(async (auth, req) => {
  try {
    if (isAdminRoute(req)) {
      const { userId } = await auth();
      if (!userId) {
        return (await auth()).redirectToSignIn();
      }
    }

    if (isApiRoute(req)) {
      return NextResponse.next();
    }

    return intlMiddleware(req);
  } catch (error) {
    console.error("Clerk Middleware Error:", error);
    return intlMiddleware(req);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
