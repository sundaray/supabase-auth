import Link from "next/link";
import { Icons } from "@/components/icons";

export default function ResetPasswordSuccessPage() {
  return (
    <div className="mx-auto mt-12 max-w-sm px-4 text-center lg:px-8">
      <h2 className="text-xl font-bold text-green-600">Password Reset</h2>
      <p className="my-4 text-gray-700">
        Your password has been reset successfully.
      </p>
      <Link
        href="/signin"
        className="group flex items-center justify-center p-2 text-blue-600"
      >
        <Icons.arrowLeft className="mr-2 inline-block size-4 transform text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:text-blue-600" />
        Sign in
      </Link>
    </div>
  );
}
