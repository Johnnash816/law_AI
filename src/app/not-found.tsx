import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">404 - Page Not Found</h2>
        <p className="mt-2">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          className="mt-2 block rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-500"
          href="/"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
