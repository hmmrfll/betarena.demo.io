import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Check if the user is trying to access protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    // In a real app, you would check for a valid JWT token here
    // For now, we'll let the client-side auth handle it
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
