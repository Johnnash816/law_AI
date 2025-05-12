// From supabase docs
// supabase.com/docs/guides/auth/server-side/nextjs

import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // For now the middleware is protected all pages except for the pages listed in the updateSession function
    // If not logged in, the user will be redirected to the login page
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
