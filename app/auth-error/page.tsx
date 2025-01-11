import Link from "next/link";

import { Icons } from "@/components/icons";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto mt-12 max-w-lg px-4 text-center">
      <h1 className="text-xl font-bold text-red-600">Authentication Error</h1>
      {/* <p className="mt-4 text-pretty text-gray-700">{errorMessage}</p> */}
      <Link
        href="/signin"
        className="group mt-4 flex items-center justify-center p-2 text-blue-600"
      >
        <Icons.arrowLeft className="mr-2 inline-block size-4 transform text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-blue-600" />
        Sign in
      </Link>
    </div>
  );
}
