import { NextResponse, type NextRequest } from "next/server"

import {
  getMaintenanceBypassSecret,
  isMaintenanceEnabled,
  MAINTENANCE_COOKIE,
} from "@/lib/maintenance"
import { updateSession } from "@/lib/supabase/middleware"

/** Chemins critiques qui restent accessibles même en maintenance. */
function isMaintenanceExemptPath(pathname: string) {
  if (pathname.startsWith("/api/stripe")) return true
  if (pathname.startsWith("/.well-known")) return true
  return false
}

function shouldBypassMaintenance(request: NextRequest) {
  const secret = getMaintenanceBypassSecret()
  if (!secret) return false

  if (request.cookies.get(MAINTENANCE_COOKIE)?.value === secret) {
    return true
  }

  const preview = request.nextUrl.searchParams.get("preview")
  return preview === secret
}

function maintenanceResponse(request: NextRequest) {
  const secret = getMaintenanceBypassSecret()
  const preview = request.nextUrl.searchParams.get("preview")

  if (secret && preview === secret) {
    const url = request.nextUrl.clone()
    url.pathname = request.nextUrl.pathname === "/maintenance" ? "/" : request.nextUrl.pathname
    url.searchParams.delete("preview")

    const response = NextResponse.redirect(url)
    response.cookies.set(MAINTENANCE_COOKIE, secret, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    return response
  }

  if (request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.next()
  }

  return NextResponse.rewrite(new URL("/maintenance", request.url))
}

export async function middleware(request: NextRequest) {
  if (
    isMaintenanceEnabled() &&
    !isMaintenanceExemptPath(request.nextUrl.pathname) &&
    !shouldBypassMaintenance(request)
  ) {
    return maintenanceResponse(request)
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
