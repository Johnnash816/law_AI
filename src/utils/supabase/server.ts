// From supabase docs
// https://supabase.com/docs/guides/auth/server-side/nextjs
import { Database } from "@/utils/supabase/database.type";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
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

  const cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
