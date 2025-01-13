"use client";

import { useSession } from "@/hooks/use-session";

import { Icons } from "@/components/icons";

export default function ClientPage() {
  const { error, session, status, role } = useSession();

  if (status === "loading") {
    return (
      <div className="mx-auto flex w-fit items-center gap-2 text-center text-muted-foreground">
        <Icons.loader className="inline-block size-3.5 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 text-center">
        <h1 className="text-lg font-semibold text-red-600">
          There was an error checking your authentication status.
        </h1>
        <p className="mt-4 font-medium text-gray-700">
          This is a Client Component.
        </p>
      </div>
    );
  }
  if (status === "unauthenticated") {
    return (
      <div className="px-4 text-center">
        <h1 className="text-lg font-semibold text-red-600">
          Please sign in to access user details.
        </h1>
        <p className="mt-4 font-medium text-muted-foreground">
          This is a Client Component.
        </p>
      </div>
    );
  }
  return (
    <div className="px-4 text-center">
      <h1 className="text-lg font-semibold text-green-600">
        User Authenticated
      </h1>
      <p className="mt-4 text-sm">User email: {session?.user?.email}</p>
      <p className="text-sm">User role: {role ? role : "Not available"}</p>
      <p className="mt-4 font-medium text-muted-foreground">
        This is a Client Component.
      </p>
    </div>
  );
}
