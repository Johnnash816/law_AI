import { createClient } from "@supabase/supabase-js";
import { Database } from "@/utils/supabase/database.type";
// check if the environment is development
const isLocalhost = process.env.NODE_ENV === "development";

//Assign local supabse url or remote
const supabaseUrl = isLocalhost
  ? process.env.NEXT_PUBLIC_SUPABASE_LOCAL_URL
  : process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey = isLocalhost
  ? process.env.SUPABASE_LOCAL_SERVICE_ROLE_KEY
  : process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing required environment variables");
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
