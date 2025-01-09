import Link from "next/link";

import { Icons } from "@/components/icons";

export default function CheckEmailPage() {
  return (
    <div className="container mx-auto max-w-md text-center">
      <h1 className="mt-12 text-xl font-bold text-green-600">
        Check Your Email
      </h1>
      <p className="mt-6 leading-relaxed text-gray-700">
        We&apos;ve sent a sign in link.
      </p>
      <p className="mt-2 text-pretty text-sm text-muted-foreground">
        Didn&apos;t receive the email?
      </p>
      <p className="text-pretty text-sm text-muted-foreground">
        Check your spam or junk folder.
      </p>
      <div className="flex justify-center">
        <Link
          href="/signin"
          className="mt-4 flex w-fit items-center justify-center rounded-md bg-accent px-4 py-2 text-blue-600"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
