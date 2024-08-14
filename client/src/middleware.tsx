import { NextResponse, type NextRequest } from "next/server";

// Define paths that require authentication or redirection
const authPaths: string[] = [
  "/Login",
  "/Signup",
  "/Reset-Password",
  "/ForgotPassword",
];
const protectedPaths: string[] = ["/Dashboard", "/Profile", "/Settings"]; // Add paths that require authentication

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("is_auth")?.value === "true";
  const url = request.nextUrl.clone();

  // If user is authenticated and trying to access auth paths (Login, Signup, etc.)
  if (isAuthenticated && authPaths.includes(url.pathname)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and trying to access protected paths (Dashboard, Profile, etc.)
  if (!isAuthenticated && protectedPaths.includes(url.pathname)) {
    url.pathname = "/Login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Matcher to apply middleware to specific routes
export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)", // Apply to all routes except API, _next, and static files
    "/Login",
    "/Signup",
    "/Reset-Password",
    "/ForgotPassword", // Auth pages
    "/Dashboard",
    "/Profile",
    "/Settings", // Protected pages
  ],
};
