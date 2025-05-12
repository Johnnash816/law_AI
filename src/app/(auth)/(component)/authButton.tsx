import React from "react";

const AuthButton = ({
  type,
  loading,
}: {
  type: "Sign In" | "Sign up" | "Reset Password" | "Forgot Password";
  loading: boolean;
}) => {
  return (
    <button
      disabled={loading}
      type="submit"
      className={`${
        loading ? "bg-gray-600" : "bg-blue-600"
      } w-full cursor-pointer rounded-md px-12 py-2 font-medium text-white`}
    >
      {loading ? "Loading..." : type}
    </button>
  );
};

export default AuthButton;
