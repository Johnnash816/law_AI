"use client";

import { usePathname } from "next/navigation";
const pathNames = {
  "/admin": "Admin",
  "/app": "Chat",
  "/search": "Semantic Search",
};

const RouteLocation = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="text-2xl font-semibold">
      <h1>{pathNames[pathname as keyof typeof pathNames]}</h1>
    </div>
  );
};

export default RouteLocation;
