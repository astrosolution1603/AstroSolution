import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const role = req.auth?.user?.role;

  const protectedRoutes = ["/chat", "/kundli", "/horoscope", "/match", "/tarot", "/panchang", "/profile", "/astrologer", "/masterpanel", "/admin"];
  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Redirect logged-in users away from the landing page and login/register pages
  const isAuthPage = nextUrl.pathname === "/" || nextUrl.pathname === "/login" || nextUrl.pathname === "/astrologer-login" || nextUrl.pathname === "/register" || nextUrl.pathname === "/astrologer-register";
  
  if (isAuthPage && isAuthenticated) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/masterpanel", nextUrl));
    } else if (role === "ASTROLOGER") {
      return NextResponse.redirect(new URL("/astrologer", nextUrl));
    } else {
      return NextResponse.redirect(new URL("/chat", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
