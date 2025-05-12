// From supabase docs
// supabase.com/docs/guides/auth/server-side/nextjs

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
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

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
