import { NextResponse } from "next/server";
import { verifyToken } from "@/lib";

export async function middleware(request) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const token = request.cookies.get("auth")?.value;

  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const decoded = await verifyToken(token); // Note: now async

    if (!decoded) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
