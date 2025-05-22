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

  // Check if user already exists in user_profile
  const { data: existingUser, error: checkError } = await supabase
    .from("user_profile")
    .select("email")
    .eq("email", credentials.email)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" error
    return { success: false, error: "Error checking existing user" };
  }

  if (existingUser) {
    return { success: false, error: "Email already registered" };
  }
  // if the sign up is successful, redirect to the chat page
  // If email confirmation is enabled, auth.user will create a user wth waiting for confirmation status
  // A user will be created in user_profile, there will be no session(not logged in)
  // When sign up using existing email, auth.signup will not return error, so we need to check explicitly

  // If user confirmation is disabled, auth.user will create a user with a session (logged in)
  // A user will be created in user_profile
  // When sign up using existing email, auth.signup will return user exist error

  // Can use supabase admin to directly create a user in user_profile, without signing in if we do not use
  // auth.signup but use admin functions only

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
        role: "normal",
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
  revalidatePath("/", "layout");
  return { success: true, data: data };
}

export async function signOut() {
  // create supabase server client
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath("/", "layout");
  return { success: true };
}

export async function test() {
  console.log("Intest");
  // Create a promise that resolves after 90 seconds
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Operation completed after 90 seconds",
      });
    }, 90000);
  });

  try {
    // Wait for the timeout
    console.log("timeout exec");
    const result = await timeoutPromise;
    console.log("time out finish");
    revalidatePath("/", "layout");
    return { success: true, result: result };
  } catch (error) {
    return { success: false, error: error };
    console.log(error);
  }
}
