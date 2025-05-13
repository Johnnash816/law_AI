"use client";
import React, { useState } from "react";
import AuthButton from "@/app/(auth)/(component)/authButton";
import { useRouter } from "next/navigation";
import { signIn } from "@/serverActions/auth";

const SignInForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    //TODO: add form field validation
    const formData = new FormData(event.target as HTMLFormElement);
    // server action to handle sign up
    const result = await signIn(formData);

    if (!result) {
      setError("Something went wrong");
    }
    // if the sign up is successful, redirect to the chat page

    if (result.success === true) {
      router.push("/app");
    } else {
      setError(result.error ?? "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            id="Email"
            name="email"
            className="mt-1 h-10 w-full rounded-md border border-gray-700 bg-white p-2 px-4 text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            className="mt-1 h-10 w-full rounded-md border border-gray-700 bg-white p-2 px-4 text-sm text-gray-700"
          />
        </div>
        <div className="mt-4">
          <AuthButton type="Sign In" loading={loading} />
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SignInForm;
