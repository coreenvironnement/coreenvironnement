import { NextResponse } from "next/server"

import { getPostLoginRedirectPath } from "@/lib/auth/post-login-path"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const rawNext = searchParams.get("next")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const destination = user
        ? await getPostLoginRedirectPath(supabase, user.id, rawNext)
        : rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
          ? rawNext
          : "/mes-commandes"
      return NextResponse.redirect(`${origin}${destination}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
