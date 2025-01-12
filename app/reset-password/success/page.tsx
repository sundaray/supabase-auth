import Link from "next/link";
import { Icons } from "@/components/icons";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="container mx-auto max-w-md text-center">
      <h1 className="mb-4 mb-6 text-lg font-bold text-green-600">
        Password Reset Successful
      </h1>
      <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
        Your password has been updated successfully
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
