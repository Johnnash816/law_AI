"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/chat");
  }, [router]);
  return <div className="flex h-full w-full">Home page</div>;
}
