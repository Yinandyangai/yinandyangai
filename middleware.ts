// middleware.ts
//
// The auth gate. Phase 0: no enforcement — every page passes through. The
// matcher is wired so Phase 1 just drops in the Supabase session check
// without touching any pages.
//
// Why a stub now? Because routes shape themselves around it. Adding a gate
// later means re-thinking redirects; declaring it up front means the
// product is built with the gate's existence baked in.

import { NextResponse, type NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // Phase 1 drop-in:
  //   const supabase = createMiddlewareClient({ req, res });
  //   const { data: { user } } = await supabase.auth.getUser();
  //   if (!user) return NextResponse.redirect(new URL("/", req.url));
  //   if (!businessProfileExists(user.id)) {
  //     return NextResponse.redirect(new URL("/onboarding", req.url));
  //   }
  return NextResponse.next();
}

// Match only the authed app surface. The marketing / landing page (`/`)
// and the AI API route are handled separately.
export const config = {
  matcher: ["/dashboard/:path*", "/learn/:path*", "/build/:path*"],
};
