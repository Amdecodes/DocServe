import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./config/i18n";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export async function middleware(request: NextRequest) {
  // 1. Run i18n middleware first to generate the base response (handling redirects, etc)
  const response = intlMiddleware(request);

  // 2. Refresh session if needed
  const { user, response: supabaseResponse } = await updateSession(
    request,
    response,
  );

  // 3. Admin Auth Protection
  const path = request.nextUrl.pathname;

  // Normalize path to check if it's an admin route
  // Paths can be like /en/admin, /am/admin, or /admin (if redirecting)
  // We check if it contains /admin
  const isAdminRoute = path.includes("/admin");
  const isLoginPage = path.includes("/admin/login");

  if (isAdminRoute && !isLoginPage) {
    if (!user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL(request.nextUrl);
      // Try to preserve locale if present in path, otherwise default
      // Simple approach: Replace current path with /admin/login, keeping locale prefix if any
      // But path might be /en/admin/dashboard -> /en/admin/login

      // Let's rely on finding where /admin starts
      const adminIndex = path.indexOf("/admin");
      const prefix = path.slice(0, adminIndex); // e.g. /en
      loginUrl.pathname = `${prefix}/admin/login`;

      return NextResponse.redirect(loginUrl);
    }

    // Check if user is the super admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email !== adminEmail) {
      // Not the admin? Redirect to login (essentially access denied)
      // We could also sign them out, but middleware can't easily perform the "signOut" action on the db side,
      // just clear cookies. But redirecting to login is safe.
      const loginUrl = new URL(request.nextUrl);
      const adminIndex = path.indexOf("/admin");
      const prefix = path.slice(0, adminIndex);
      loginUrl.pathname = `${prefix}/admin/login`;
      return NextResponse.redirect(loginUrl);
    }
  }

  // Use the response from updateSession (which wraps the intl response)
  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
