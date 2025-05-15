import { createClient } from "@/utils/supabase/server";
import Chat from "./(component)/chat";

export default async function Page() {
  // supabase client
  const supabase = await createClient();
  // get user from supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // get username from supabase user_profile table
  const { data: userProfile } = await supabase
    .from("user_profile")
    .select("username")
    .eq("id", user?.id as string)
    .single();
  // TODO: move this to chat route and add redirect to chat if logged in for login page
  return (
    <div className="h-full w-full">
      <Chat username={userProfile?.username} />
    </div>
  );
}
