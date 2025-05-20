// From supabase docs
// supabase.com/docs/guides/auth/server-side/nextjs

import { isAdminRoute, isPublicRoute } from "@/lib/routes";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // check if the environment is development
  const isLocalhost = process.env.NODE_ENV === "development";

  //Assign local supabse url or remote
  const supabaseUrl = isLocalhost
    ? process.env.NEXT_PUBLIC_SUPABASE_LOCAL_URL
    : process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey = isLocalhost
    ? process.env.NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing required environment variables");
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // All API/... routes can only be accessed by logged in users
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return supabaseResponse;
  }

  // If not logged in
  if (!user) {
    // Access to non-public routes will redirect to login
    if (!isPublicRoute(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  //If logged in
  if (user) {
    // home route and public routes will redirect to app
    if (
      request.nextUrl.pathname === "/" ||
      isPublicRoute(request.nextUrl.pathname)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }

    // If try to access admin route
    if (isAdminRoute(request.nextUrl.pathname)) {
      // Check if user is admin, if not admin redirect to app
      const { data: userProfile } = await supabase
        .from("user_profile")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userProfile?.role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/app";
        return NextResponse.redirect(url);
      }
    }
  }

  // If user is logged in homepage and all auth routes redirect to /app
  if (
    user &&
    (request.nextUrl.pathname === "/" ||
      isPublicRoute(request.nextUrl.pathname))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }
  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
