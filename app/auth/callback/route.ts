import { NextResponse } from "next/server"

import { ensureProSignupDraftFromMetadata } from "@/app/auth/signup-actions"
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
      if (
        user?.user_metadata?.pro_signup_draft ||
        user?.user_metadata?.signup_phone
      ) {
        await ensureProSignupDraftFromMetadata()
      }
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
