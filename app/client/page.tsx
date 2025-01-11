"use client";

import { useSession } from "@/hooks/use-session";

import { Icons } from "@/components/icons";

export default function ClientPage() {
  const { session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="mx-auto flex w-fit items-center gap-2 text-center">
        <Icons.loader className="inline-block size-3.5 animate-spin" />
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center">
        <h1 className="text-xl font-medium text-red-600">
          User Not Authenticated
        </h1>
        <p className="mt-4 text-sm">User email: Not available</p>
        <p className="text-sm">User role: Not available</p>
        <p className="mt-4 font-medium text-gray-700">
          This is a Client Component.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-xl font-medium text-green-600">User Authenticated</h1>
      <p className="mt-4 text-sm">User email: {session?.user?.email}</p>
      <p className="text-sm">
        User role: {session?.user?.role || "Not available"}
      </p>
      <p className="mt-4 font-medium text-gray-700">
        This is a Client Component.
      </p>
    </div>
  );
}
