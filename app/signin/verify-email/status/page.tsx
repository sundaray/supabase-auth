import Link from "next/link";
import { Icons } from "@/components/icons";

type VerificationStatusMessageContent = {
  title: string;
  message: string;
  isSuccess: boolean; // determines styling
};

function VerificationStatusMessage({
  title,
  message,
  isSuccess,
}: VerificationStatusMessageContent) {
  return (
    <div className="mx-auto mt-12 max-w-md px-4 text-center lg:px-8">
      <h2
        className={`text-pretty text-xl font-bold ${
          isSuccess ? "text-green-600" : "text-red-600"
        }`}
      >
        {title}
      </h2>
      <p className="mt-6 text-gray-700">{message}</p>
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

function getVerificationStatusMessageContent(
  message: string | undefined,
): VerificationStatusMessageContent {
  switch (message) {
    case "token-valid":
      return {
        title: "Email Verified",
        message: "You can now sign in with your email and password.",
        isSuccess: true,
      };
    case "token-invalid":
    case "token-expired":
      return {
        title: "Invalid Token",
        message: "Please request a new one.",
        isSuccess: false,
      };
    case "internal-error":
      return {
        title: "Something Went Wrong",
        message: "Please try again.",
        isSuccess: false,
      };
    default:
      // Handle missing or unexpected status
      return {
        title: "Something Went Wrong",
        message: "Please try again.",
        isSuccess: false,
      };
  }
}

export default async function CredentialsEmailVerificationStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const message = (await searchParams).message;

  console.log("Message: ", message);

  const content = getVerificationStatusMessageContent(message);
  return <VerificationStatusMessage {...content} />;
}
