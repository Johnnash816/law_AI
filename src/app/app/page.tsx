import { createClient } from "@/utils/supabase/server";
import Chat from "./(component)/chat";

type UserProfile = {
  id: string;
  username: string;
};

export default async function Home() {
  // supabase client
  const supabase = await createClient();
  // get user from supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // get username from supabase user_profile table
  const { data: username } = (await supabase
    .from("user_profile")
    .select("username")
    .eq("id", user?.id)
    .single()) as { data: UserProfile | null };
  // TODO: move this to chat route and add redirect to chat if logged in for login page
  return (
    <div className="flex h-full w-full">
      <div className="w-48 bg-amber-400">side</div>

      <Chat username={username?.username} />
    </div>
  );
}
