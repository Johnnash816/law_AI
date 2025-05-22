"use client";
import { signOut } from "@/serverActions/auth";

import { useRouter } from "next/navigation";
import { useState } from "react";

const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    const { success } = await signOut();

    if (success) {
      router.push("/login");
    }
    setIsLoading(false);
  };
  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleSignOut}
      className="cursor-pointer rounded-md px-4 py-2 text-gray-500 transition-colors duration-250 hover:bg-gray-100"
    >
      Sign out
    </button>
  );
};

export default SignOutButton;
