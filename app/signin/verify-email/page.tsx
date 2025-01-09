import Link from "next/link";
import { Icons } from "@/components/icons";

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-md px-4 text-center lg:px-8">
      <h1 className="mt-12 text-xl font-bold">Verify Your Email</h1>
      <p className="mt-6 leading-relaxed text-gray-700">
        We&apos;ve sent a verification link to your email.
      </p>
      <p className="mt-4 text-pretty text-sm text-muted-foreground">
        Didn&apos;t receive the email? Check your spam or junk folder.
      </p>
      <Link
        href="/signin"
        className="group mt-4 flex items-center justify-center p-2 text-blue-600"
      >
        <Icons.arrowLeft className="mr-2 inline-block size-4 transform text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-blue-600" />
        Sign In
      </Link>
    </div>
  );
}
