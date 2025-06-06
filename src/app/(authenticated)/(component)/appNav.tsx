import { createClient } from "@/utils/supabase/server";
import RouteLocation from "./routeLocation";
import NavigationLinks from "./navigationLinks";

const AppNav = async () => {
  // supabase client
  const supabase = await createClient();
  // get user from supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // get username from supabase user_profile table
  const { data: userProfile } = await supabase
    .from("user_profile")
    .select("email, role")
    .eq("id", user?.id as string)
    .single();

  return (
    <div className="fixed top-0 flex h-16 w-full border-b-1 border-gray-200 bg-white pl-18">
      <div className="flex w-full items-center justify-between px-8">
        <RouteLocation />
        <NavigationLinks userProfile={userProfile} />
      </div>
    </div>
  );
};

export default AppNav;
