import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that require authentication or redirection
const authPaths: string[] = ["/Login", "/Signup"];

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("is_auth")?.value === "true";
  const url = request.nextUrl.clone();

  if (isAuthenticated) {
    if (authPaths.includes(url.pathname)) {
      url.pathname = "/profile";
      return NextResponse.redirect(url);
    }
  } else {
    if (!authPaths.includes(url.pathname)) {
      url.pathname = "/Login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Matcher to apply middleware to specific routes
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/Login", "/Signup"],
};
