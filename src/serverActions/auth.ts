"use server";

import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function signUp(formData: FormData) {
  // create supabase server client
  const supabase = await createClient();
  const credentials = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    // store user name as supabase user metadata
    options: {
      data: {
        username: credentials.username,
      },
    },
  });
  if (error) {
    return { success: false, error: error.message };
  }

  // Create user profile after successful signup
  if (data.user) {
    const { error: profileError } = await supabase.from("user_profile").insert([
      {
        id: data.user.id,
        username: credentials.username,
        email: credentials.email,
      },
    ]);

    if (profileError) {
      // Clean up the auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
      } catch (deleteError) {
        console.error("Failed to delete auth user:", deleteError);
        // Continue with the profile error even if deletion fails
      }
      return {
        success: false,
        error: "Profile creation error: " + profileError.message,
      };
    }
  }

  // Revalidate entire layout tree and purge cache on nested pages
  revalidatePath("/", "layout");
  return { success: true, data: data };
}

export async function signIn(formData: FormData) {
  // create supabase server client
  const supabase = await createClient();
  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data };
}
