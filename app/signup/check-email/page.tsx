import Link from "next/link";

import { Icons } from "@/components/icons";

export default function CheckEmailPage() {
  return (
    <div className="container mx-auto max-w-md text-center">
      <h1 className="mb-6 text-lg font-bold text-green-600">
        Check Your Email
      </h1>
      <p className="mb-2 text-sm text-muted-foreground">
        We&apos;ve sent you a sign-up link
      </p>
      <Link
        href="/signin"
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600"
      >
        Sign in to your account
        <Icons.arrowRight className="size-4" />
      </Link>
    </div>
  );
}
