"use client";
//import { signOut } from "@/serverActions/auth";
import { test } from "@/serverActions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    console.log("Signing out");
    setIsLoading(true);
    //const { success } = await signOut();
    const { success } = await test();
    if (success) {
      router.push("/login");
    }
    setIsLoading(false);
    console.log("Signing out finished");
  };
  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleSignOut}
      className="cursor-pointer rounded-md px-4 py-2 text-gray-500 transition-colors duration-250 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-red-400"
    >
      Sign out
    </button>
  );
};

export default SignOutButton;
