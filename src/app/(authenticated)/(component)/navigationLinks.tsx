"use client";
import SignOutButton from "./signOutButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Client component for navigation
export const NavigationLinks = ({
  userProfile,
}: {
  userProfile: { email: string; role: string } | null;
}) => {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");

  return (
    <div className="flex items-center gap-4 font-medium">
      <p>{userProfile?.email}</p>
      {userProfile?.role === "admin" && (
        <>
          {isAdminPath ? (
            <Link
              className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
              href="/app"
            >
              App Dashboard
            </Link>
          ) : (
            <Link
              className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white"
              href="/admin"
            >
              Admin Dashboard
            </Link>
          )}
        </>
      )}
      <SignOutButton />
    </div>
  );
};

export default NavigationLinks;
